export default function DashboardHome() {
  return (
    <div className="animate-fade-in">
      <div className="tool-header">
        <h1>Welcome to Pharmamatch AI</h1>
        <p>Select a tool from the sidebar to begin your AI-driven pre-formulation analysis.</p>
      </div>

      <div className="grid grid-cols-3" style={{ marginTop: '3rem' }}>
        <div className="glass-panel">
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧪</div>
          <h3>Excipient Finder</h3>
          <p>Find highly compatible excipients for your specific dosage form and API.</p>
        </div>
        <div className="glass-panel delay-100">
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💊</div>
          <h3>Dosage Recommendation</h3>
          <p>Discover the most suitable dosage forms for your target API.</p>
        </div>
        <div className="glass-panel delay-200">
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
          <h3>Paper Analysis</h3>
          <p>Analyze literature and get highly recommended papers instantly.</p>
        </div>
      </div>
    </div>
  );
}
