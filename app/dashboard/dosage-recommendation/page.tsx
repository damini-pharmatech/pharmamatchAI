"use client";

import { useState } from "react";

export default function DosageRecommendation() {
  const [apiName, setApiName] = useState("");
  const [details, setDetails] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock API call based on PDF sources (FDA IID Database, PubChem)
    setTimeout(() => {
      setResults([
        {
          id: 1,
          form: "Immediate Release Tablet",
          compatibility: "High (95%)",
          details: "Optimal for APIs requiring rapid onset. standard excipients apply.",
          reference: "FDA IID Database",
          link: "#"
        },
        {
          id: 2,
          form: "Lyophilized Powder for Injection",
          compatibility: "Medium (75%)",
          details: "Consider if API has poor oral bioavailability or degrades in gastric pH.",
          reference: "Pharm DE",
          link: "#"
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <div className="tool-header">
        <h1>Dosage Form Recommendation</h1>
        <p>Input API details to discover the most suitable dosage forms.</p>
      </div>

      <div className="glass-panel">
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label className="form-label">Select / Type API</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Ibuprofen" 
              value={apiName}
              onChange={(e) => setApiName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Specific Details / Constraints (Optional)</label>
            <textarea 
              className="form-input" 
              rows={3} 
              placeholder="e.g. Requires sustained release over 12 hours"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            ></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Searching FDA IID & Literature..." : "Search Dosage Forms"}
          </button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="results-panel animate-fade-in">
          <h3 style={{ marginBottom: '1.5rem' }}>Highly Compatible Dosage Forms</h3>
          {results.map((item, index) => (
            <div key={item.id} className={`result-item delay-${(index + 1) * 100} animate-fade-in`}>
              <div className="result-header">
                <span className="result-title">{item.form}</span>
                <span className="compatibility-badge" style={{ 
                  background: item.compatibility.includes('High') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: item.compatibility.includes('High') ? '#10b981' : '#f59e0b'
                }}>
                  Match: {item.compatibility}
                </span>
              </div>
              <p>{item.details}</p>
              <div>
                <a href={item.link} className="reference-link">
                  🔗 Reference: {item.reference}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
