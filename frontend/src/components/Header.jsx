import React from 'react';

export default function Header({ tenantId, onOpenNewLoan, onLogout }) {
  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="brand-badge">M</div>
        <div>
          <h1 className="nav-title">Microfinance SaaS</h1>
          <p className="nav-subtitle">Tenant ID: {tenantId}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onOpenNewLoan} className="action-header-btn">
          + New Loan
        </button>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
}