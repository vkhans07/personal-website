import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const server = await createServer({
  root,
  configFile: false,
  logLevel: 'silent',
  appType: 'custom',
  server: {middlewareMode: true},
});

try {
  const {getAttentionBlocks, HERO_ATTENTION_QUERY} = await server.ssrLoadModule('/src/attention/content.jsx');
  process.stdout.write(JSON.stringify({
    heroQuery: HERO_ATTENTION_QUERY,
    blocks: getAttentionBlocks(),
  }));
} finally {
  await server.close();
}
