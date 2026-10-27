import React from 'react';
import { 
  X, 
  Settings, 
  ShieldCheck, 
  ArrowRight, 
  Globe, 
  Bell, 
  Lock
} from 'lucide-react';
import './AdminPortal.css';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  onNavigateToAdmin,
  activeCurrency = 'GBP',
  onCurrencyChange
}) {
  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div 
        className="settings-modal-dialog" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="settings-modal-header">
          <div className="settings-modal-title-group">
            <div className="settings-icon-wrap">
              <Settings size={20} color="#C5A059" />
            </div>
            <div>
              <h2 className="settings-modal-title">Preferences & Settings</h2>
              <p className="settings-modal-subtitle">Configure store experience and system access</p>
            </div>
          </div>
          <button 
            className="settings-modal-close" 
            onClick={onClose}
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="settings-modal-body">
          
          {/* SECTION 1: STORE EXPERIENCE PREFERENCES */}
          <div className="settings-section">
            <h3 className="settings-section-title">
              <Globe size={15} color="#6E5535" />
              <span>Regional & Currency Display</span>
            </h3>
            
            <div className="settings-card">
              <div className="settings-field-row">
                <div>
                  <div className="settings-field-label">Active Currency</div>
                  <div className="settings-field-desc">Prices throughout the shop update dynamically</div>
                </div>
                <div className="settings-currency-pills">
                  {['GBP', 'USD', 'EUR'].map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      className={`settings-pill-btn ${activeCurrency === curr ? 'active' : ''}`}
                      onClick={() => onCurrencyChange && onCurrencyChange(curr)}
                    >
                      {curr === 'GBP' ? '£ GBP' : curr === 'USD' ? '$ USD' : '€ EUR'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="settings-divider" />

              <div className="settings-field-row">
                <div>
                  <div className="settings-field-label">Delivery Region</div>
                  <div className="settings-field-desc">Default shipping calculations</div>
                </div>
                <span className="settings-static-badge">United Kingdom & Global</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: NOTIFICATIONS */}
          <div className="settings-section">
            <h3 className="settings-section-title">
              <Bell size={15} color="#6E5535" />
              <span>Customer Notifications</span>
            </h3>

            <div className="settings-card">
              <div className="settings-field-row">
                <div>
                  <div className="settings-field-label">Restock & New Harvest Alerts</div>
                  <div className="settings-field-desc">Receive notification when limited seasonal shea butter batches arrive</div>
                </div>
                <span className="settings-status-enabled">Active</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: STAFF & OPERATIONS ACCESS (KEY FEATURE) */}
          <div className="settings-section">
            <h3 className="settings-section-title staff-highlight">
              <Lock size={15} color="#C5A059" />
              <span>Staff & Administrative Access</span>
            </h3>

            <div className="settings-admin-card">
              <div className="settings-admin-card-header">
                <div className="settings-admin-icon-box">
                  <ShieldCheck size={26} color="#C5A059" />
                </div>
                <div>
                  <h4 className="settings-admin-title">Operations & Admin Portal</h4>
                  <p className="settings-admin-desc">
                    Secure management console for inventory levels, customer order fulfillment, batch numbers, and logistics tracking.
                  </p>
                </div>
              </div>

              <div className="settings-admin-action-row">
                <div className="settings-admin-path-info">
                  <span className="settings-path-label">Direct URL Path:</span>
                  <code className="settings-path-code">/admin</code>
                </div>

                <button 
                  type="button"
                  className="settings-admin-login-btn"
                  onClick={() => {
                    onClose();
                    if (onNavigateToAdmin) {
                      onNavigateToAdmin();
                    }
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>Login to Admin Portal</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="settings-admin-footnote">
                Protected by 256-Bit SSL encryption • Separate administrative credentials required
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="settings-modal-footer">
          <div style={{ fontSize: '0.75rem', color: '#8A9289' }}>
            LICHT LUXE NATURALS • Made in LOVEWORLD
          </div>
          <button 
            type="button" 
            className="settings-modal-done-btn"
            onClick={onClose}
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
}
