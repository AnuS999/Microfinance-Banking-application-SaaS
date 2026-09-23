import React from 'react';

export default function LoanList({ loans, activeLoanId, onSelectLoan }) {
  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div className="card-header">
        <span className="card-label">All Loan Accounts / Tenants</span>
        <span className="record-count">{loans.length} Accounts</span>
      </div>
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px', marginTop: '12px' }}>
        {loans.map((l) => {
          const isSelected = l._id === activeLoanId;
          return (
            <button
              key={l._id}
              onClick={() => onSelectLoan(l._id)}
              style={{
                background: isSelected ? 'var(--primary)' : '#f8fafc',
                color: isSelected ? '#ffffff' : '#0f172a',
                border: isSelected ? 'none' : '1px solid #cbd5e1',
                padding: '10px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                minWidth: '180px',
                textAlign: 'left',
                flexShrink: 0,
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: '700' }}>
                {l.borrowerId?.name || 'Ramesh Kumar'}
              </div>
              <div style={{ fontSize: '11px', opacity: isSelected ? 0.9 : 0.6, marginTop: '2px' }}>
                ₹{l.loanAmount?.toLocaleString()} ({l.tenorMonths}M)
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}