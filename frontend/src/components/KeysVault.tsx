"use client";

import { useState } from "react";

export type ApiKeys = {
  google: str;
  openai: str;
  anthropic: str;
  mistral: str;
  meta: str;
};

export default function KeysVault({ onKeysSave }: { onKeysSave: (keys: ApiKeys) => void }) {
  const [keys, setKeys] = useState<ApiKeys>({
    google: "",
    openai: "",
    anthropic: "",
    mistral: "",
    meta: "",
  });

  const handleChange = (provider: keyof ApiKeys, value: string) => {
    setKeys((prev) => ({ ...prev, [provider]: value }));
  };

  const handleSave = () => {
    onKeysSave(keys);
  };

  return (
    <div className="panel">
      <h2>🔐 Keys Vault</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "1rem", fontSize: "0.9rem" }}>
        Enter API keys for the models you want to include in the council. Keys are sent securely to the backend per request and are NOT stored. Use "mock" to simulate a response.
      </p>
      <div className="key-row">
        <label>Google (Gemini)</label>
        <input type="password" value={keys.google} onChange={(e) => handleChange("google", e.target.value)} placeholder="AIzaSy..." />
      </div>
      <div className="key-row">
        <label>OpenAI</label>
        <input type="password" value={keys.openai} onChange={(e) => handleChange("openai", e.target.value)} placeholder="sk-..." />
      </div>
      <div className="key-row">
        <label>Anthropic</label>
        <input type="password" value={keys.anthropic} onChange={(e) => handleChange("anthropic", e.target.value)} placeholder="sk-ant-..." />
      </div>
      <div className="key-row">
        <label>Mistral</label>
        <input type="password" value={keys.mistral} onChange={(e) => handleChange("mistral", e.target.value)} placeholder="..." />
      </div>
      <div className="key-row">
        <label>Meta/Groq</label>
        <input type="password" value={keys.meta} onChange={(e) => handleChange("meta", e.target.value)} placeholder="gsk_..." />
      </div>
      <button onClick={handleSave} style={{ marginTop: "1rem" }}>Lock Vault</button>
    </div>
  );
}
