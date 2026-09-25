import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { 
  LayoutDashboard, 
  ChevronDown, 
  PlusCircle, 
  Calculator, 
  Users, 
  Landmark, 
  LogOut, 
  ShieldCheck,
  FileText,
  IndianRupee
} from 'lucide-react';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) return null; // Hide Navbar on Login page

  const modules = [
    { name: 'Member List (LOA)', path: '/member-list', icon: Users, desc: 'View submitted loan applications' },
    { name: 'Add Items', path: '/add', icon: PlusCircle, desc: 'CRUD operations' },
    { name: 'Amortization Calc', path: '/amortization', icon: Calculator, desc: 'EMI & Interest Schedule' },
    { name: 'Borrower Profiles', path: '/borrowers', icon: Users, desc: 'Manage Borrowers' },
    { name: 'Loan Tracking', path: '/loans', icon: Landmark, desc: 'Disburse & Collect EMIs' },
    { name: 'Group GRT (KYC)', path: '/group-loan-grt', icon: Users, desc: 'Center KYC & CIBIL Review' },
    { name: 'EMI Collection & Tracking', path: '/emi-collection', icon: IndianRupee, desc: 'Record weekly repayments' }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
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
          <Link 
  to="/member-log" 
  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
    location.pathname === '/member-log'
      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
      : 'text-slate-600 hover:bg-slate-50'
  }`}
>
  <Users size={16} /> Member Log
</Link>
          <Link 
            to="/loan-application-form" 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              location.pathname === '/loan-application-form'
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText size={16} /> Loan Application (LOA)
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

            {dropdownOpen && (
              <div 
                onMouseLeave={() => setDropdownOpen(false)}
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50"
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
                      <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
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

          {/* User Profile Info & Logout */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-800">{user.name}</div>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                <ShieldCheck size={10} /> {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;