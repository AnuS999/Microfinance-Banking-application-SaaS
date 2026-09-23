import React from 'react';

export default function BorrowerDetails({ loan }) {
  return (
    <div className="grid-container">
      <div className="card">
        <div className="card-header">
          <span className="card-label">Borrower Details</span>
          <span className="status-badge">{loan.status}</span>
        </div>
        <h2 className="borrower-name">{loan.borrowerId?.name || 'Ramesh Kumar'}</h2>
        <div className="info-row">
          <span>Phone:</span> <strong>{loan.borrowerId?.phone || 'N/A'}</strong>
        </div>
        <div className="info-row">
          <span>Scheme:</span> <strong>{loan.schemeId?.name || 'Standard Loan'}</strong>
        </div>
      </div>

      <div className="card">
        <span className="card-label">Loan Terms</span>
        <div className="amount-display">₹{loan.loanAmount?.toLocaleString()}</div>
        <p className="amount-subtext">Principal Disbursed Amount</p>
        <div className="info-row" style={{ marginTop: '16px' }}>
          <span>Interest Rate:</span> <strong>{loan.interestRate}% P.A.</strong>
        </div>
        <div className="info-row">
          <span>Tenure:</span> <strong>{loan.tenorMonths} Months</strong>
        </div>
      </div>
    </div>
  );
}