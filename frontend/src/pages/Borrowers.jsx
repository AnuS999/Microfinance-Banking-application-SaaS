// src/pages/Borrowers.jsx (Updated to handle system credentials)

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// ... (standard imports for forms and existing slice actions)
import { registerUserAccount, clearAuthError } from '../redux/slices/authSlice';
import { UserPlus, Lock, Key, Mail, ShieldCheck, CreditCard } from 'lucide-react';

const Borrowers = () => {
  const dispatch = useDispatch();
  
  // Standard borrower state
  const [borrowerData, setBorrowerData] = useState({
    name: '', panNumber: '', aadhaarNumber: '', phoneNumber: '',
  });

  // Optional: System Account Generation state
  const [generateAccount, setGenerateAccount] = useState(false);
  const [systemCredentials, setSystemCredentials] = useState({
    systemEmail: '', systemPassword: '',
  });

  const { loading: authLoading, error: authError } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ... (Your original logic to create the Borrower profile first)

    // Optional: Create System User Account if checked
    if (generateAccount && systemCredentials.systemEmail && systemCredentials.systemPassword) {
      const result = await dispatch(registerUserAccount({
        name: borrowerData.name, // Use same name
        email: systemCredentials.systemEmail,
        password: systemCredentials.systemPassword,
        role: 'AGENT', // Define default role for new user logins
      }));

      if (registerUserAccount.fulfilled.match(result)) {
        // ... (Show success notification for account creation)
      } else if (registerUserAccount.rejected.match(result)) {
        // ... (Show error notification for account creation failure)
      }
    }

    // ... (Handle form reset/redirection after profile and optional account creation)
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* ... (Your standard page title and navigation links) */}

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
          <UserPlus size={20} className="text-indigo-600"/>
          Add New Borrower Profile
        </h2>

        {authError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 mb-6">
            <ShieldCheck size={16} className="shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... (Original Standard Borrower Profile Fields) */}

          <div className="border-t border-slate-200 pt-6"></div>

          {/* Optional: User Account Checkbox */}
          <div className="flex items-center gap-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
            <input
              type="checkbox"
              id="generateAccount"
              checked={generateAccount}
              onChange={(e) => {
                setGenerateAccount(e.target.checked);
                dispatch(clearAuthError()); // Clear previous auth error
              }}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <label htmlFor="generateAccount" className="text-sm font-semibold text-indigo-900">
              Also generate system login credentials? (Default Agent role)
            </label>
          </div>

          {/* Conditional Input Fields */}
          {generateAccount && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">System Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    name="systemEmail"
                    required={generateAccount} // Standard required if checked
                    value={systemCredentials.systemEmail}
                    onChange={(e) => setSystemCredentials({...systemCredentials, systemEmail: e.target.value})}
                    placeholder="account@lin.org"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">System Password</label>
                <div className="relative">
                  <Key size={16} className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    name="systemPassword"
                    required={generateAccount} // Standard required if checked
                    value={systemCredentials.systemPassword}
                    onChange={(e) => setSystemCredentials({...systemCredentials, systemPassword: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-slate-200 pt-6"></div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg text-xs transition-colors shadow-sm disabled:opacity-50"
          >
            {authLoading ? 'Creating Profile & User...' : 'Add Borrower Profile & Generate credentials'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Borrowers;