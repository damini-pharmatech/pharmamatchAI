"use client";

import { useState } from "react";

export default function PaperAnalysis() {
  const [idea, setIdea] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock API call based on PDF sources (PubMed, CrossRef API, Google Scholar)
    setTimeout(() => {
      setResults([
        {
          id: 1,
          title: "Novel Excipients for Enhancing Solubility of BCS Class II Drugs",
          analysis: "This paper explores the exact mechanism you proposed. It suggests using specific lipid-based excipients which improved solubility by 300%.",
          source: "PubMed",
          link: "https://pubmed.ncbi.nlm.nih.gov/mock"
        },
        {
          id: 2,
          title: "AI in Pre-formulation: Predicting Drug-Excipient Interactions",
          analysis: "Highly relevant. Focuses on using Machine Learning (SHAP/LIME) to predict compatibilities similar to your idea.",
          source: "Google Scholar",
          link: "https://scholar.google.com/mock"
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <div className="tool-header">
        <h1>Paper Analysis & Literature Review</h1>
        <p>Type your formulation idea to get a curated list of relevant papers with instant AI analysis.</p>
      </div>

      <div className="glass-panel">
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label className="form-label">Type your idea or research topic</label>
            <textarea 
              className="form-input" 
              rows={4} 
              placeholder="e.g. Using nanostructured lipid carriers to improve bioavailability of poorly soluble APIs..." 
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              required
            ></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Scanning Literature (PubMed, CrossRef)..." : "Analyze Literature"}
          </button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="results-panel animate-fade-in">
          <h3 style={{ marginBottom: '1.5rem' }}>Highly Recommended Papers</h3>
          {results.map((item, index) => (
            <div key={item.id} className={`result-item delay-${(index + 1) * 100} animate-fade-in`}>
              <div className="result-header">
                <span className="result-title">{item.title}</span>
                <span className="compatibility-badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
                  Source: {item.source}
                </span>
              </div>
              <p><strong>AI Analysis:</strong> {item.analysis}</p>
              <div style={{ marginTop: '1rem' }}>
                <a href={item.link} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  Read Full Paper
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
