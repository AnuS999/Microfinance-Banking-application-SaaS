import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import GroupLoanGRT from './pages/GroupLoanGRT';
// Pages Import
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Borrowers from './pages/Borrowers';
import Loans from './pages/Loans';
import AmortizationCalc from './pages/AmortizationCalc';
import AddItem from './pages/AddItem';
import LoanApplicationForm from './pages/LoanApplicationForm';
import MemberLog from './pages/MemberLog';
import EmiCollection from './pages/EmiCollection';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Navbar />
        <main className="pb-12">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (Accessible by ADMIN and AGENT) */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'AGENT']} />}>
              <Route path="/" element={<Home />} />
              <Route path="/borrowers" element={<Borrowers />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/amortization" element={<AmortizationCalc />} />
              <Route path="/add" element={<AddItem />} />
              <Route path="/group-loan-grt" element={<GroupLoanGRT />} />
              <Route path="/loan-application-form" element={<LoanApplicationForm />} />
              <Route path="/member-log" element={<MemberLog />} />
              <Route path="/emi-collection" element={<EmiCollection />} />
            </Route>

            {/* Fallback Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;