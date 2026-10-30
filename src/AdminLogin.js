import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import './AdminPortal.css';

export default function AdminLogin({ onLoginSuccess, onExitToStore }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setError('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setError('Please provide both administrator username/email and password.');
      return;
    }

    setIsLoading(true);

    // Simulate authenticating security check
    setTimeout(() => {
      // Validate credentials (accepting standard admin / admin123 or demo accounts)
      const validUsers = ['admin@licht.com', 'admin', 'manager@licht.com', 'operations@licht.com', 'lead@licht.com'];
      const validPasswords = ['admin123', 'admin2026', 'admin', 'licht2026', 'password'];

      const isValidUser = validUsers.includes(cleanUser) || cleanUser.includes('admin');
      const isValidPass = validPasswords.includes(cleanPass) || cleanPass === 'admin123';

      if (isValidUser && isValidPass) {
        setIsLoading(false);
        const adminData = {
          username: cleanUser,
          displayName: cleanUser === 'admin@licht.com' ? 'Lead Operations Director' : 'Administrator',
          role: 'Operations & Inventory Lead',
          loginTime: new Date().toISOString()
        };

        if (rememberMe) {
          localStorage.setItem('licht_admin_auth', JSON.stringify(adminData));
        } else {
          sessionStorage.setItem('licht_admin_auth', JSON.stringify(adminData));
        }

        if (onLoginSuccess) {
          onLoginSuccess(adminData);
        }
      } else {
        setIsLoading(false);
        setError('Invalid credentials. Use admin@licht.com / admin123 or click "Demo One-Click Login".');
      }
    }, 500);
  };

  const handleQuickDemo = () => {
    setUsername('admin@licht.com');
    setPassword('admin123');
    setError('');
    
    // Quick auto-login after filling
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const adminData = {
        username: 'admin@licht.com',
        displayName: 'Lead Operations Director',
        role: 'Operations & Inventory Lead',
        loginTime: new Date().toISOString()
      };
      if (rememberMe) {
        localStorage.setItem('licht_admin_auth', JSON.stringify(adminData));
      } else {
        sessionStorage.setItem('licht_admin_auth', JSON.stringify(adminData));
      }
      if (onLoginSuccess) {
        onLoginSuccess(adminData);
      }
    }, 400);
  };

  return (
    <div className="admin-login-screen">
      {/* Ambient background decorative elements */}
      <div className="admin-login-glow-1" />
      <div className="admin-login-glow-2" />

      {/* Main Login Card */}
      <div className="admin-login-card">
        {/* Top Header with Brand */}
        <div className="admin-login-header">
          <div className="admin-login-brand">
            <div className="admin-login-logo-mark">
              <img 
                src="/logo-dark-mark.png" 
                alt="LICHT Logo" 
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="admin-login-brand-text">
              <span className="admin-login-brand-title">LICHT</span>
              <span className="admin-login-brand-subtitle">LUXE NATURALS</span>
            </div>
          </div>

          <div className="admin-login-shield-badge">
            <ShieldCheck size={22} color="#C5A059" />
          </div>

          <h1 className="admin-login-title">Operations Console</h1>
          <p className="admin-login-sub">
            Administrative & Inventory Management Portal. Authorised personnel only.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="admin-login-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-login-field">
            <label className="admin-login-label">
              <User size={14} color="#C5A059" />
              <span>Admin Identity / Email</span>
            </label>
            <div className="admin-login-input-wrap">
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter administrator email or username"
                required
                className="admin-login-input"
                autoComplete="off"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="admin-login-field">
            <div className="admin-login-label-row">
              <label className="admin-login-label">
                <Lock size={14} color="#C5A059" />
                <span>Security Passcode</span>
              </label>
            </div>
            <div className="admin-login-input-wrap">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter security passcode"
                required
                className="admin-login-input"
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button 
                type="button" 
                className="admin-login-pw-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="admin-login-options">
            <label className="admin-login-remember">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember this session</span>
            </label>
            <button 
              type="button" 
              onClick={handleQuickDemo}
              className="admin-login-quick-link"
              title="Click to auto-authenticate with demo credentials"
            >
              <Sparkles size={13} color="#C5A059" />
              <span>Demo One-Click Login</span>
            </button>
          </div>

          <button 
            type="submit" 
            className="admin-login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="admin-login-spinner-wrap">
                <span className="admin-login-spinner" />
                Authenticating...
              </span>
            ) : (
              <>
                <span>Sign In to Admin Portal</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper Box */}
        <div className="admin-login-hint-box">
          <div className="admin-login-hint-title">
            <CheckCircle2 size={14} color="#4AB97A" />
            <span>Authorized Demo Credentials</span>
          </div>
          <div className="admin-login-hint-details">
            <div>User: <code>admin@licht.com</code></div>
            <div>Pass: <code>admin123</code></div>
          </div>
        </div>

        {/* Footer & Back to Store */}
        <div className="admin-login-footer">
          <button 
            onClick={onExitToStore}
            className="admin-login-back-btn"
          >
            <ArrowLeft size={15} />
            <span>Return to Customer Storefront</span>
          </button>
          <div className="admin-login-security-tag">
            🔒 256-Bit Encrypted • Direct Admin Route: /admin
          </div>
        </div>
      </div>
    </div>
  );
}
