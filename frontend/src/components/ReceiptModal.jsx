import React from 'react';

export default function ReceiptModal({ selectedReceipt, loan, onClose }) {
  if (!selectedReceipt) return null;

  return (
    <div className="modal-overlay">
      <div className="receipt-modal">
        <div className="receipt-header">
          <h3 style={{ margin: 0, fontSize: '16px' }}>Payment Receipt</h3>
          <span style={{ fontSize: '12px', opacity: 0.8 }}>OFFICIAL SLIP</span>
        </div>
        <div className="receipt-body">
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, color: '#16a34a', fontSize: '26px' }}>
              ₹{selectedReceipt.totalInstallmentAmount?.toLocaleString()}
            </h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
              Payment Received Successfully ✓
            </p>
          </div>

          <div className="receipt-divider"></div>

          <div className="info-row">
            <span>Borrower Name:</span>
            <strong>{loan.borrowerId?.name || 'Ramesh Kumar'}</strong>
          </div>
          <div className="info-row">
            <span>Installment Number:</span>
            <strong>#{selectedReceipt.installmentNumber}</strong>
          </div>
          <div className="info-row">
            <span>Due Date:</span>
            <strong>{new Date(selectedReceipt.dueDate).toLocaleDateString('en-IN')}</strong>
          </div>
          <div className="info-row">
            <span>Payment Mode:</span>
            <strong>{selectedReceipt.paymentMode || 'UPI / Cash'}</strong>
          </div>
          <div className="info-row">
            <span>Transaction ID:</span>
            <strong>{selectedReceipt.transactionRef || `TXN_${Date.now().toString().slice(-6)}`}</strong>
          </div>
        </div>

        <div className="receipt-actions">
          <button onClick={() => window.print()} className="print-btn">
            Print / Download PDF 🖨️
          </button>
          <button onClick={onClose} className="close-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}