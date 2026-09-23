import React from 'react';

export default function NewLoanModal({ isOpen, onClose, newLoanData, setNewLoanData, handleCreateLoan }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="receipt-modal" style={{ maxWidth: '520px' }}>
        <div className="receipt-header">
          <h3 style={{ margin: 0, fontSize: '16px' }}>Apply Loan for Borrower</h3>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px' }}
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleCreateLoan} className="receipt-body">
          <div className="input-group">
            <label className="form-label">Borrower ID (MongoDB ObjectId)</label>
            <input
              type="text"
              required
              placeholder="e.g. 65a4f8f0377b2496c39ca1ab"
              className="form-input"
              value={newLoanData.borrowerId}
              onChange={(e) => setNewLoanData({ ...newLoanData, borrowerId: e.target.value })}
            />
            <small style={{ color: '#64748b', fontSize: '11px', marginTop: '4px', display: 'block' }}>
              Ensure this borrower is already registered in your organization.
            </small>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label className="form-label">Loan Amount (₹)</label>
              <input
                type="number"
                required
                placeholder="50000"
                className="form-input"
                value={newLoanData.loanAmount}
                onChange={(e) => setNewLoanData({ ...newLoanData, loanAmount: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label className="form-label">Interest Rate (% P.A.)</label>
              <input
                type="number"
                required
                className="form-input"
                value={newLoanData.interestRate}
                onChange={(e) => setNewLoanData({ ...newLoanData, interestRate: e.target.value })}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="form-label">Tenure (Months)</label>
            <select
              className="form-input"
              value={newLoanData.tenorMonths}
              onChange={(e) => setNewLoanData({ ...newLoanData, tenorMonths: e.target.value })}
            >
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
              <option value="24">24 Months</option>
              <option value="36">36 Months</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button type="submit" className="primary-btn" style={{ margin: 0 }}>
              Submit Loan Application
            </button>
            <button type="button" onClick={onClose} className="close-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}