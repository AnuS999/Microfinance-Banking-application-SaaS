import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages Import
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Borrowers from './pages/Borrowers';
import Loans from './pages/Loans';
import AmortizationCalc from './pages/AmortizationCalc';
import AddItem from './pages/AddItem';

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