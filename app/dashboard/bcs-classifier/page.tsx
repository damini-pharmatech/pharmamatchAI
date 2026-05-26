"use client";

import { useState } from "react";

type BCSClass = "I" | "II" | "III" | "IV";

interface EnhancerStrategy {
  name: string;
  mechanism: string;
  example: string;
  reference: string;
  referenceUrl: string;
}

interface EnhancerData {
  applicable: boolean;
  summary: string;
  strategies: EnhancerStrategy[];
}

interface BCSResult {
  found: true;
  drug: string;
  class: BCSClass;
  pubchemCid: number | null;
  pubchemUrl: string | null;
  pubchemName: string | null;
  solubility: {
    rating: "High" | "Low";
    value: string;
    details: string;
  };
  permeability: {
    rating: "High" | "Low";
    value: string;
    details: string;
  };
  solubilityEnhancers: EnhancerData;
  permeabilityEnhancers: EnhancerData;
  dosageRecommendation: {
    preferred: string;
    rationale: string;
    formulations: string[];
  };
  source: string;
}

interface NotInDB {
  found: false;
  pubchemFound: true;
  pubchemCid: number;
  pubchemUrl: string;
  pubchemName: string | null;
  message: string;
}

type APIResponse = BCSResult | NotInDB | { found: false; message: string };

const CLASS_CONFIG: Record<
  BCSClass,
  { label: string; color: string; bg: string; border: string; description: string }
> = {
  I: {
    label: "Class I",
    color: "#059669",
    bg: "rgba(5, 150, 105, 0.1)",
    border: "rgba(5, 150, 105, 0.3)",
    description: "High Solubility · High Permeability",
  },
  II: {
    label: "Class II",
    color: "#d97706",
    bg: "rgba(217, 119, 6, 0.1)",
    border: "rgba(217, 119, 6, 0.3)",
    description: "Low Solubility · High Permeability",
  },
  III: {
    label: "Class III",
    color: "#0284c7",
    bg: "rgba(2, 132, 199, 0.1)",
    border: "rgba(2, 132, 199, 0.3)",
    description: "High Solubility · Low Permeability",
  },
  IV: {
    label: "Class IV",
    color: "#dc2626",
    bg: "rgba(220, 38, 38, 0.1)",
    border: "rgba(220, 38, 38, 0.3)",
    description: "Low Solubility · Low Permeability",
  },
};

export default function BCSClassifier() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [solOpen, setSolOpen] = useState(false);
  const [permOpen, setPermOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setSolOpen(false);
    setPermOpen(false);

    try {
      const res = await fetch(`/api/bcs-classify?drug=${encodeURIComponent(query.trim())}`);
      const data: APIResponse = await res.json();
      setResult(data);
    } catch {
      setError("Failed to reach classification service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const bcs = result?.found === true ? (result as BCSResult) : null;
  const cfg = bcs ? CLASS_CONFIG[bcs.class] : null;

  const partialMatch =
    result && !result.found && "pubchemFound" in result ? (result as NotInDB) : null;

  const notFound =
    result && !result.found && !("pubchemFound" in result) ? result : null;

  return (
    <div className="animate-fade-in">
      <div className="tool-header">
        <h1>BCS Classifier</h1>
        <p>
          Enter a drug or API name to retrieve its Biopharmaceutics Classification System (BCS)
          class, solubility, permeability, and dosage recommendations. Drug data is validated
          against{" "}
          <a
            href="https://pubchem.ncbi.nlm.nih.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="reference-link"
          >
            PubChem (NCBI)
          </a>
          .
        </p>
      </div>

      <div className="glass-panel">
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label">Drug / API Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Ibuprofen, Metoprolol, Furosemide, Warfarin"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ whiteSpace: "nowrap" }}
          >
            {loading ? "Classifying..." : "Search BCS Class"}
          </button>
        </form>
      </div>

      {error && (
        <div
          className="glass-panel animate-fade-in"
          style={{ borderLeft: "4px solid #dc2626", marginTop: "1.5rem" }}
        >
          <p style={{ color: "#dc2626", fontWeight: 600 }}>{error}</p>
        </div>
      )}

      {notFound && (
        <div
          className="glass-panel animate-fade-in"
          style={{ borderLeft: "4px solid #dc2626", marginTop: "1.5rem" }}
        >
          <p style={{ color: "#dc2626", fontWeight: 600 }}>Drug not found</p>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            {notFound.message}
          </p>
        </div>
      )}

      {partialMatch && (
        <div
          className="glass-panel animate-fade-in"
          style={{ borderLeft: "4px solid #d97706", marginTop: "1.5rem" }}
        >
          <p style={{ color: "#d97706", fontWeight: 600 }}>
            Drug recognised but BCS data not yet available
          </p>
          <p style={{ color: "var(--text-secondary)", margin: "0.25rem 0 0.75rem" }}>
            {partialMatch.message}
          </p>
          <a
            href={partialMatch.pubchemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="reference-link"
          >
            🔗 View {partialMatch.pubchemName ?? query} on PubChem
          </a>
        </div>
      )}

      {bcs && cfg && (
        <div className="results-panel animate-fade-in">
          {/* BCS Class Banner */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              marginBottom: "2rem",
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
              borderRadius: "12px",
              padding: "1.5rem 2rem",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: cfg.color,
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.7rem",
                flexShrink: 0,
                lineHeight: 1.2,
              }}
            >
              <span style={{ fontSize: "1.4rem", fontWeight: 800 }}>{bcs.class}</span>
              <span>BCS</span>
            </div>
            <div>
              <h2 style={{ margin: 0, color: "#0f172a", fontSize: "1.6rem" }}>{bcs.drug}</h2>
              <p style={{ margin: "0.25rem 0 0", color: cfg.color, fontWeight: 600, fontSize: "1rem" }}>
                BCS {cfg.label} — {cfg.description}
              </p>
              {bcs.pubchemUrl && (
                <a
                  href={bcs.pubchemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reference-link"
                  style={{ marginTop: "0.4rem", display: "inline-flex" }}
                >
                  🔗 View on PubChem (CID {bcs.pubchemCid})
                </a>
              )}
            </div>
          </div>

          {/* Solubility & Permeability */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div className="result-item" style={{ margin: 0 }}>
              <div className="result-header">
                <span className="result-title">💧 Solubility</span>
                <span
                  className="compatibility-badge"
                  style={{
                    background:
                      bcs.solubility.rating === "High"
                        ? "rgba(5, 150, 105, 0.15)"
                        : "rgba(220, 38, 38, 0.15)",
                    color: bcs.solubility.rating === "High" ? "#059669" : "#dc2626",
                    border: "none",
                  }}
                >
                  {bcs.solubility.rating}
                </span>
              </div>
              <p style={{ fontWeight: 600, color: "#0f172a", marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                {bcs.solubility.value}
              </p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                {bcs.solubility.details}
              </p>
            </div>

            <div className="result-item" style={{ margin: 0 }}>
              <div className="result-header">
                <span className="result-title">🔬 Permeability</span>
                <span
                  className="compatibility-badge"
                  style={{
                    background:
                      bcs.permeability.rating === "High"
                        ? "rgba(5, 150, 105, 0.15)"
                        : "rgba(220, 38, 38, 0.15)",
                    color: bcs.permeability.rating === "High" ? "#059669" : "#dc2626",
                    border: "none",
                  }}
                >
                  {bcs.permeability.rating}
                </span>
              </div>
              <p style={{ fontWeight: 600, color: "#0f172a", marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                {bcs.permeability.value}
              </p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                {bcs.permeability.details}
              </p>
            </div>
          </div>

          {/* Solubility & Permeability Enhancers — collapsible */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1rem" }}>
            {(
              [
                { key: "sol", open: solOpen, toggle: () => setSolOpen((v) => !v), data: bcs.solubilityEnhancers, title: "⚗️ Solubility Enhancers" },
                { key: "perm", open: permOpen, toggle: () => setPermOpen((v) => !v), data: bcs.permeabilityEnhancers, title: "🔀 Permeability Enhancers" },
              ] as const
            ).map(({ key, open, toggle, data, title }) => {
              const accentColor = data.applicable ? "#d97706" : "#059669";
              const accentBg = data.applicable ? "rgba(217,119,6,0.08)" : "rgba(5,150,105,0.08)";
              return (
                <div
                  key={key}
                  className="result-item"
                  style={{ margin: 0, padding: 0, borderLeft: `4px solid ${accentColor}`, overflow: "hidden" }}
                >
                  {/* Header — always visible, click to toggle */}
                  <button
                    onClick={toggle}
                    style={{
                      width: "100%",
                      background: open ? accentBg : "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: "1rem 1.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "1rem",
                      textAlign: "left",
                      transition: "background 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 600, fontSize: "1rem", color: "#0f172a" }}>{title}</span>
                      <span
                        style={{
                          background: data.applicable ? "rgba(217,119,6,0.15)" : "rgba(5,150,105,0.15)",
                          color: accentColor,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "20px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        {data.applicable ? "Enhancement Critical" : "Not Required"}
                      </span>
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                        {data.strategies.length} {data.strategies.length === 1 ? "strategy" : "strategies"}
                      </span>
                    </div>
                    <span style={{ color: accentColor, fontSize: "1.1rem", flexShrink: 0, fontWeight: 700 }}>
                      {open ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* Expanded content */}
                  {open && (
                    <div style={{ padding: "0 1.5rem 1.5rem" }}>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", lineHeight: 1.6, marginBottom: "1.25rem", paddingTop: "0.5rem", borderTop: "1px solid #f1f5f9" }}>
                        {data.summary}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {data.strategies.map((s, i) => (
                          <div
                            key={i}
                            style={{ borderLeft: "2px solid #e2e8f0", paddingLeft: "0.875rem" }}
                          >
                            <p style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                              {s.name}
                            </p>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", lineHeight: 1.6, marginBottom: "0.25rem" }}>
                              {s.mechanism}
                            </p>
                            <p style={{ color: "#475569", fontSize: "0.775rem", fontStyle: "italic", lineHeight: 1.5, marginBottom: "0.4rem" }}>
                              Example: {s.example}
                            </p>
                            <a
                              href={s.referenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="reference-link"
                              style={{ fontSize: "0.75rem" }}
                            >
                              🔗 {s.reference}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Dosage Recommendation */}
          <div className="result-item" style={{ margin: 0, borderLeft: `4px solid ${cfg.color}` }}>
            <div className="result-header">
              <span className="result-title">💊 Dosage Recommendation</span>
              <span
                className="compatibility-badge"
                style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
              >
                BCS {bcs.class}
              </span>
            </div>
            <p style={{ fontWeight: 600, color: "#0f172a", marginBottom: "0.5rem" }}>
              Preferred: {bcs.dosageRecommendation.preferred}
            </p>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.875rem",
                marginBottom: "1rem",
                lineHeight: 1.6,
              }}
            >
              {bcs.dosageRecommendation.rationale}
            </p>
            <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
              {bcs.dosageRecommendation.formulations.map((f, i) => (
                <li
                  key={i}
                  style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.25rem" }}
                >
                  {f}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: "1rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                📄 {bcs.source}
              </span>
              {bcs.pubchemUrl && (
                <a
                  href={bcs.pubchemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reference-link"
                >
                  🔗 Full compound data on PubChem →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
