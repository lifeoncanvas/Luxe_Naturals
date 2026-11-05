import React from 'react';
import { 
  X, 
  Settings, 
  ShieldCheck, 
  ArrowRight, 
  Globe, 
  Bell, 
  Lock,
  Zap,
  Wallet
} from 'lucide-react';
import './AdminPortal.css';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  onNavigateToAdmin,
  activeCurrency = 'USD',
  onCurrencyChange,
  espeesMerchantWallet = 'merchanttest01',
  onEspeesMerchantWalletChange,
  espeesApiKey = 'esp_70312df6-72b9-42a7-a4e8-5addfaf12f1e',
  onEspeesApiKeyChange
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
              <p className="settings-modal-subtitle">Configure store experience, Espees gateway and staff access</p>
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
                  {['USD', 'ESP', 'GBP', 'EUR'].map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      className={`settings-pill-btn ${activeCurrency === curr ? 'active' : ''}`}
                      onClick={() => onCurrencyChange && onCurrencyChange(curr)}
                    >
                      {curr === 'USD' ? '$ USD' : curr === 'ESP' ? '⚡ ESP (Espees)' : curr === 'GBP' ? '£ GBP' : '€ EUR'}
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

          {/* SECTION 2: ESPEES (ESP) LOVEWORLD PAYMENT GATEWAY */}
          <div className="settings-section">
            <h3 className="settings-section-title" style={{ color: '#6E5535' }}>
              <Zap size={15} color="#C5A059" />
              <span>Espees (ESP) · Loveworld Pay Settings</span>
            </h3>

            <div className="settings-card" style={{ border: '1.5px solid #C5A059', backgroundColor: '#FAF6EE' }}>
              <div className="settings-field-row" style={{ alignItems: 'flex-start' }}>
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <div className="settings-field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Wallet size={14} color="#6E5535" />
                    <span>Espees Merchant Wallet Handle</span>
                  </div>
                  <div className="settings-field-desc">
                    Members send direct ESP transfers to this wallet username from the Espees App.
                  </div>
                  <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: '#6E5535' }}>
                    Official Test Merchant: <strong style={{ color: '#2D3A29' }}>@merchanttest01</strong> (Code: <code>ESPMER01</code>)
                    <button
                      type="button"
                      onClick={() => onEspeesMerchantWalletChange && onEspeesMerchantWalletChange('merchanttest01')}
                      style={{ marginLeft: '0.5rem', fontSize: '0.68rem', padding: '0.15rem 0.45rem', border: '1px solid #C5A059', borderRadius: '3px', background: '#DFCAA7', color: '#2D3A29', cursor: 'pointer', fontWeight: 700 }}
                    >
                      Fill Test Merchant
                    </button>
                  </div>
                </div>
                <input 
                  type="text"
                  value={espeesMerchantWallet}
                  onChange={(e) => onEspeesMerchantWalletChange && onEspeesMerchantWalletChange(e.target.value)}
                  placeholder="merchanttest01"
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #C5A059',
                    fontSize: '0.875rem',
                    width: '180px',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#2D3A29',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>

              <div className="settings-divider" />

              <div className="settings-field-row" style={{ alignItems: 'flex-start' }}>
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <div className="settings-field-label">Espees Developer API Key (x-api-key)</div>
                  <div className="settings-field-desc">
                    Optional: developer token from <a href="https://developers.espees.org" target="_blank" rel="noreferrer" style={{ color: '#C5A059', textDecoration: 'underline' }}>developers.espees.org</a> to activate the hosted web redirect portal.
                  </div>
                </div>
                <input 
                  type="password"
                  value={espeesApiKey}
                  onChange={(e) => onEspeesApiKeyChange && onEspeesApiKeyChange(e.target.value)}
                  placeholder="Paste x-api-key..."
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #D6DDD3',
                    fontSize: '0.85rem',
                    width: '180px',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>

              <div className="settings-divider" />

              <div className="settings-field-row">
                <div>
                  <div className="settings-field-label">Official Exchange Rate Peg</div>
                  <div className="settings-field-desc">Loveworld financial ecosystem standard</div>
                </div>
                <span className="settings-static-badge" style={{ backgroundColor: '#2D3A29', color: '#DFCAA7', fontWeight: 700 }}>
                  1 ESP = $1.00 USD
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 3: NOTIFICATIONS */}
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

          {/* SECTION 4: STAFF & OPERATIONS ACCESS */}
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
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
