import React from 'react';

export default function RepaymentTable({ 
  filteredSchedule, 
  totalInstallments, 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter, 
  handleRepay, 
  setSelectedReceipt 
}) {
  return (
    <div className="table-card">
      <div className="table-header">
        <h3 className="table-title">Repayment Schedule</h3>
        <span className="record-count">{filteredSchedule.length} / {totalInstallments} Shown</span>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by EMI # or Amount..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        
        <div className="filter-buttons">
          {['ALL', 'PAID', 'PENDING'].map((status) => (
            <button
              key={status}
              className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Inst #</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action / Receipt</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedule.length > 0 ? (
              filteredSchedule.map((item) => (
                <tr key={item._id}>
                  <td style={{ fontWeight: '600' }}>#{item.installmentNumber}</td>
                  <td style={{ color: '#475569' }}>
                    {new Date(item.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ fontWeight: '700', color: '#0f172a' }}>
                    ₹{item.totalInstallmentAmount?.toLocaleString()}
                  </td>
                  <td>
                    <span className={item.status === 'PAID' ? 'paid-badge' : 'pending-badge'}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {item.status === 'PENDING' ? (
                      <button onClick={() => handleRepay(item.installmentNumber)} className="pay-btn">
                        Pay EMI
                      </button>
                    ) : (
                      <button onClick={() => setSelectedReceipt(item)} className="receipt-btn">
                        Receipt 📄
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                  No repayment records match your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}