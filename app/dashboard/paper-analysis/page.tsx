"use client";

import { useState } from "react";
import "./paper-analysis.css";

// Interface for Insight Data
interface PaperInsight {
  id: string;
  title: string;
  authors: string;
  year: number;
  api: string;
  excipients: string[];
  method: string;
  outcome: string;
  compatibilityIssues: string;
  link: string;
}

export default function PaperAnalysis() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [insights, setInsights] = useState<PaperInsight[]>([]);
  
  // Chat Panel State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<string>("");
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [chatInput, setChatInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(false);
    
    // Simulate API call to fetch and extract insights from papers
    setTimeout(() => {
      setInsights([
        {
          id: "p1",
          title: "Enhancing Solubility of Curcumin using Nanostructured Lipid Carriers",
          authors: "Smith et al.",
          year: 2023,
          api: "Curcumin",
          excipients: ["Precirol ATO 5", "Tween 80", "Pluronic F68"],
          method: "Hot Melt Homogenization",
          outcome: "Solubility increased by 450%. Bioavailability in vivo improved 3-fold compared to pure drug.",
          compatibilityIssues: "Slight aggregation observed after 3 months at 40°C.",
          link: "#"
        },
        {
          id: "p2",
          title: "Solid Dispersions of BCS Class II Drugs via Hot Melt Extrusion",
          authors: "Johnson & Lee",
          year: 2024,
          api: "Curcumin, Ibuprofen",
          excipients: ["Kollidon VA 64", "Soluplus"],
          method: "Hot Melt Extrusion (HME)",
          outcome: "Soluplus formulations achieved superior supersaturation. Dissolution rate >85% in 15 mins.",
          compatibilityIssues: "Thermal degradation of API if extrusion temp > 160°C.",
          link: "#"
        },
        {
          id: "p3",
          title: "Co-amorphous systems for solubility enhancement: A review",
          authors: "Wang et al.",
          year: 2022,
          api: "Various (Review)",
          excipients: ["Amino acids (Arginine, Tryptophan)"],
          method: "Solvent Evaporation, Milling",
          outcome: "Significant stability improvement without polymeric carriers. 200% solubility increase.",
          compatibilityIssues: "Highly dependent on molar ratios; prone to crystallization if exposed to high humidity.",
          link: "#"
        }
      ]);
      setIsSearching(false);
      setHasSearched(true);
    }, 2500);
  };

  const openChatWithContext = (paper: PaperInsight) => {
    setChatContext(paper.title);
    setMessages([
      { role: 'ai', content: `You selected "${paper.title}". What would you like to know about its formulation details, methodology, or results?` }
    ]);
    setIsChatOpen(true);
  };

  const openGeneralChat = () => {
    setChatContext("General Synthesis");
    setMessages([
      { role: 'ai', content: `I've analyzed the papers on "${query}". I see successful approaches using lipid carriers and solid dispersions. How can I assist you with your specific formulation?` }
    ]);
    setIsChatOpen(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, content: chatInput }];
    setMessages(newMessages);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages([...newMessages, { 
        role: 'ai', 
        content: `Based on the literature context, the use of Tween 80 alongside solid lipid nanoparticles generally mitigates those stability issues, provided the concentration remains below 2% w/v.`
      }]);
    }, 1000);
  };

  return (
    <div className="paper-analysis-container animate-fade-in">
      
      {/* Search Header */}
      <div className="search-header">
        <h1>AI Literature Survey & Gap Analyzer</h1>
        <p>Extract actionable formulation parameters directly from scientific literature.</p>
        
        <form className="search-box" onSubmit={handleSearch}>
          <input 
            type="text" 
            className="search-input" 
            placeholder="e.g., How to enhance solubility of Curcumin?" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-search" disabled={isSearching}>
            {isSearching ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="rgba(255,255,255,0.3)"></circle>
                  <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                </svg>
                Scanning Literature...
              </>
            ) : "Analyze Literature"}
          </button>
        </form>
      </div>

      {isSearching && (
        <div className="shimmer" style={{ height: '200px', borderRadius: '12px' }}></div>
      )}

      {/* Results View */}
      {hasSearched && !isSearching && (
        <>
          {/* Synthesis Block */}
          <div className="synthesis-block animate-fade-in">
            <div className="synthesis-header">
              <span style={{ fontSize: '2rem' }}>✨</span>
              <h3>AI Consensus & Formulation Strategy</h3>
            </div>
            <div className="synthesis-content">
              <p>
                Based on the analysis of highly cited papers, improving the solubility of <strong>{query.includes('Curcumin') ? 'Curcumin' : 'the target API'}</strong> is most successfully achieved using <strong>solid dispersions</strong> or <strong>nanostructured lipid carriers (NLCs)</strong>.
                Polymeric carriers like <em>Soluplus</em> and <em>Kollidon VA 64</em> show excellent supersaturation maintenance. However, lipid-based systems using <em>Tween 80</em> provide superior in-vivo bioavailability.
              </p>
            </div>
            <div className="strategy-recommendation">
              <h4>Recommended Formulation Strategy:</h4>
              <p style={{ margin: 0 }}>
                Consider a <strong>Hot Melt Extrusion</strong> approach utilizing <strong>Soluplus</strong> if your facility supports it. If avoiding thermal degradation is critical, switch to a <strong>Lipid-based Nanocarrier</strong> formulation using <em>Precirol ATO 5</em> and a surfactant.
              </p>
              <button 
                onClick={openGeneralChat}
                className="btn-search" 
                style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', fontSize: '0.95rem', display: 'inline-flex' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                Discuss Strategy with AI
              </button>
            </div>
          </div>

          {/* Insight Matrix Table */}
          <div className="insight-matrix-container animate-fade-in delay-100">
            <table className="insight-matrix">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Paper Details</th>
                  <th style={{ width: '15%' }}>Excipients Used</th>
                  <th style={{ width: '20%' }}>Methodology</th>
                  <th style={{ width: '30%' }}>Outcomes & Limitations</th>
                  <th style={{ width: '10%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {insights.map((paper) => (
                  <tr key={paper.id}>
                    <td>
                      <span className="paper-title">{paper.title}</span>
                      <div className="paper-meta">
                        <span>{paper.authors}</span>
                        <span>•</span>
                        <span>{paper.year}</span>
                      </div>
                      <span className="tag api">API: {paper.api}</span>
                    </td>
                    <td>
                      {paper.excipients.map((exc, i) => (
                        <span key={i} className="tag excipient">{exc}</span>
                      ))}
                    </td>
                    <td>
                      <span className="tag method">{paper.method}</span>
                    </td>
                    <td>
                      <p className="outcome-text"><strong>Outcome:</strong> {paper.outcome}</p>
                      <p className="outcome-text" style={{ color: '#b91c1c', marginTop: '0.5rem' }}>
                        <strong>Limitation:</strong> {paper.compatibilityIssues}
                      </p>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon btn-ask" onClick={() => openChatWithContext(paper)}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                          Ask AI
                        </button>
                        <a href={paper.link} className="btn-icon btn-link" target="_blank" rel="noopener noreferrer">
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                          Source
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Chat Side Panel */}
      {isChatOpen && (
        <div className="chat-panel-overlay" onClick={() => setIsChatOpen(false)}>
          <div className="chat-panel" onClick={(e) => e.stopPropagation()}>
            <div className="chat-header">
              <div>
                <h3>Research Assistant</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Context: {chatContext}</p>
              </div>
              <button className="btn-close" onClick={() => setIsChatOpen(false)}>&times;</button>
            </div>
            
            <div className="chat-body">
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.role}`}>
                  {msg.content}
                </div>
              ))}
            </div>

            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                className="chat-input" 
                placeholder="Ask about excipients, stability..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit" className="btn-send">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
}
