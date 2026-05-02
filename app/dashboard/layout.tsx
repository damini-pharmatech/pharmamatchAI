"use client";

import { usePathname } from 'next/navigation';
import "./dashboard.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Tools</h3>
        </div>
        <nav className="sidebar-nav">
          <a href="/dashboard" className={`sidebar-link ${pathname === '/dashboard' ? 'active' : ''}`}>
            Dashboard Home
          </a>
          <a href="/dashboard/excipient-finder" className={`sidebar-link ${pathname?.includes('/excipient-finder') ? 'active' : ''}`}>
            🧪 Excipient Finder
          </a>
          <a href="/dashboard/dosage-recommendation" className={`sidebar-link ${pathname?.includes('/dosage-recommendation') ? 'active' : ''}`}>
            💊 Dosage Recommendation
          </a>
          <a href="/dashboard/paper-analysis" className={`sidebar-link ${pathname?.includes('/paper-analysis') ? 'active' : ''}`}>
            📚 Paper Analysis
          </a>
        </nav>
      </aside>
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}
