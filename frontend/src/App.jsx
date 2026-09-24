import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import AddItem from './pages/AddItem';
import AmortizationCalculator from './pages/AmortizationCalculator';
import BorrowerManagement from './pages/BorrowerManagement';
import LoanManagement from './pages/LoanManagement';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        {/* Top Header Navigation with Dropdown */}
        <Navbar />

        {/* Main Content Body */}
        <main className="flex-1 pb-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddItem />} />
            <Route path="/amortization" element={<AmortizationCalculator />} />
            <Route path="/borrowers" element={<BorrowerManagement />} />
            <Route path="/loans" element={<LoanManagement />} />
          </Routes>
        </main>

        {/* Bottom Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;