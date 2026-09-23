// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import API, { getAllLoans, getLoanById, repayInstallment } from './api';

// Components
import LoginView from './components/LoginView';
import Header from './components/Header';
import LoanList from './components/LoanList';
import AnalyticsCards from './components/AnalyticsCards';
import BorrowerDetails from './components/BorrowerDetails';
import RepaymentTable from './components/RepaymentTable';
import ReceiptModal from './components/ReceiptModal';
import NewLoanModal from './components/NewLoanModal';

// Styles
import './styles/App.css';
import './styles/Login.css';
import './styles/Dashboard.css';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loans, setLoans] = useState([]);
  const [loanId, setLoanId] = useState('');
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filters & Modals States
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showNewLoanModal, setShowNewLoanModal] = useState(false);
  
  const [newLoanData, setNewLoanData] = useState({
    borrowerId: '',
    loanAmount: '',
    tenorMonths: '12',
    interestRate: '12',
  });

  // Fetch all loans list on login
  const fetchAllLoans = async () => {
    try {
      setLoading(true);
      const res = await getAllLoans();
      const loansData = res.data.data || [];
      setLoans(loansData);
      if (loansData.length > 0 && !loanId) {
        setLoanId(loansData[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific loan details when loanId changes
  const fetchLoanDetails = async () => {
    if (!loanId) return;
    try {
      const res = await getLoanById(loanId);
      setLoan(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Loan details load nahi ho paye');
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllLoans();
    }
  }, [token]);

  useEffect(() => {
    if (loanId) {
      fetchLoanDetails();
    }
  }, [loanId]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || 'Login fail ho gaya');
    }
  };

  const handleRepay = async (installmentNumber) => {
    try {
      await repayInstallment(loanId, {
        installmentNumber,
        paymentMode: 'UPI',
        transactionRef: `TXN_${Date.now()}`,
      });
      alert(`Installment #${installmentNumber} paid successfully!`);
      fetchLoanDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Repayment failed');
    }
  };

  const handleCreateLoan = async (e) => {
    e.preventDefault();
    try {
      // Backend POST endpoint '/loans' hit karega
      await API.post('/loans', newLoanData);
      alert('New Loan Created Successfully!');
      setShowNewLoanModal(false);
      setNewLoanData({ borrowerId: '', loanAmount: '', tenorMonths: '12', interestRate: '12' });
      fetchAllLoans();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create new loan');
    }
  };

  // Analytics Logic
  const schedule = loan?.repaymentSchedule || [];
  const totalInstallments = schedule.length;
  const paidSchedule = schedule.filter(i => i.status === 'PAID');
  const pendingSchedule = schedule.filter(i => i.status === 'PENDING');
  const totalCollected = paidSchedule.reduce((acc, curr) => acc + (curr.totalInstallmentAmount || 0), 0);
  const totalPending = pendingSchedule.reduce((acc, curr) => acc + (curr.totalInstallmentAmount || 0), 0);
  const progressPercentage = totalInstallments > 0 ? Math.round((paidSchedule.length / totalInstallments) * 100) : 0;

// Search Filter (Safe with Fallbacks)
  const filteredSchedule = schedule.filter(item => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesSearch = item.installmentNumber?.toString().includes(searchQuery) || item.totalInstallmentAmount?.toString().includes(searchQuery);
    return matchesStatus && matchesSearch;
  });
  if (!token) {
    return <LoginView email={email} setEmail={setEmail} password={password} setPassword={setPassword} handleLogin={handleLogin} />;
  }

  if (loading && !loan) return <div className="center-state"><p>Loading Dashboard...</p></div>;

  return (
    <div className="dashboard-wrapper">
      <div className="container">
        <Header 
          tenantId={loan?.tenantId || 'DEFAULT'} 
          onOpenNewLoan={() => setShowNewLoanModal(true)} 
          onLogout={() => { localStorage.removeItem('token'); setToken(''); }} 
        />

        {/* Multi-Loan Switcher Component */}
        {loans.length > 0 && (
          <LoanList 
            loans={loans} 
            activeLoanId={loanId} 
            onSelectLoan={(id) => setLoanId(id)} 
          />
        )}

        {loan ? (
          <>
            <AnalyticsCards 
              loan={loan}
              totalCollected={totalCollected}
              totalPending={totalPending}
              paidCount={paidSchedule.length}
              pendingCount={pendingSchedule.length}
              totalInstallments={totalInstallments}
              progressPercentage={progressPercentage}
            />

            <BorrowerDetails loan={loan} />

            <RepaymentTable 
              filteredSchedule={filteredSchedule}
              totalInstallments={totalInstallments}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              handleRepay={handleRepay}
              setSelectedReceipt={setSelectedReceipt}
            />
          </>
        ) : (
          <div className="center-state">Koi loan account available nahi hai.</div>
        )}

        <ReceiptModal 
          selectedReceipt={selectedReceipt} 
          loan={loan} 
          onClose={() => setSelectedReceipt(null)} 
        />

        <NewLoanModal 
          isOpen={showNewLoanModal} 
          onClose={() => setShowNewLoanModal(false)}
          newLoanData={newLoanData}
          setNewLoanData={setNewLoanData}
          handleCreateLoan={handleCreateLoan}
        />
      </div>
    </div>
  );
}