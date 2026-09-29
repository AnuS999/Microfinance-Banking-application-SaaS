import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import { IndianRupee, CheckCircle, Clock, Plus, Shield, Search } from 'lucide-react';
import jsPDF from 'jspdf';

const EmiCollection = () => {
  const [activeMembers, setActiveMembers] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [emiAmount, setEmiAmount] = useState('');
  const [installmentNo, setInstallmentNo] = useState(1);

  // Receipt Generator Function
const generateReceiptPDF = (collection) => {
  const doc = new jsPDF();

  // Header / Brand
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("LIN IN MICROCARE FOUNDATION", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("आपका भरोसा, हमारी पहचान", 105, 26, { align: "center" });
  doc.text("--------------------------------------------------------------------------------------------------", 105, 32, { align: "center" });

  // Receipt Title
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("EMI REPAYMENT COLLECTION RECEIPT", 105, 42, { align: "center" });

  // Details Box
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  let startY = 55;
  const leftX = 20;
  const rightX = 130;

  doc.text(`Receipt ID: REC-${Math.floor(100000 + Math.random() * 900000)}`, leftX, startY);
  doc.text(`Date: ${new Date(collection.createdAt || Date.now()).toLocaleDateString()}`, rightX, startY);

  startY += 10;
  doc.text(`Member Name: ${collection.memberName}`, leftX, startY);
  doc.text(`Branch: ${collection.branchName}`, rightX, startY);

  startY += 10;
  doc.text(`Installment No: Week ${collection.installmentNo}`, leftX, startY);
  doc.text(`Payment Mode: ${collection.paymentMode}`, rightX, startY);

  startY += 10;
  doc.text(`Collected By: ${collection.collectedBy}`, leftX, startY);
  doc.text(`Status: ${collection.status}`, rightX, startY);

  // Amount Highlight Box
  startY += 20;
  doc.setFillColor(240, 243, 250);
  doc.rect(20, startY, 170, 15, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Amount Paid: Rs. ${collection.emiAmount}`, 25, startY + 10);

  // Footer / Signatures
  startY += 40;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Authorized Signature", 20, startY);
  doc.text("Member Signature", 150, startY);

  doc.text("This is a computer-generated receipt and requires no physical signature.", 105, startY + 20, { align: "center" });

  // Save PDF
  doc.save(`Receipt-${collection.memberName}-${collection.installmentNo}.pdf`);
};

  useEffect(() => {
    fetchActiveLoans();
    fetchCollectionsLog();
  }, []);

  const fetchActiveLoans = async () => {
    try {
      const res = await API.get('/loan-applications/all');
      // Sirf DISBURSED (active) loans filter karein
      const disbursed = res.data.data || [];
      setActiveMembers(disbursed);
    } catch (err) {
      console.error('Error fetching active loans', err);
    }
  };

  const fetchCollectionsLog = async () => {
    try {
      const res = await API.get('/repayments/all'); // Backend route jodne ke baad
      setCollections(res.data.data || []);
    } catch (err) {
      console.error('Error fetching collections', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectEMI = async (e) => {
    e.preventDefault();
    if (!selectedMember) return alert('Please select a member');

    try {
      await API.post('/repayments/collect', {
        memberId: selectedMember._id,
        installmentNo,
        emiAmount,
        collectedBy: 'Field Agent',
        paymentMode: 'CASH'
      });
      alert('EMI Collected Successfully!');
      setSelectedMember(null);
      setEmiAmount('');
      fetchActiveLoans();
      fetchCollectionsLog();
    } catch (err) {
      alert(err.response?.data?.message || 'Collection failed');
    }
  };

  

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <IndianRupee className="text-indigo-600" size={20} /> EMI Collection & Repayment Tracking
            </h1>
            <p className="text-xs text-slate-500">Record weekly/monthly installments and track active loan repayments.</p>
          </div>
        </div>

        {/* Quick Collection Action Box */}
        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Active Member</label>
            <select
              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
              onChange={(e) => {
                const member = activeMembers.find(m => m._id === e.target.value);
                setSelectedMember(member);
              }}
            >
              <option value="">-- Choose Member --</option>
              {activeMembers.map(m => (
                <option key={m._id} value={m._id}>{m.memberName} ({m.branchName})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Installment / Week No.</label>
            <input
              type="number"
              value={installmentNo}
              onChange={(e) => setInstallmentNo(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
              placeholder="e.g. 1, 2, 3..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">EMI Amount (₹)</label>
            <input
              type="number"
              value={emiAmount}
              onChange={(e) => setEmiAmount(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
              placeholder="Enter EMI amount"
              required
            />
          </div>

          <div>
            <button
              onClick={handleCollectEMI}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus size={14} /> Record Collection
            </button>
          </div>
        </div>

        {/* Recent Collections Table */}
        <div className="space-y-3">
          <h2 className="font-bold text-slate-700 text-sm">Recent Collection Logs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Member Name</th>
                  <th className="p-3">Branch</th>
                  <th className="p-3">Installment No</th>
                  <th className="p-3">Amount Collected</th>
                  <th className="p-3">Payment Mode</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {collections.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-slate-400">No collections recorded yet.</td>
                  </tr>
                ) : (
                  collections.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-800">{item.memberName}</td>
                      <td className="p-3 text-slate-600">{item.branchName}</td>
                      <td className="p-3 text-slate-600 font-semibold">Week {item.installmentNo}</td>
                      <td className="p-3 font-bold text-emerald-600">₹{item.emiAmount}</td>
                      <td className="p-3 text-slate-600 uppercase">{item.paymentMode}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold text-[10px] inline-flex items-center gap-1">
                          <CheckCircle size={10} /> {item.status}
                        </span>
                      </td>
                      <td className="p-3">
          <button
            onClick={() => generateReceiptPDF(item)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded text-[10px] font-semibold border border-slate-200 transition-colors flex items-center gap-1 shadow-sm"
          >
            📥 Download Receipt
          </button>
        </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmiCollection;