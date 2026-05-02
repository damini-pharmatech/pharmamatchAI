import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Pharmamatch AI - AI-Driven Pre-formulation",
  description: "Save time & cost in pre-formulation and formulation of dosage forms with AI-driven recommendations and literature analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <nav className="navbar">
          <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Pharmamatch<span style={{ color: 'var(--accent-color)' }}>AI</span>
          </div>
          <div className="nav-links">
            <a href="/" className="nav-link">Home</a>
            <a href="/auth" className="nav-link">Sign In</a>
            <a href="/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Dashboard</a>
          </div>
        </nav>
        <Providers>
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
