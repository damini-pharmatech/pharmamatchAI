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
            <h1 className="hero-title">
              AI-Driven <span>Pharmamatch</span>
            </h1>
            <p className="hero-subtitle">
              Revolutionizing Pre-formulation. Save time & cost from paper research to lab trials in pre-formulation and formulation of dosage forms.
            </p>
            <div className="hero-actions delay-200 animate-fade-in">
              <a href="/dashboard" className="btn btn-primary btn-large">Try the Prototype</a>
              <a href="#features" className="btn btn-secondary btn-large">Explore Features</a>
            </div>
          </div>
          
          <div className="hero-visual delay-300 animate-fade-in">
            <div className="glass-panel floating-card card-1">
              <div className="card-header">AI Excipient Match</div>
              <div className="card-body">Highly Compatible: 98%</div>
            </div>
            <div className="glass-panel floating-card card-2">
              <div className="card-header">Dosage Analysis</div>
              <div className="card-body">Processing API...</div>
            </div>
            <div className="glass-panel floating-card card-3">
              <div className="card-header">Literature Review</div>
              <div className="card-body">15 Papers Found in seconds</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Core Features</h2>
            <p>Our intelligent tools eliminate weeks of trial & error.</p>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="glass-panel feature-card">
              <div className="feature-icon">🧪</div>
              <h3>Excipient & API Match</h3>
              <p>Get AI-driven excipient compatibility recommendations based on specific dosage forms and API structures.</p>
            </div>
            
            <div className="glass-panel feature-card delay-100">
              <div className="feature-icon">💊</div>
              <h3>Dosage Form Selector</h3>
              <p>Input your API details and discover the most suitable dosage form formulations instantly.</p>
            </div>
            
            <div className="glass-panel feature-card delay-200">
              <div className="feature-icon">📚</div>
              <h3>Paper Analysis</h3>
              <p>Type your idea and receive highly recommended paper links with rapid AI-generated insights and summaries.</p>
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
                  <p>Accelerate research and paper drafting.</p>
                </div>
                <div className="audience-item">
                  <h4>🏭 Industry & Scientists</h4>
                  <p>Reduce R&D costs and time-to-market.</p>
                </div>
                <div className="audience-item">
                  <h4>🎓 Students</h4>
                  <p>Learn formulation patterns efficiently.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
