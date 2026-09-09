export default function Webring() {
  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        gap: "8px",
      }}
    >
      <a href="https://calwebring.com/prev?current=http://vijayhans.com">←</a>
      <a href="https://calwebring.com">
        <img
          src="https://calwebring.com/badge.png"
          width={36}
          alt="Cal Webring"
        />
      </a>
      <a href="https://calwebring.com/next?current=http://vijayhans.com">→</a>
    </div>
  );
}