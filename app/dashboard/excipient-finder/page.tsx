"use client";

import { useState } from "react";

export default function ExcipientFinder() {
  const [dosageForm, setDosageForm] = useState("");
  const [subDosageForm, setSubDosageForm] = useState("");
  const [apiName, setApiName] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getSubDosageOptions = () => {
    switch(dosageForm) {
      case "tablets": return ["Immediate Release", "Sustained Release", "Chewable", "Sublingual", "Effervescent"];
      case "capsules": return ["Hard Gelatin", "Soft Gelatin", "Enteric Coated"];
      case "powders": return ["Bulk Powders", "Divided Powders", "Effervescent Granules"];
      case "liquids": return [
        "Monophasic - Solutions", 
        "Monophasic - Syrups", 
        "Biphasic - Emulsions", 
        "Biphasic - Suspensions", 
        "Parenterals - Intravenous", 
        "Parenterals - Intramuscular",
        "Parenterals - Subcutaneous"
      ];
      case "semisolids": return ["Ointments", "Creams", "Pastes", "Gels"];
      case "suppositories": return ["Rectal Suppositories", "Vaginal Pessaries", "Urethral Bougies"];
      default: return [];
    }
  };

  const getMockResults = (form: string, subForm: string) => {
    const solidResults = [
      { id: 1, name: "Microcrystalline Cellulose (MCC)", compatibility: "98%", literature: "Highly suitable for solid dosage forms with excellent compressibility.", reference: "PubChem ID: 14055602", link: "#" },
      { id: 2, name: "Lactose Monohydrate", compatibility: "92%", literature: "Good compatibility, potential maillard reaction if amine groups present.", reference: "Handbook of Pharmaceutical Excipients", link: "#" },
      { id: 3, name: "Magnesium Stearate", compatibility: "95%", literature: "Standard widely used lubricant, avoid high concentrations to prevent dissolution issues.", reference: "FDA Inactive Ingredients", link: "#" }
    ];

    const powderResults = [
      { id: 4, name: "Talc", compatibility: "94%", literature: "Improves flow properties of powders and granules.", reference: "IPEC Guidelines", link: "#" },
      { id: 5, name: "Maize Starch", compatibility: "90%", literature: "Commonly used as a diluent and disintegrant.", reference: "PubChem ID: 24836924", link: "#" }
    ];

    const liquidResults = [
      { id: 6, name: "Propylene Glycol", compatibility: "96%", literature: "Excellent cosolvent and humectant for oral and topical liquids.", reference: "PubChem ID: 1030", link: "#" },
      { id: 7, name: "Glycerin", compatibility: "97%", literature: "Used as a solvent, sweetening agent, and preservative.", reference: "Handbook of Pharmaceutical Excipients", link: "#" },
      { id: 8, name: "Polysorbate 80 (Tween 80)", compatibility: "93%", literature: "Effective emulsifier and solubilizing agent for suspensions and emulsions.", reference: "FDA Inactive Ingredients", link: "#" }
    ];

    const parenteralResults = [
      { id: 9, name: "Water for Injection (WFI)", compatibility: "100%", literature: "Sterile solvent fundamentally required for most parenterals.", reference: "Pharmacopeial Standards", link: "#" },
      { id: 10, name: "Benzyl Alcohol", compatibility: "91%", literature: "Antimicrobial preservative often used in multidose vials.", reference: "PubChem ID: 244", link: "#" }
    ];

    const semiSolidResults = [
      { id: 11, name: "White Petrolatum", compatibility: "98%", literature: "Occlusive base highly compatible with many active ingredients.", reference: "Handbook of Pharmaceutical Excipients", link: "#" },
      { id: 12, name: "Cetostearyl Alcohol", compatibility: "95%", literature: "Provides stiffness and acts as an emulsion stabilizer in creams.", reference: "FDA Inactive Ingredients", link: "#" },
      { id: 13, name: "Carbomer 940", compatibility: "94%", literature: "Excellent gelling agent for topical aqueous and hydroalcoholic systems.", reference: "IPEC Guidelines", link: "#" }
    ];

    const suppositoryResults = [
      { id: 14, name: "Cocoa Butter", compatibility: "90%", literature: "Traditional base, melts at body temperature, exhibits polymorphism.", reference: "Handbook of Pharmaceutical Excipients", link: "#" },
      { id: 15, name: "Polyethylene Glycol (PEG 4000/6000)", compatibility: "96%", literature: "Water-soluble base, does not melt but dissolves in mucosal fluids.", reference: "FDA Inactive Ingredients", link: "#" }
    ];

    if (form === "tablets" || form === "capsules") return solidResults;
    if (form === "powders") return [...solidResults.slice(0,1), ...powderResults];
    if (form === "liquids" && subForm.includes("Parenterals")) return parenteralResults;
    if (form === "liquids") return liquidResults;
    if (form === "semisolids") return semiSolidResults;
    if (form === "suppositories") return suppositoryResults;
    
    return solidResults;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setResults(getMockResults(dosageForm, subDosageForm));
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <div className="tool-header">
        <h1>Excipient Finder & Compatibility</h1>
        <p>AI-driven excipient recommendation based on dosage form and API.</p>
      </div>

      <div className="glass-panel">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-3">
            <div className="form-group">
              <label className="form-label">Dosage Form</label>
              <select className="form-select" value={dosageForm} onChange={(e) => { setDosageForm(e.target.value); setSubDosageForm(""); }} required>
                <option value="">-- Select Form --</option>
                <option value="tablets">Tablets</option>
                <option value="capsules">Capsules</option>
                <option value="powders">Powder / Granules</option>
                <option value="liquids">Liquid Dosage Forms</option>
                <option value="semisolids">Semi-Solid Dosage Forms</option>
                <option value="suppositories">Suppositories & Pessaries</option>
              </select>
            </div>

            <div className="form-group animate-fade-in">
              <label className="form-label">Subdosage Form</label>
              <select className="form-select" value={subDosageForm} onChange={(e) => setSubDosageForm(e.target.value)} disabled={!dosageForm} required>
                <option value="">-- Specific Details --</option>
                {getSubDosageOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">API / CAS Number</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Paracetamol" 
                value={apiName}
                onChange={(e) => setApiName(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Analyzing databases..." : "Find Compatible Excipients"}
          </button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="results-panel animate-fade-in">
          <h3 style={{ marginBottom: '1.5rem' }}>AI Recommendations</h3>
          {results.map((item, index) => (
            <div key={item.id} className={`result-item delay-${(index + 1) * 100} animate-fade-in`}>
              <div className="result-header">
                <span className="result-title">{item.name}</span>
                <span className="compatibility-badge">Match: {item.compatibility}</span>
              </div>
              <p>{item.literature}</p>
              <div>
                <a href={item.link} className="reference-link">
                  🔗 Reference: {item.reference}
                </a>
              </div>
            </div>
          ))}
          
          <div className="glass-panel" style={{ marginTop: '2rem', borderColor: 'var(--accent-color)' }}>
            <h4 style={{ color: 'var(--accent-color)' }}>💡 Prototype Suggestion</h4>
            <p>Based on the selected {dosageForm} format, the recommended excipient profile provides optimal stability and release characteristics for {apiName || 'your active ingredient'}.</p>
          </div>
        </div>
      )}
    </div>
  );
}
