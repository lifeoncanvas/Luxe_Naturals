import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Truck } from 'lucide-react';

/**
 * Legal Modal Component for LICHT LUXE NATURALS
 * Provides UK GDPR-compliant Privacy Policy, UK Consumer Terms of Service,
 * and Royal Mail Shipping & Returns policies.
 */
export default function LegalModal({ isOpen, onClose, initialTab = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync initial tab when reopened
  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(28, 36, 27, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid #E5DFC5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FAF7F2'
        }}>
          <div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C5A059', fontWeight: 700 }}>
              LEGAL & CONSUMER RIGHTS · UNITED KINGDOM
            </div>
            <h2 className="font-serif" style={{ fontSize: '1.45rem', color: '#2D3A29', margin: '0.2rem 0 0 0', fontWeight: 500 }}>
              {activeTab === 'privacy' && 'Privacy Policy & Data Protection (UK GDPR)'}
              {activeTab === 'terms' && 'Terms of Service & E-Commerce Conditions'}
              {activeTab === 'shipping' && 'Shipping, Delivery & Returns Policy'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#5C635B', cursor: 'pointer', padding: '0.35rem', borderRadius: '4px' }}
            aria-label="Close legal modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #E5DFC5',
          backgroundColor: '#FFFFFF',
          padding: '0 1.5rem',
          gap: '1rem',
          overflowX: 'auto'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            style={{
              padding: '0.85rem 0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'privacy' ? '2.5px solid #2D3A29' : '2.5px solid transparent',
              color: activeTab === 'privacy' ? '#2D3A29' : '#6B7280',
              fontWeight: activeTab === 'privacy' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap'
            }}
          >
            <ShieldCheck size={16} color={activeTab === 'privacy' ? '#C5A059' : '#6B7280'} />
            Privacy Policy
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            style={{
              padding: '0.85rem 0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'terms' ? '2.5px solid #2D3A29' : '2.5px solid transparent',
              color: activeTab === 'terms' ? '#2D3A29' : '#6B7280',
              fontWeight: activeTab === 'terms' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap'
            }}
          >
            <FileText size={16} color={activeTab === 'terms' ? '#C5A059' : '#6B7280'} />
            Terms of Service
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            style={{
              padding: '0.85rem 0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'shipping' ? '2.5px solid #2D3A29' : '2.5px solid transparent',
              color: activeTab === 'shipping' ? '#2D3A29' : '#6B7280',
              fontWeight: activeTab === 'shipping' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Truck size={16} color={activeTab === 'shipping' ? '#C5A059' : '#6B7280'} />
            Shipping & Returns
          </button>
        </div>

        {/* Content Body */}
        <div style={{
          padding: '1.75rem',
          overflowY: 'auto',
          fontSize: '0.9rem',
          lineHeight: 1.7,
          color: '#374151'
        }}>
          {/* TAB 1: PRIVACY POLICY (UK GDPR) */}
          {activeTab === 'privacy' && (
            <div>
              <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.825rem', color: '#92400E' }}>
                <strong>Business Details Notice:</strong> Please fill in registered UK business details where indicated in brackets <code style={{ backgroundColor: '#FDE68A', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>[BUSINESS DETAILS NEEDED: ...]</code> before official production filing.
              </div>

              <h3 style={{ color: '#2D3A29', fontSize: '1.1rem', marginBottom: '0.5rem' }}>1. Introduction & Data Controller</h3>
              <p>
                LICHT LUXE NATURALS (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects your privacy and is committed to protecting your personal data in accordance with the <strong>UK General Data Protection Regulation (UK GDPR)</strong> and the <strong>Data Protection Act 2018</strong>.
              </p>
              <p>
                <strong>Data Controller:</strong><br />
                LICHT LUXE NATURALS<br />
                <em>[BUSINESS DETAILS NEEDED: Registered Company Name, Company Number, Registered UK Address, and Data Protection Officer Contact Email]</em><br />
                Contact: <a href="mailto:info@lichtluxenaturals.org" style={{ color: '#6E5535' }}>info@lichtluxenaturals.org</a> · Tel: 07831082965
              </p>

              <h3 style={{ color: '#2D3A29', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Information We Collect</h3>
              <ul>
                <li><strong>Identity Data:</strong> Full name, title.</li>
                <li><strong>Contact Data:</strong> Delivery address, billing address, email address, telephone numbers.</li>
                <li><strong>Financial Data:</strong> Processed directly via accredited payment institutions (PayPal, Espees). We never store raw payment card credentials on our servers.</li>
                <li><strong>Transaction Data:</strong> Details of botanical skincare products purchased, order reference, tracking numbers, and delivery methods.</li>
                <li><strong>Technical & Account Data:</strong> IP address, browser type, login credentials, and session authentication tokens.</li>
              </ul>

              <h3 style={{ color: '#2D3A29', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. Legal Basis for Processing</h3>
              <p>
                Under UK GDPR Article 6, we process your personal data under the following legal bases:
              </p>
              <ul>
                <li><strong>Contractual Necessity:</strong> To fulfill purchases, process orders, and dispatch parcels to your UK address.</li>
                <li><strong>Legal Obligation:</strong> To maintain VAT, HMRC accounting records, and regulatory product safety logs.</li>
                <li><strong>Legitimate Interests:</strong> To improve our boutique formulations, prevent fraudulent checkout abuse, and provide customer support.</li>
                <li><strong>Consent:</strong> Where you voluntarily opt into receiving promotional beauty letters.</li>
              </ul>

              <h3 style={{ color: '#2D3A29', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>4. Data Sharing & Third Parties</h3>
              <p>
                We do not sell your personal data. We share necessary data only with trusted fulfillment and payment partners:
              </p>
              <ul>
                <li><strong>Royal Mail:</strong> For delivery dispatch, tracking generation, and postal fulfillment.</li>
                <li><strong>PayPal (Europe) S.à r.l. et Cie, S.C.A.:</strong> For secure electronic payment processing.</li>
                <li><strong>Espees Global:</strong> For Loveworld digital currency checkout settlements.</li>
              </ul>

              <h3 style={{ color: '#2D3A29', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>5. Your Statutory Rights</h3>
              <p>
                Under the UK GDPR, you have the right to request access, rectification, erasure (&ldquo;right to be forgotten&rdquo;), restriction of processing, and data portability. To exercise any of these rights, email us at <a href="mailto:info@lichtluxenaturals.org" style={{ color: '#6E5535' }}>info@lichtluxenaturals.org</a>. You also have the right to lodge a complaint with the UK Information Commissioner&rsquo;s Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noreferrer" style={{ color: '#6E5535' }}>ico.org.uk</a>.
              </p>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div>
              <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.825rem', color: '#92400E' }}>
                <strong>Business Details Notice:</strong> Please fill in registered UK business details where indicated in brackets <code style={{ backgroundColor: '#FDE68A', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>[BUSINESS DETAILS NEEDED: ...]</code> before final publication.
              </div>

              <h3 style={{ color: '#2D3A29', fontSize: '1.1rem', marginBottom: '0.5rem' }}>1. Agreement to Terms</h3>
              <p>
                These Terms of Service govern your purchase of natural skincare products from LICHT LUXE NATURALS via <strong>https://lichtluxenaturals.org/</strong>. By placing an order, you agree to be bound by these Terms and the laws of England and Wales.
              </p>
              <p>
                <em>[BUSINESS DETAILS NEEDED: Trading entity name, registered office address in England/Wales, VAT Registration Number (if applicable)]</em>
              </p>

              <h3 style={{ color: '#2D3A29', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Pricing & Currency</h3>
              <p>
                All prices are stated and charged in <strong>Pounds Sterling (£ GBP)</strong>. Pricing includes applicable UK taxes. Delivery charges (£6.99 standard or Free for orders £70.00 and above; £10.99 express) are clearly displayed before final payment confirmation.
              </p>

              <h3 style={{ color: '#2D3A29', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. Order Formation & Payment Verification</h3>
              <p>
                An order is only formed when our backend server verifies payment completion with our authorized payment processor (PayPal or Espees) and issues a confirmed Order Number (e.g., <code>LLN-XXXXXX</code>). We reserve the right to cancel orders in cases of pricing discrepancies, technical errors, or suspected unauthorized payment tampering.
              </p>

              <h3 style={{ color: '#2D3A29', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>4. Botanical Formulations & Product Safety</h3>
              <p>
                Our natural skincare items (Pure Shea Butter, Cold Pressed Coconut Oil, Luxe Body Butter, African Black Soap) are crafted from pure unrefined botanicals. Because our ingredients are natural and raw, slight variations in aroma, texture, and color may occur between harvest batches. Always perform a patch test prior to full application.
              </p>

              <h3 style={{ color: '#2D3A29', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>5. Consumer Rights & Statutory Cancellation</h3>
              <p>
                Under the UK Consumer Contracts Regulations 2013, you have the right to cancel your purchase within 14 days of delivery. However, for hygiene and health protection reasons, <strong>cosmetic and skincare products cannot be returned once unsealed or opened</strong>.
              </p>
            </div>
          )}

          {/* TAB 3: SHIPPING & RETURNS */}
          {activeTab === 'shipping' && (
            <div>
              <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.825rem', color: '#92400E' }}>
                <strong>Warehouse Details Notice:</strong> Please fill in physical returns dispatch warehouse address where indicated in brackets <code style={{ backgroundColor: '#FDE68A', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>[BUSINESS DETAILS NEEDED: Returns Hub Address]</code>.
              </div>

              <h3 style={{ color: '#2D3A29', fontSize: '1.1rem', marginBottom: '0.5rem' }}>1. United Kingdom Shipping & Rates</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FAF7F2', textAlign: 'left', borderBottom: '1px solid #E5DFC5' }}>
                    <th style={{ padding: '0.65rem' }}>Delivery Tier</th>
                    <th style={{ padding: '0.65rem' }}>Courier & Service</th>
                    <th style={{ padding: '0.65rem' }}>Estimated Time</th>
                    <th style={{ padding: '0.65rem' }}>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '0.65rem', fontWeight: 600 }}>Standard Delivery</td>
                    <td style={{ padding: '0.65rem' }}>Royal Mail Tracked 48</td>
                    <td style={{ padding: '0.65rem' }}>2–4 business days</td>
                    <td style={{ padding: '0.65rem' }}>£6.99 (<strong>FREE over £70.00</strong>)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '0.65rem', fontWeight: 600 }}>Express Delivery</td>
                    <td style={{ padding: '0.65rem' }}>Royal Mail Special Delivery Guaranteed</td>
                    <td style={{ padding: '0.65rem' }}>1–2 business days</td>
                    <td style={{ padding: '0.65rem' }}>£10.99</td>
                  </tr>
                </tbody>
              </table>

              <h3 style={{ color: '#2D3A29', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Dispatch & Tracking</h3>
              <p>
                Orders placed before 2:00 PM GMT Monday through Friday are prepared and dispatched same or next business day. Every parcel receives an authentic Royal Mail tracking code (e.g. <code>RMXXXXXXXXXGB</code>) emailed directly upon fulfillment.
              </p>

              <h3 style={{ color: '#2D3A29', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. 14-Day Returns & Hygiene Notice</h3>
              <p>
                We accept returns of brand new, unopened, and sealed skincare items within 14 calendar days of delivery.
              </p>
              <div style={{ backgroundColor: '#FDF2F2', border: '1px solid #FCA5A5', padding: '0.85rem 1rem', borderRadius: '6px', color: '#991B1B', margin: '0.75rem 0' }}>
                <strong>Hygiene & Safety Protection:</strong> Due to health and hygiene standards, items with broken safety seals, opened jars, or used pumps are strictly non-returnable unless defective.
              </div>

              <h3 style={{ color: '#2D3A29', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>4. How to Initiate a Return</h3>
              <ol>
                <li>Email <a href="mailto:info@lichtluxenaturals.org" style={{ color: '#6E5535' }}>info@lichtluxenaturals.org</a> quoting your Order Number (<code>LLN-XXXXXX</code>) and reason for return.</li>
                <li>Pack the sealed items securely in original packaging.</li>
                <li>Send parcel to:
                  <div style={{ marginTop: '0.35rem', fontStyle: 'italic', color: '#4B5563' }}>
                    LICHT LUXE NATURALS — Returns Department<br />
                    <em>[BUSINESS DETAILS NEEDED: UK Warehouse Address, Postal Code]</em>
                  </div>
                </li>
                <li>Refunds are issued to the original payment method within 5–7 working days after inspection.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid #E5DFC5',
          backgroundColor: '#FAF7F2',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
            LICHT LUXE NATURALS · Made in LOVEWORLD · UK Storefront
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '0.55rem 1.25rem',
              backgroundColor: '#2D3A29',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

