"use client";

import { useEffect, useState } from "react";
import "./home.css";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content animate-fade-in">
            <div className="hero-badge">AI-Powered Pre-formulation</div>
            <h1 className="hero-title">
              Smarter Drug<br /><span>Formulation Starts Here</span>
            </h1>
            <p className="hero-subtitle">
              From paper research to lab-ready formulations — PharmaMatch AI eliminates weeks of trial & error with intelligent excipient matching, BCS classification, and literature analysis.
            </p>
            <div className="hero-actions delay-200 animate-fade-in">
              <a href="/dashboard" className="btn btn-primary btn-large">
                Get Started
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
              <a href="#features" className="btn btn-secondary btn-large">Explore Features</a>
            </div>
          </div>

          <div className="hero-visual delay-300 animate-fade-in">
            <div className="glass-panel floating-card card-1">
              <div className="card-header">AI Excipient Match</div>
              <div className="card-body">Compatibility: <span style={{ color: 'var(--accent-color)' }}>98%</span></div>
            </div>
            <div className="glass-panel floating-card card-2">
              <div className="card-header">BCS Classification</div>
              <div className="card-body">Class II — Low Solubility</div>
            </div>
            <div className="glass-panel floating-card card-3">
              <div className="card-header">Literature Review</div>
              <div className="card-body">15 Papers Found in seconds</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">40+</div>
              <div className="stat-label">Excipients Analysed per Query</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-number">4x</div>
              <div className="stat-label">Faster Pre-formulation</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-number">3</div>
              <div className="stat-label">AI-Powered Tools</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-number">PubMed</div>
              <div className="stat-label">Real Literature Sources</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Core Features</h2>
            <p>Three intelligent tools that eliminate weeks of guesswork — click any to get started.</p>
          </div>

          <div className="grid grid-cols-3">
            <a href="/dashboard/excipient-finder" className="glass-panel feature-card feature-link">
              <div className="feature-icon">🧪</div>
              <h3>Excipient Finder</h3>
              <p>Get AI-driven excipient compatibility recommendations based on your dosage form and API. Scores ranked by compatibility with PubMed references.</p>
              <div className="feature-cta">
                Explore Excipient Finder
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </a>

            <a href="/dashboard/bcs-classifier" className="glass-panel feature-card feature-link">
              <div className="feature-icon">🧬</div>
              <h3>BCS Classifier</h3>
              <p>Classify your API by BCS class instantly. Get solubility, permeability, and dosage form insights to guide your formulation strategy.</p>
              <div className="feature-cta">
                Explore BCS Classifier
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </a>

            <a href="/dashboard/paper-analysis" className="glass-panel feature-card feature-link">
              <div className="feature-icon">📚</div>
              <h3>Paper Analysis</h3>
              <p>Type your research idea and receive AI-curated paper recommendations with summaries from PubMed, Scopus, and Elsevier — in seconds.</p>
              <div className="feature-cta">
                Explore Paper Analysis
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Three simple steps from API to formulation-ready insights.</p>
          </div>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">01</div>
              <h4>Enter Your API</h4>
              <p>Input your active pharmaceutical ingredient name or CAS number along with your target dosage form.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">02</div>
              <h4>AI Analysis</h4>
              <p>Our engine matches your API against compatibility data and live literature from PubMed & Scopus.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">03</div>
              <h4>Get Results</h4>
              <p>Receive ranked excipient recommendations, BCS classification, and downloadable PDF reports instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="audience-section">
        <div className="container">
          <div className="glass-panel promo-banner">
            <div className="promo-content">
              <h2>Built For The Pharma Ecosystem</h2>
              <div className="audience-list">
                <div className="audience-item">
                  <h4>👨‍🔬 Professors & Scholars</h4>
                  <p>Accelerate research and paper drafting with AI-curated literature.</p>
                </div>
                <div className="audience-item">
                  <h4>🏭 Industry Scientists</h4>
                  <p>Reduce R&D costs and cut time-to-market with intelligent pre-formulation.</p>
                </div>
                <div className="audience-item">
                  <h4>🎓 Students</h4>
                  <p>Learn formulation science efficiently with AI-guided insights.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bottom-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to accelerate your pre-formulation?</h2>
            <p>Start using PharmaMatch AI today — no setup required.</p>
            <a href="/dashboard" className="btn btn-primary btn-large">
              Launch the Dashboard
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
