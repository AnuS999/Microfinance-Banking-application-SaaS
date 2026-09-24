import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ChevronDown, 
  PlusCircle, 
  Calculator, 
  Users, 
  FileText, 
  Settings,
  Layers
} from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Dropdown menu items
  const menuItems = [
    { name: 'Add Item', path: '/add', icon: PlusCircle, desc: 'Create new items/data' },
    { name: 'Loan Engine', path: '/amortization', icon: Calculator, desc: 'Amortization schedule' },
    { name: 'Borrowers', path: '/borrowers', icon: Users, desc: 'Manage borrower profiles' },
    { name: 'Reports', path: '/reports', icon: FileText, desc: 'Financial reports & logs' },
  ];

  // Outside click par dropdown close karne ke liye
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Company Branding & Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="LIN IN Microcare Foundation" className="h-14 w-auto object-contain" />
            <div className="hidden md:block border-l border-slate-300 pl-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                LIN IN MICROCARE FOUNDATION
              </p>
              <p className="text-xs text-indigo-700 font-medium">
                आपका भरोसा, हमारी पहचान
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            {/* Dashboard Link */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            {/* Combined Single Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDropdownOpen
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Layers size={18} />
                <span>Modules & Features</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown Box */}
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Quick Access
                    </p>
                  </div>

                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsDropdownOpen(false)}
                        className={({ isActive }) =>
                          `flex items-start gap-3 px-3 py-2.5 mx-1 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-indigo-50 text-indigo-700 font-medium'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`
                        }
                      >
                        <div className="p-1.5 rounded-md bg-slate-100 text-slate-600 mt-0.5">
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-medium leading-none">{item.name}</div>
                          <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
                        </div>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* User Profile / Action Icon */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
              <Settings size={20} />
            </button>
            <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              LM
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;