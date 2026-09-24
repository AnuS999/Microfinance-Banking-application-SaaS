import React from 'react';
import { Shield, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          
          {/* Column 1: Organization Detail */}
          <div>
            <h3 className="text-white font-semibold text-base mb-2">
              LIN IN MICROCARE FOUNDATION
            </h3>
            <p className="text-xs text-indigo-400 mb-3">आपका भरोसा, हमारी पहचान</p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Empowering microfinance operations with automated loan engine, repayment schedules, and borrower management.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/" className="hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="/amortization" className="hover:text-white transition-colors">Loan Calculator</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy & Compliance</a></li>
            </ul>
          </div>

          {/* Column 3: Security & Contact */}
          <div>
            <h4 className="text-white font-medium mb-3">Support & Security</h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <Shield size={16} className="text-emerald-400" /> Secure SaaS Portal
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} /> support@lininmicrocare.org
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-8 pt-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} LIN IN MICROCARE FOUNDATION. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;