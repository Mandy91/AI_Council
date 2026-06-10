"use client";

import { useEffect, useState, useRef } from "react";
import { ApiKeys } from "./KeysVault";

export default function MissionControl({ keys, prompt, judge }: { keys: ApiKeys; prompt: string; judge: string }) {
  const [stage, setStage] = useState<string>("idle");
  const [logs, setLogs] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const startDebate = () => {
    if (!prompt) return;
    
    setLogs([]);
    setStage("connecting...");
    
    // Construct models config
    const modelsConfig = [];
    if (keys.google) modelsConfig.push({ name: "gemini-1.5-pro", provider: "google", api_key: keys.google });
    if (keys.openai) modelsConfig.push({ name: "gpt-4o", provider: "openai", api_key: keys.openai });
    if (keys.anthropic) modelsConfig.push({ name: "claude-3-opus-20240229", provider: "anthropic", api_key: keys.anthropic });
    if (keys.mistral) modelsConfig.push({ name: "mistral-large-latest", provider: "mistral", api_key: keys.mistral });
    if (keys.meta) modelsConfig.push({ name: "llama3-70b-8192", provider: "meta", api_key: keys.meta });

    let judgeConfig = { name: "gemini-1.5-pro", provider: "google", api_key: keys.google };
    if (judge === "gpt-4o") judgeConfig = { name: "gpt-4o", provider: "openai", api_key: keys.openai };

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/debate";
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setStage("connected");
      ws.send(JSON.stringify({
        prompt,
        models: modelsConfig,
        judge: judgeConfig
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStage(data.stage);
      if (data.update) {
        setLogs(prev => [...prev, { stage: data.stage, update: data.update }]);
      }
      if (data.stage === "completed") {
        ws.close();
      }
    };

    ws.onerror = (e) => {
      console.error(e);
      setStage("error");
    };
  };

  return (
    <div className="panel">
      <h2>🚀 Mission Control</h2>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
        <button onClick={startDebate} disabled={stage !== "idle" && stage !== "completed" && stage !== "error"}>
          Initiate Debate sequence
        </button>
        <span className={`badge ${stage === 'completed' ? 'success' : ''}`}>Status: {stage}</span>
      </div>

      <div className="logs-container" style={{ background: "#000", padding: "1rem", borderRadius: "8px", maxHeight: "400px", overflowY: "auto" }}>
        {logs.length === 0 && <span style={{ color: "var(--text-secondary)" }}>Awaiting telemetry...</span>}
        
        {logs.map((log, i) => (
          <div key={i} style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ color: "var(--neon-green)", borderBottom: "1px solid #333", paddingBottom: "0.5rem" }}>Stage: {log.stage.toUpperCase()}</h3>
            
            {log.update.round_1_answers && (
              Object.entries(log.update.round_1_answers).map(([model, ans]: any) => (
                <div key={model} className="answer-card">
                  <h4>{model}</h4>
                  <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{ans}</pre>
                </div>
              ))
            )}
            
            {log.update.round_2_critiques && (
              Object.entries(log.update.round_2_critiques).map(([model, crit]: any) => (
                <div key={model} className="answer-card" style={{ borderLeftColor: "var(--neon-red)" }}>
                  <h4 style={{ color: "var(--neon-red)" }}>{model} Critique</h4>
                  <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{crit}</pre>
                </div>
              ))
            )}

            {log.update.final_decree && (
              <div className="answer-card" style={{ borderLeftColor: "var(--neon-yellow)" }}>
                <h4 style={{ color: "var(--neon-yellow)" }}>JUDGE DECREE</h4>
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{log.update.final_decree}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
