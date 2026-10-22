#!/usr/bin/env python3
"""Generate static, per-hero-word GPT-2 attention scores for the site."""

from __future__ import annotations

import hashlib
import json
import os
import re
import subprocess
import tempfile
from pathlib import Path

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer


ROOT = Path(__file__).resolve().parents[1]
MODEL_ID = "openai-community/gpt2"
MODEL_REVISION = "6c0e6080953db56375760c0471a8c5f2929baf11"
LAYERS_TO_AVERAGE = 4
SCHEMA_VERSION = 2


def sha256(text: str) -> str:
    return "sha256:" + hashlib.sha256(text.encode("utf-8")).hexdigest()


def utf16_offset(text: str, codepoint_offset: int) -> int:
    return len(text[:codepoint_offset].encode("utf-16-le")) // 2


def collect_content() -> dict:
    result = subprocess.run(
        ["node", str(ROOT / "scripts" / "export_attention_content.mjs")],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


def build_prompt(content: dict) -> tuple[str, dict[str, tuple[int, int]], tuple[int, int]]:
    pieces: list[str] = []
    target_ranges: dict[str, tuple[int, int]] = {}
    cursor = 0

    for block in content["blocks"]:
        prefix = f"\n[PAGE BLOCK {block['id']}]\n"
        suffix = "\n"
        pieces.extend((prefix, block["text"], suffix))
        cursor += len(prefix)
        target_ranges[block["id"]] = (cursor, cursor + len(block["text"]))
        cursor += len(block["text"]) + len(suffix)

    prefix = "\n[HERO QUERY]\n"
    pieces.append(prefix)
    cursor += len(prefix)
    hero = content["heroQuery"]
    hero_range = (cursor, cursor + len(hero))
    pieces.append(hero)
    return "".join(pieces), target_ranges, hero_range


def corpus_text(content: dict) -> str:
    values = [item for block in content["blocks"] for item in (block["id"], block["text"])]
    values.extend(("$hero", content["heroQuery"]))
    return "\0".join(values)


def main() -> None:
    content = collect_content()
    prompt, target_ranges, hero_range = build_prompt(content)

    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, revision=MODEL_REVISION, use_fast=True)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID,
        revision=MODEL_REVISION,
        attn_implementation="eager",
    )
    model.eval()

    encoded = tokenizer(prompt, return_offsets_mapping=True, return_tensors="pt", add_special_tokens=False)
    offsets = encoded.pop("offset_mapping")[0].tolist()
    input_ids = encoded["input_ids"]
    position_limit = getattr(model.config, "n_positions", None) or getattr(model.config, "max_position_embeddings", None)
    if position_limit and input_ids.shape[1] > position_limit:
        raise ValueError(
            f"Attention prompt is {input_ids.shape[1]} tokens; {MODEL_ID} supports {position_limit}. "
            "Shorten the selected page content or choose a longer-context model; no truncation was applied."
        )

    word_matches = list(re.finditer(r"\S+", content["heroQuery"], flags=re.UNICODE))
    query_positions = []
    for match in word_matches:
        start, end = hero_range[0] + match.start(), hero_range[0] + match.end()
        positions = [i for i, (left, right) in enumerate(offsets) if right > start and left < end]
        if not positions:
            raise ValueError(f"Could not map hero word {match.group(0)!r} to tokenizer offsets")
        query_positions.append(positions)

    target_token_positions: dict[str, list[int]] = {}
    target_words: dict[str, list[tuple[int, int, list[int]]]] = {}
    for block in content["blocks"]:
        block_start, block_end = target_ranges[block["id"]]
        positions = [
            i for i, (left, right) in enumerate(offsets)
            if right > block_start and left < block_end and right > left
        ]
        target_token_positions[block["id"]] = positions
        words = []
        for match in re.finditer(r"\S+", block["text"], flags=re.UNICODE):
            absolute_start = block_start + match.start()
            absolute_end = block_start + match.end()
            word_tokens = [
                i for i in positions
                if offsets[i][1] > absolute_start and offsets[i][0] < absolute_end
            ]
            if word_tokens:
                words.append((match.start(), match.end(), word_tokens))
        target_words[block["id"]] = words

    content_positions = sorted({position for positions in target_token_positions.values() for position in positions})
    if not content_positions:
        raise ValueError("No page-content tokens were produced")

    with torch.inference_mode():
        output = model(**encoded, output_attentions=True, use_cache=False)
        token_vectors = model.get_input_embeddings()(input_ids)[0].float().cpu()

    if not output.attentions:
        raise RuntimeError("The selected Transformers attention implementation returned no attention tensors")
    first_layer = max(0, len(output.attentions) - LAYERS_TO_AVERAGE)
    # Each tensor is batch × heads × query-position × key-position.
    final_layers = torch.stack([layer[0].float().cpu() for layer in output.attentions[first_layer:]])
    attention_by_query: dict[str, dict[str, list[dict[str, float | int]]]] = {}
    similarity_by_query: dict[str, dict[str, list[dict[str, float | int]]]] = {}

    for word_index, positions in enumerate(query_positions):
        # Average the hero word's subword query rows, all heads, and final four layers.
        token_scores = final_layers[:, :, positions, :].mean(dim=(0, 1, 2))
        page_mass = token_scores[content_positions].sum().item()
        if page_mass <= 0:
            raise RuntimeError(f"No attention mass reached page content for hero word {word_index}")

        attention_by_block = {}
        similarity_by_block = {}
        hero_vector = token_vectors[positions].mean(dim=0)
        for block in content["blocks"]:
            attention_scores = []
            similarity_scores = []
            for start, end, token_positions in target_words[block["id"]]:
                attention_score = float(token_scores[token_positions].mean().item() / page_mass)
                target_vector = token_vectors[token_positions].mean(dim=0)
                similarity_score = float(torch.nn.functional.cosine_similarity(
                    hero_vector.unsqueeze(0), target_vector.unsqueeze(0), dim=1,
                ).item())
                spans = {
                    "start": utf16_offset(block["text"], start),
                    "end": utf16_offset(block["text"], end),
                }
                attention_scores.append({**spans, "score": attention_score})
                similarity_scores.append({**spans, "score": similarity_score})
            attention_by_block[block["id"]] = attention_scores
            similarity_by_block[block["id"]] = similarity_scores
        query_id = f"hero-word-{word_index}"
        attention_by_query[query_id] = attention_by_block
        similarity_by_query[query_id] = similarity_by_block

    manifest = {
        "schemaVersion": SCHEMA_VERSION,
        "model": {"id": MODEL_ID, "revision": MODEL_REVISION},
        "method": {
            "prompt": "selected project descriptions and experience bullets followed by the exact hero phrase",
            "layers": list(range(first_layer, len(output.attentions))),
            "heads": "mean",
            "querySubtokens": "mean",
            "targetSubtokens": "mean per whitespace-delimited word",
            "normalization": "renormalized over selected page-content tokens per hero word",
            "offsetUnit": "utf16",
        },
        "promptHash": sha256(prompt),
        "contentHash": sha256(corpus_text(content)),
        "contentHashes": {
            **{block["id"]: sha256(block["text"]) for block in content["blocks"]},
            "$hero": sha256(content["heroQuery"]),
        },
        "queries": {
            "attention": attention_by_query,
            "similarity": similarity_by_query,
        },
        "similarityMethod": {
            "vectors": "GPT-2 input token embeddings",
            "aggregation": "mean over query and target subword pieces",
            "score": "cosine similarity",
        },
    }

    output_path = ROOT / "public" / "attention-scores.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=output_path.parent, delete=False) as temp:
        json.dump(manifest, temp, ensure_ascii=False, separators=(",", ":"))
        temp.write("\n")
        temp_path = Path(temp.name)
    os.chmod(temp_path, 0o644)
    temp_path.replace(output_path)
    print(f"Wrote {output_path.relative_to(ROOT)} for {len(attention_by_query)} hero words and two modes")


if __name__ == "__main__":
    main()
