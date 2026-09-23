import React from 'react';

export default function AnalyticsCards({ loan, totalCollected, totalPending, paidCount, totalInstallments, pendingCount, progressPercentage }) {
  return (
    <div className="analytics-grid">
      <div className="analytics-card border-blue">
        <span className="analytics-label">Total Loan Payable</span>
        <div className="analytics-value">₹{loan.totalAmountPayable?.toLocaleString()}</div>
        <p className="analytics-sub">Principal + Interest ({loan.tenorMonths} M)</p>
      </div>

      <div className="analytics-card border-green">
        <span className="analytics-label">Total Collected</span>
        <div className="analytics-value text-green">₹{totalCollected.toLocaleString()}</div>
        <p className="analytics-sub">{paidCount} of {totalInstallments} EMIs Paid</p>
      </div>

      <div className="analytics-card border-amber">
        <span className="analytics-label">Outstanding Pending</span>
        <div className="analytics-value text-amber">₹{totalPending.toLocaleString()}</div>
        <p className="analytics-sub">{pendingCount} EMIs Remaining</p>
      </div>

      <div className="analytics-card border-purple">
        <span className="analytics-label">Recovery Progress</span>
        <div className="analytics-value">{progressPercentage}%</div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>
    </div>
  );
}