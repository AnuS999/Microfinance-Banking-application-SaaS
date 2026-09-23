import React from 'react';

export default function LoginView({ email, setEmail, password, setPassword, handleLogin }) {
  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-card">
        <div className="brand-header">
          <div className="logo-badge">M</div>
          <h2 className="login-title">SaaS Admin Login</h2>
        </div>
        <p className="login-subtitle">Microfinance Management Portal</p>
        
        <div className="input-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@organization.com"
            className="form-input"
            required
          />
        </div>

        <div className="input-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="primary-btn">
          Sign In to Dashboard
        </button>
      </form>
    </div>
  );
}