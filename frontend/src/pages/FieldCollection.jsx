import React, { useState } from 'react';
import { Banknote, Search, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';

const FieldCollection = () => {
  const [selectedCenter, setSelectedCenter] = useState('Center-A (Manikpur)');
  const [collectionDate, setCollectionDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Dummy collection data for field agents
  const [borrowers, setBorrowers] = useState([
    { id: 'B001', name: 'Rahul Sharma', loanId: 'LN-101', dueAmount: 1250, paidAmount: 1250, mode: 'Cash', status: 'Paid' },
    { id: 'B002', name: 'Anita Devi', loanId: 'LN-102', dueAmount: 1500, paidAmount: 0, mode: 'Cash', status: 'Pending' },
    { id: 'B003', name: 'Sunil Kumar', loanId: 'LN-103', dueAmount: 2000, paidAmount: 2000, mode: 'Online', status: 'Paid' },
  ]);

  const [receiptData, setReceiptData] = useState(null);

  const handlePaymentChange = (id, field, value) => {
    setBorrowers(borrowers.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const handleSaveCollection = (borrower) => {
    // API call backend ko jayegi yahan
    alert(`Collection recorded successfully for ${borrower.name} (${borrower.paidAmount} INR via ${borrower.mode})`);
    setBorrowers(borrowers.map(b => b.id === borrower.id ? { ...b, status: 'Paid' } : b));
    
    // Generate Receipt Preview
    setReceiptData({
      receiptNo: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleString(),
      ...borrower
    });
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-slate-100/60 min-h-screen text-xs">
      {/* Top Header */}
      <div className="bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Banknote className="text-emerald-600" size={20} /> Field Collection & Daily Sheet
          </h1>
          <p className="text-slate-500">Record center collections, cash/online payments, and generate instant receipts.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="date" 
            value={collectionDate} 
            onChange={(e) => setCollectionDate(e.target.value)}
            className="p-2 border border-slate-200 rounded-lg bg-slate-50 font-medium" 
          />
        </div>
      </div>

      {/* Filter / Center Selection Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="font-bold text-slate-600 uppercase">Select Center:</span>
          <select 
            value={selectedCenter} 
            onChange={(e) => setSelectedCenter(e.target.value)}
            className="p-2 border border-slate-200 rounded-lg bg-white font-medium w-full md:w-64 focus:outline-none focus:border-emerald-500"
          >
            <option value="Center-A (Manikpur)">Center-A (Manikpur)</option>
            <option value="Center-B (Tajpur)">Center-B (Tajpur)</option>
            <option value="Center-C (Hajipur)">Center-C (Hajipur)</option>
          </select>
        </div>
        <div className="flex items-center gap-4 text-slate-600 font-medium">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg">
            Total Expected: ₹4,750
          </span>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg">
            Collected Today: ₹3,250
          </span>
        </div>
      </div>

      {/* Daily Collection Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 font-bold text-slate-700 uppercase">
          Center Collection Sheet - {selectedCenter}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 uppercase">
                <th className="p-3">Member Details</th>
                <th className="p-3">Loan ID</th>
                <th className="p-3">Due EMI (₹)</th>
                <th className="p-3">Collection Amt (₹)</th>
                <th className="p-3">Payment Mode</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {borrowers.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="p-3">
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <span className="text-slate-400">ID: {item.id}</span>
                  </td>
                  <td className="p-3 font-semibold text-slate-600">{item.loanId}</td>
                  <td className="p-3 font-bold text-slate-700">₹{item.dueAmount}</td>
                  <td className="p-3">
                    <input 
                      type="number" 
                      value={item.paidAmount} 
                      onChange={(e) => handlePaymentChange(item.id, 'paidAmount', e.target.value)}
                      className="w-24 p-1.5 border border-slate-200 rounded-lg bg-slate-50 font-bold text-emerald-600 focus:outline-none focus:border-emerald-500" 
                    />
                  </td>
                  <td className="p-3">
                    <select 
                      value={item.mode} 
                      onChange={(e) => handlePaymentChange(item.id, 'mode', e.target.value)}
                      className="p-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Online">Online (UPI/QR)</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full font-semibold ${item.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => handleSaveCollection(item)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-all"
                    >
                      Submit & Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instant Receipt Preview Modal / Box */}
      {receiptData && (
        <div className="bg-white p-6 rounded-xl border-2 border-emerald-500 shadow-md space-y-4 max-w-lg mx-auto mt-6">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h2 className="font-bold text-slate-800 text-sm flex items-center gap-1">
                <ShieldCheck className="text-emerald-600" size={16} /> LIN IN MICROCARE FOUNDATION
              </h2>
              <p className="text-slate-400 text-[10px]">Official Repayment Money Receipt</p>
            </div>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
              {receiptData.receiptNo}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <p><strong>Borrower:</strong> {receiptData.name}</p>
            <p><strong>Loan ID:</strong> {receiptData.loanId}</p>
            <p><strong>Amount Paid:</strong> ₹{receiptData.paidAmount}</p>
            <p><strong>Mode:</strong> {receiptData.mode}</p>
            <p className="col-span-2"><strong>Date & Time:</strong> {receiptData.date}</p>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button 
              onClick={handlePrintReceipt}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg flex items-center gap-1 font-semibold"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button 
              onClick={() => setReceiptData(null)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldCollection;