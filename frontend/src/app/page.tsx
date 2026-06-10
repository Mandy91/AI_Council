"use client";

import { useState } from "react";
import KeysVault, { ApiKeys } from "../components/KeysVault";
import MissionControl from "../components/MissionControl";
import ArtifactView from "../components/ArtifactView";

export default function Home() {
  const [keys, setKeys] = useState<ApiKeys | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [judge, setJudge] = useState<string>("gemini-1.5-pro");

  return (
    <div className="container">
      <header style={{ marginBottom: "3rem", textAlign: "center" }}>
        <h1>The Council</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem", marginTop: "0.5rem" }}>
          Multi-LLM Collaborative Consensus Platform
        </p>
      </header>

      {!keys ? (
        <KeysVault onKeysSave={setKeys} />
      ) : (
        <div className="grid-2">
          <div>
            <div className="panel">
              <h2>⚖️ Problem Statement</h2>
              <textarea 
                rows={5} 
                placeholder="Enter the complex problem for the Council to debate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              
              <div style={{ marginTop: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Select Judge Model:</label>
                <select 
                  value={judge} 
                  onChange={(e) => setJudge(e.target.value)}
                  style={{ width: "100%", padding: "0.5rem", backgroundColor: "var(--bg-color)", color: "var(--text-primary)", border: "1px solid var(--border-color)", borderRadius: "6px" }}
                >
                  <option value="gemini-1.5-pro">Gemini 3.1 Pro (simulated as gemini-1.5-pro)</option>
                  <option value="gpt-4o">GPT-5.4 (simulated as gpt-4o)</option>
                </select>
              </div>
            </div>
            <ArtifactView />
          </div>
          <div>
            <MissionControl keys={keys} prompt={prompt} judge={judge} />
          </div>
        </div>
      )}
    </div>
  );
}
