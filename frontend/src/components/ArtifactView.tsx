export default function ArtifactView() {
  return (
    <div className="panel" style={{ marginTop: "1.5rem" }}>
      <h2>📜 The Final Decree</h2>
      <p style={{ color: "var(--text-secondary)" }}>
        The final consensus synthesized by the Judge agent will be displayed here in the Mission Control log.
        Future updates can persist this decree to a database or save it as a local markdown file.
      </p>
    </div>
  );
}
