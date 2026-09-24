import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ChevronDown, 
  PlusCircle, 
  Calculator, 
  Users, 
  Landmark, 
  Settings 
} from 'lucide-react';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  // Navigation Items
  const modules = [
    { name: 'Add Items', path: '/add', icon: PlusCircle, desc: 'CRUD operations' },
    { name: 'Amortization Calc', path: '/amortization', icon: Calculator, desc: 'EMI & Interest Schedule' },
    { name: 'Borrower Profiles', path: '/borrowers', icon: Users, desc: 'Manage Borrowers' },
    { name: 'Loan Tracking', path: '/loans', icon: Landmark, desc: 'Disburse & Collect EMIs' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xl">
            LIN
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              LIN IN MICROCARE FOUNDATION
            </div>
            <div className="text-[10px] text-indigo-600 font-medium">
              आपका भरोसा, हमारी पहचान
            </div>
          </div>
        </Link>

        {/* Navigation Controls */}
        <div className="flex items-center gap-4">
          {/* Dashboard Button */}
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              location.pathname === '/'
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard size={16} /> Dashboard
          </Link>

          {/* Modules Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all"
            >
              <Users size={16} className="text-slate-500" />
              <span>Modules & Features</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Box */}
            {dropdownOpen && (
              <div 
                onMouseLeave={() => setDropdownOpen(false)}
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Application Module
                </div>
                {modules.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-start gap-3 px-3 py-2 hover:bg-indigo-50/50 transition-colors"
                    >
                      <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white">
                        <Icon size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            LM
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;