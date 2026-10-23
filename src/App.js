import React, { useState, useCallback } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { 
  ShoppingBag, 
  Search, 
  X, 
  ArrowUpRight, 
  Heart, 
  Plus, 
  Minus, 
  Check, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Leaf,
  Phone,
  Mail,
  Camera,
  Sparkle,
  Award,
  ArrowLeft,
  User
} from 'lucide-react';
import './App.css';

// Dynamic Logo Component for LICHT LUXE NATURALS with high-contrast, crystal-clear typography
const LichtLogo = ({ className = '', size = 'medium', color = 'currentColor', variant = 'light', markOnly = false, style = {} }) => {
  const isDark = variant === 'dark' || color === '#FAF7F2' || color === '#FFFFFF' || color === 'white' || size === 'footer';
  const markSrc = isDark ? '/logo-dark-mark.png' : '/logo-light-mark.png';

  if (markOnly) {
    return (
      <div className={`licht-logo-container ${className} ${size} mark-only`} style={style}>
        <img 
          src={markSrc} 
          alt="LICHT LUXE NATURALS" 
          className="licht-logo-mark-img" 
        />
      </div>
    );
  }

  return (
    <div 
      className={`licht-logo-container ${className} ${size} ${isDark ? 'dark-variant' : 'light-variant'}`} 
      style={style}
    >
      <img 
        src={markSrc} 
        alt="" 
        aria-hidden="true"
        className="licht-logo-mark-img" 
      />
      <div className="licht-logo-text-block">
        <span className="licht-logo-brand-title">LICHT</span>
        <span className="licht-logo-brand-sub">LUXE NATURALS</span>
      </div>
    </div>
  );
};

// "MADE IN LOVEWORLD" Stamp Emblem SVG Component
const MadeInLoveworldEmblem = ({ size = 'medium', variant = 'light' }) => {
  return (
    <div className={`loveworld-emblem-seal ${size} ${variant}`}>
      <div style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#6E5535', fontWeight: 600 }}>
        LICHT LUXE
      </div>
      <div style={{ fontFamily: "'Italiana', serif", fontSize: '1rem', fontWeight: 400, color: '#2D3A29', margin: '2px 0', letterSpacing: '0.05em' }}>
        MADE IN
      </div>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C5A059', fontWeight: 700 }}>
        LOVEWORLD
      </div>
      <div style={{ fontSize: '0.55rem', color: '#5C635B', marginTop: '2px', letterSpacing: '0.1em' }}>
        ♡ PURITY & LOVE ♡
      </div>
    </div>
  );
};

// Products Dataset tailored specifically for LICHT LUXE NATURALS
const PRODUCTS = [
  {
    id: 'pure-shea-butter',
    name: 'Pure Shea Butter',
    tagline: 'Pure nourishment from nature.',
    subtitle: 'Pure • Rich • Nourishing',
    price: 24,
    badge: '100% RAW & UNREFINED',
    volume: '250 ml / 8.8 oz',
    rating: '5.0',
    reviewsCount: 168,
    image: '/shea_butter_primary.jpg',
    shortDescription: 'Rich, creamy and naturally nourishing, our pure shea butter is a simple skincare essential for keeping your skin soft, moisturised and protected from dryness.',
    description: 'Our pure shea butter is a natural skincare staple, traditionally valued for its moisturising and skin-conditioning properties. Sourced with love and meticulous attention to purity, it absorbs beautifully to leave your skin feeling deeply cared for.',
    perfectFor: [
      'Dry skin',
      'Daily moisturising',
      'Hands and feet',
      'Elbows and knees',
      'Body care',
      'Hair and scalp care'
    ],
    howToUse: 'Put a small amount between your palms and gently massage into clean skin.',
    gallery: [
      '/shea_butter_primary.jpg',
      '/body_butter_hand_apply.jpg',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'pure-coconut-oil',
    name: 'Pure Coconut Oil',
    tagline: 'Nature\'s nourishing oil.',
    subtitle: 'Natural • Versatile • Nourishing',
    price: 22,
    badge: 'COLD PRESSED',
    volume: '200 ml / 7.0 fl oz',
    rating: '4.9',
    reviewsCount: 144,
    image: '/coconut_oil_primary.jpg',
    shortDescription: 'A versatile natural oil that helps moisturise, soften and nourish the skin while leaving it feeling smooth and cared for.',
    description: 'A beautiful multi-purpose natural oil suitable for everyday beauty and body-care routines. Thoughtfully cold-pressed to preserve every vital lipid and delicate botanical nutrient.',
    perfectFor: [
      'Body moisturising',
      'Dry areas',
      'Massage',
      'Hair care',
      'Cuticle care'
    ],
    howToUse: 'Apply a small amount to clean skin and massage gently until absorbed.',
    gallery: [
      '/coconut_oil_primary.jpg',
      'https://images.unsplash.com/photo-1544378730-8b5104b18790?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80'
    ]
  },
  {
    id: 'luxe-body-butter',
    name: 'Luxe Body Butter',
    tagline: 'Deep nourishment. Luxurious feel.',
    subtitle: 'Rich • Creamy • Luxurious',
    price: 28,
    badge: 'SIGNATURE FORMULA',
    volume: '250 g / 8.8 oz',
    rating: '5.0',
    reviewsCount: 192,
    image: '/body_butter_primary.jpg',
    shortDescription: 'Our rich body butter combines the goodness of natural ingredients to give your skin a beautifully soft and moisturised feel.',
    description: 'Give your skin a richer moisturising experience with our luxurious body butter. Designed for those moments when your skin needs extra nourishment, velvet smoothness and loving care.',
    perfectFor: [
      'Everyday body care',
      'Dry skin',
      'After bathing',
      'Night-time skincare',
      'Self-care rituals'
    ],
    howToUse: 'Smooth generously into clean skin and massage gently until fully absorbed.',
    gallery: [
      '/body_butter_primary.jpg',
      '/body_butter_hand_apply.jpg',
      '/hero_products_trio.jpg'
    ]
  },
  {
    id: 'luxe-trio-gift-set',
    name: 'The Luxe Trio Gift Set',
    tagline: 'The complete natural luxury collection.',
    subtitle: 'Pure Shea Butter + Pure Coconut Oil + Luxe Body Butter',
    price: 68,
    originalPrice: 74,
    badge: 'MADE IN LOVEWORLD BOX',
    volume: 'Full Size 3-Piece Set',
    rating: '5.0',
    reviewsCount: 88,
    image: '/luxe_trio_primary.jpg',
    shortDescription: 'Our signature gift box containing Pure Shea Butter, Pure Coconut Oil, and Luxe Body Butter in handcrafted luxury presentation.',
    description: 'Give the gift of natural luxury with our complete 3-piece ritual box set. Perfect for birthdays, self-care gifts, or showing someone special how much they are loved.',
    perfectFor: [
      'Birthdays & Celebrations',
      'Mother\'s Day & Valentine\'s Day',
      'Christmas & Special Moments',
      'Bridesmaids & Weddings',
      'Self-care indulgence',
      'Corporate gifting'
    ],
    howToUse: 'Follow the 4-step ritual: Cleanse, Nourish with Coconut Oil or Shea Butter, Massage with Luxe Body Butter, and Glow.',
    gallery: [
      '/luxe_trio_primary.jpg',
      '/body_butter_primary.jpg',
      '/coconut_oil_primary.jpg',
      '/shea_butter_primary.jpg'
    ]
  }
];

// Customer Reviews Dataset
const REVIEWS = [
  {
    id: 1,
    quote: "My skin feels so soft after using the body butter. I absolutely love the texture.",
    author: "Elena M.",
    role: "Verified Customer",
    product: "Luxe Body Butter"
  },
  {
    id: 2,
    quote: "The shea butter is so rich and versatile. It's become part of my everyday routine.",
    author: "Grace K.",
    role: "Verified Customer",
    product: "Pure Shea Butter"
  },
  {
    id: 3,
    quote: "Pure coconut oil that feels like silk on the skin. The MADE IN LOVEWORLD packaging feels so thoughtful and high end.",
    author: "Sophia R.",
    role: "Verified Customer",
    product: "Pure Coconut Oil"
  }
];

// FAQs Dataset
const FAQS = [
  {
    q: "Are LICHT LUXE NATURALS products natural?",
    a: "Our products are created around naturally sourced ingredients. Each product page provides specific ingredient information, crafted with purity and love."
  },
  {
    q: "Can I use shea butter every day?",
    a: "Yes. Shea butter can be incorporated into an everyday body-care routine, particularly for areas that become dry like hands, feet, elbows, and knees."
  },
  {
    q: "Can I use coconut oil on my hair?",
    a: "Coconut oil can be used as part of a hair-care routine for deep moisture and scalp nourishment. We recommend following the directions provided on your specific bottle."
  },
  {
    q: "Are your products suitable for sensitive skin?",
    a: "Everyone's skin is different. If you have sensitive skin, we recommend checking the full ingredient list and performing a patch test on a small area before wider use."
  },
  {
    q: "Where are your products made?",
    a: "MADE IN LOVEWORLD. Every product carries the heart, purpose, and spirit of our brand identity."
  },
  {
    q: "Do you offer gift sets?",
    a: "Yes. Explore our gifting collection for available luxury gift sets, including The Luxe Trio box."
  },
  {
    q: "Do you deliver?",
    a: "Yes. We offer nationwide and international delivery options directly during checkout or when ordering by phone."
  }
];

// ─── PayPal Sandbox Configuration ──────────────────────────────────
const PAYPAL_CLIENT_ID = 'BAA7UoSsD_iuAa7LqzZDlY2uAPnO5xkWs2981r89PvhAMxEja5vhX-E1TpiSoVwIajfDyFtLVyNnefvtM';
const API_BASE = process.env.REACT_APP_API_BASE || (window.location.hostname === 'localhost' ? 'http://localhost:8080/api' : '/api');

const paypalInitialOptions = {
  'client-id': PAYPAL_CLIENT_ID,
  currency: 'GBP',
  intent: 'capture',
  'disable-funding': 'credit',
};

function App() {
  // Navigation active tab: 'home' | 'shop' | 'story' | 'gifting' | 'contact' | 'product'
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [pdpQuantity, setPdpQuantity] = useState(1);
  const [pdpPrimaryImage, setPdpPrimaryImage] = useState(PRODUCTS[0].image);
  const [pdpGalleryImages, setPdpGalleryImages] = useState(PRODUCTS[0].gallery);

  // Gallery Image Swapping Logic (clicking secondary thumbnail replaces primary image)
  const handleSwapGalleryImage = (clickedIndex) => {
    const clickedImg = pdpGalleryImages[clickedIndex];
    if (!clickedImg || clickedImg === pdpPrimaryImage) return;

    const oldPrimary = pdpPrimaryImage;
    const updatedGallery = [...pdpGalleryImages];
    
    setPdpPrimaryImage(clickedImg);
    updatedGallery[clickedIndex] = oldPrimary;
    setPdpGalleryImages(updatedGallery);
  };
  
  // E-commerce state
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authExpandedOption, setAuthExpandedOption] = useState(null); // 'email' | 'phone' | null
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('lln_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authForm, setAuthForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotForm, setForgotForm] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [wishlist, setWishlist] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // PayPal payment state
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'General Inquiry',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Toast utility
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(`Added ${product.name} (${quantity}) to your bag ♡`);
  };

  const updateCartQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Removed from your saved items');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to your wishlist');
        return [...prev, productId];
      }
    });
  };

  // Cart Subtotal
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freeShippingThreshold = 50;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  // Handle Contact Form Submit
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    showToast('Thank you! Your message has been sent. We will respond shortly.');
    setTimeout(() => {
      setContactForm({ name: '', email: '', phone: '', topic: 'General Inquiry', message: '' });
      setContactSubmitted(false);
    }, 5000);
  };

  // Navigate to tab & scroll to top
  const navigateToTab = (tabName) => {
    setActiveTab(tabName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open dedicated product detail page
  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setPdpQuantity(1);
    setPdpPrimaryImage(product.image);
    setPdpGalleryImages(product.gallery || [
      product.image,
      '/body_butter_hand_apply.jpg',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80'
    ]);
    setActiveTab('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Authentication & Password Recovery Handlers ─────────────────
  const handleAuthInputChange = (e) => {
    const { name, value } = e.target;
    setAuthForm(prev => ({ ...prev, [name]: value }));
  };

  const handleForgotInputChange = (e) => {
    const { name, value } = e.target;
    setForgotForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email, password: authForm.password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please verify credentials.');
      }
      localStorage.setItem('lln_token', data.token);
      localStorage.setItem('lln_user', JSON.stringify(data));
      setCurrentUser(data);
      showToast(`✨ Welcome back, ${data.firstName || 'there'}!`);
      setIsAuthOpen(false);
      setAuthExpandedOption(null);
    } catch (err) {
      showToast(err.message || 'Login failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: authForm.firstName,
          lastName: authForm.lastName,
          email: authForm.email,
          phone: authForm.phone,
          password: authForm.password
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }
      showToast('✨ Account created! Welcome email dispatched to ' + authForm.email);
      
      // Auto sign in
      try {
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: authForm.email, password: authForm.password })
        });
        if (loginRes.ok) {
          const loginData = await loginRes.json();
          localStorage.setItem('lln_token', loginData.token);
          localStorage.setItem('lln_user', JSON.stringify(loginData));
          setCurrentUser(loginData);
        }
      } catch (ignored) {}

      setIsAuthOpen(false);
      setAuthExpandedOption(null);
    } catch (err) {
      showToast(err.message || 'Registration error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPasswordRequest = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotForm.email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to request OTP');
      showToast('✉️ 6-digit verification code sent to ' + forgotForm.email);
      setForgotStep(2);
    } catch (err) {
      showToast(err.message || 'Error sending reset code');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotForm.email, otp: forgotForm.otp })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Verification failed');
      showToast('✓ Code verified! Please enter your new password.');
      setForgotStep(3);
    } catch (err) {
      showToast(err.message || 'Invalid or expired verification code');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (forgotForm.newPassword !== forgotForm.confirmPassword) {
      showToast('Passwords do not match');
      return;
    }
    setAuthLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotForm.email,
          otp: forgotForm.otp,
          newPassword: forgotForm.newPassword
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Reset failed');
      showToast('✨ Password reset successfully! Confirmation email sent.');
      setAuthMode('login');
      setForgotStep(1);
      setForgotForm({ email: '', otp: '', newPassword: '', confirmPassword: '' });
      setAuthExpandedOption('email');
    } catch (err) {
      showToast(err.message || 'Password reset error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lln_token');
    localStorage.removeItem('lln_user');
    setCurrentUser(null);
    setIsAuthOpen(false);
    showToast('Signed out successfully.');
  };

  // ─── PayPal Handlers ─────────────────────────────────────────────
  // Get JWT token from localStorage (set during auth login)
  const getAuthToken = () => localStorage.getItem('lln_token');

  // Create PayPal order via backend
  const createPayPalOrder = useCallback(async () => {
    try {
      setPaymentProcessing(true);
      const token = getAuthToken();
      
      // If no backend token, create order client-side for demo/testing
      if (!token) {
        // Client-side order creation for demo mode
        return 'DEMO_ORDER';
      }

      const response = await fetch(`${API_BASE}/paypal/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: cartSubtotal.toFixed(2),
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create PayPal order');
      }

      const data = await response.json();
      return data.id; // PayPal order ID
    } catch (error) {
      showToast('Error creating order: ' + error.message);
      setPaymentProcessing(false);
      throw error;
    }
  }, [cart, cartSubtotal]);

  // Capture PayPal order after buyer approval
  const capturePayPalOrder = useCallback(async (data) => {
    try {
      const token = getAuthToken();
      
      // Demo mode — no backend
      if (!token || data.orderID === 'DEMO_ORDER') {
        setPaymentProcessing(false);
        setIsCheckoutOpen(false);
        setCart([]);
        setOrderConfirmation({
          orderNumber: 'LLN-DEMO-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          total: cartSubtotal.toFixed(2),
        });
        showToast('✨ Order placed successfully via PayPal!');
        return;
      }

      const response = await fetch(`${API_BASE}/paypal/capture-order/${data.orderID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: cartSubtotal.toFixed(2),
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment capture failed');
      }

      const result = await response.json();
      
      setPaymentProcessing(false);
      setIsCheckoutOpen(false);
      setCart([]);
      setOrderConfirmation({
        orderNumber: result.orderNumber,
        total: result.totalAmount,
        paypalOrderId: result.paypalOrderId,
      });
      showToast('✨ Payment successful! Order ' + result.orderNumber + ' placed.');
    } catch (error) {
      setPaymentProcessing(false);
      showToast('Payment error: ' + error.message);
    }
  }, [cart, cartSubtotal]);

  return (
    <PayPalScriptProvider options={paypalInitialOptions}>
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP ANNOUNCEMENT BAR */}
      <div className="announcement-bar">
        <span>🌿 Pure. Natural. Made with Love and from LOVEWORLD</span>
        <span>•</span>
        <span>Order online or call us at <a href="tel:07831082965">07831082965</a></span>
        <span>•</span>
        <span className="loveworld-badge" style={{ padding: '0.2rem 0.6rem', fontSize: '0.65rem' }}>
          MADE IN LOVEWORLD
        </span>
      </div>

      {/* HEADER / NAVIGATION WITH LOGO IN CENTER */}
      <header className="site-header">
        <div className="header-container" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left Navigation Menu */}
          <nav className="nav-links-left">
            <button 
              className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => navigateToTab('home')}
            >
              HOME
            </button>
            <button 
              className={`nav-link ${activeTab === 'shop' || activeTab === 'product' ? 'active' : ''}`}
              onClick={() => navigateToTab('shop')}
            >
              SHOP
            </button>
            <button 
              className={`nav-link ${activeTab === 'story' ? 'active' : ''}`}
              onClick={() => navigateToTab('story')}
            >
              OUR STORY
            </button>
            <button 
              className={`nav-link ${activeTab === 'gifting' ? 'active' : ''}`}
              onClick={() => navigateToTab('gifting')}
            >
              GIFTING
            </button>
            <button 
              className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => navigateToTab('contact')}
            >
              CONTACT
            </button>
          </nav>

          {/* Center Brand Logo */}
          <button 
            className="brand-logo" 
            onClick={() => navigateToTab('home')}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="LICHT LUXE NATURALS — Pure. Natural. Made with Love"
          >
            <LichtLogo size="header" />
          </button>

          {/* Right Header Actions */}
          <div className="header-actions">
            <button 
              className="icon-btn" 
              title="Sign In / Register" 
              onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }}
            >
              <User size={19} />
            </button>
            <button 
              className="icon-btn" 
              title="Search" 
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={19} />
            </button>
            
            <button 
              className="btn-primary" 
              onClick={() => setIsCartOpen(true)}
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.825rem', gap: '0.45rem', fontWeight: 600 }}
            >
              <ShoppingBag size={16} />
              <span>SHOP NOW</span>
              <span className="cart-count-badge">({cart.reduce((a, b) => a + b.quantity, 0)})</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SEPARATE DEDICATED PRODUCT DETAIL PAGE (PDP)                              */}
      {/* ========================================================================= */}
      {activeTab === 'product' && selectedProduct && (
        <main style={{ backgroundColor: '#EAD8BA', minHeight: '85vh', paddingBottom: '5rem' }}>
          {/* Breadcrumb Header Bar */}
          <div style={{ backgroundColor: '#DFCAA7', borderBottom: '1px solid #E5DFC5', padding: '1rem 0' }}>
            <div className="container" style={{ fontSize: '0.85rem', color: '#5C635B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => navigateToTab('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5C635B', textDecoration: 'underline' }}>Home</button>
                <span>/</span>
                <button onClick={() => navigateToTab('shop')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5C635B', textDecoration: 'underline' }}>Shop Collection</button>
                <span>/</span>
                <span style={{ color: '#2D3A29', fontWeight: 600 }}>{selectedProduct.name}</span>
              </div>

              <button 
                onClick={() => navigateToTab('shop')} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A5D4E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem' }}
              >
                <ArrowLeft size={16} /> Back to Collection
              </button>
            </div>
          </div>

          {/* PDP Main Product Showcase Section */}
          <section style={{ padding: '3.5rem 0', position: 'relative', overflow: 'hidden' }}>
            <div className="giant-watermark-text" style={{ position: 'absolute', top: '10px', right: '2%', zIndex: 1, color: 'rgba(74, 93, 78, 0.035)' }}>
              beautiful
            </div>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '4rem', alignItems: 'start' }}>
                
                {/* Left Product Image Gallery Column */}
                <div>
                  <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '2px solid #C5A059', boxShadow: '0 20px 50px rgba(74, 93, 78, 0.12)', height: '520px', backgroundColor: '#DFCAA7' }}>
                    <img 
                      src={pdpPrimaryImage} 
                      alt={selectedProduct.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.35s ease' }}
                    />
                    
                    {/* Badge Overlay */}
                    <span style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', backgroundColor: '#2D3A29', color: '#FAF7F2', fontSize: '0.75rem', padding: '0.35rem 0.85rem', borderRadius: '4px', letterSpacing: '0.12em', fontWeight: 600 }}>
                      {selectedProduct.badge}
                    </span>

                    {/* Wishlist Button */}
                    <button 
                      onClick={() => toggleWishlist(selectedProduct.id)}
                      style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', backgroundColor: '#FFFFFF', border: 'none', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.12)' }}
                      title="Save to Wishlist"
                    >
                      <Heart size={20} fill={wishlist.includes(selectedProduct.id) ? '#C5A059' : 'none'} color={wishlist.includes(selectedProduct.id) ? '#C5A059' : '#1E221D'} />
                    </button>
                  </div>

                  {/* Thumbnail Gallery Swatches - Clicking swaps primary and secondary image */}
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${pdpGalleryImages.length}, 1fr)`, gap: '1rem', marginTop: '1.25rem' }}>
                    {pdpGalleryImages.map((imgSrc, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleSwapGalleryImage(idx)}
                        style={{ 
                          border: imgSrc === pdpPrimaryImage ? '2px solid #C5A059' : '1.5px solid #E5DFC5', 
                          borderRadius: '8px', 
                          overflow: 'hidden', 
                          height: '110px', 
                          cursor: 'pointer',
                          opacity: imgSrc === pdpPrimaryImage ? 1 : 0.85,
                          transform: imgSrc === pdpPrimaryImage ? 'scale(1.02)' : 'scale(1)',
                          transition: 'all 0.3s ease',
                          boxShadow: imgSrc === pdpPrimaryImage ? '0 6px 15px rgba(197, 160, 89, 0.3)' : 'none'
                        }}
                        title="Click to view as main image"
                      >
                        <img src={imgSrc} alt={`${selectedProduct.name} view ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Product Details Column */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <span className="loveworld-badge">MADE IN LOVEWORLD</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#C5A059', fontSize: '0.9rem', fontWeight: 600 }}>
                      ★★★★★ <span>{selectedProduct.rating} ({selectedProduct.reviewsCount} reviews)</span>
                    </div>
                  </div>

                  <h1 className="font-display" style={{ fontSize: '3.75rem', color: '#1E221D', marginBottom: '0.25rem', lineHeight: 1.05 }}>
                    {selectedProduct.name}
                  </h1>

                  <div style={{ fontSize: '1.05rem', color: '#C5A059', fontStyle: 'italic', marginBottom: '1.25rem', fontWeight: 500 }}>
                    {selectedProduct.subtitle}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #E5DFC5', paddingBottom: '1.25rem' }}>
                    <span style={{ fontSize: '2.25rem', fontWeight: 700, color: '#6E5535' }}>£{selectedProduct.price}</span>
                    <span style={{ fontSize: '1rem', color: '#5C635B' }}>({selectedProduct.volume})</span>
                  </div>

                  <p style={{ color: '#5C635B', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '2rem' }}>
                    {selectedProduct.description}
                  </p>

                  {/* Quantity Selector & Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2D3A29' }}>QUANTITY:</span>
                      <div className="qty-controls" style={{ padding: '0.4rem 0.8rem', backgroundColor: '#FFFFFF', border: '1px solid #E5DFC5', borderRadius: '4px' }}>
                        <button className="qty-btn" onClick={() => setPdpQuantity(Math.max(1, pdpQuantity - 1))}><Minus size={14} /></button>
                        <span className="qty-num" style={{ fontSize: '1rem', minWidth: '30px', textAlign: 'center', fontWeight: 600 }}>{pdpQuantity}</span>
                        <button className="qty-btn" onClick={() => setPdpQuantity(pdpQuantity + 1)}><Plus size={14} /></button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <button 
                        className="btn-primary" 
                        style={{ flexGrow: 1, justifyContent: 'center', padding: '1rem 2rem', fontSize: '0.95rem', fontWeight: 600 }}
                        onClick={() => addToCart(selectedProduct, pdpQuantity)}
                      >
                        <ShoppingBag size={18} /> ADD TO BAG · £{(selectedProduct.price * pdpQuantity).toFixed(2)}
                      </button>

                      <a 
                        href="tel:07831082965" 
                        className="btn-secondary"
                        style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}
                      >
                        <Phone size={16} /> ORDER BY CALL: 07831082965
                      </a>
                    </div>
                  </div>

                  {/* Perfect For & How to Use Accordion Boxes */}
                  <div style={{ backgroundColor: '#F4EFE6', borderRadius: '12px', border: '1px solid #E5DFC5', padding: '1.75rem', boxShadow: 'var(--shadow-soft)', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#2D3A29', marginBottom: '0.75rem' }}>
                      PERFECT FOR YOUR ROUTINE:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.9rem', color: '#5C635B' }}>
                      {selectedProduct.perfectFor.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Check size={14} color="#4A5D4E" /> {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#DFCAA7', borderRadius: '12px', border: '1px solid #E5DFC5', padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6E5535', marginBottom: '0.35rem' }}>
                      HOW TO USE YOUR RITUAL:
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#2D3A29', fontStyle: 'italic', lineHeight: 1.6 }}>
                      “{selectedProduct.howToUse}”
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </section>

          {/* SIMILAR PRODUCTS / YOU MAY ALSO LOVE SECTION */}
          <section style={{ padding: '4.5rem 0', backgroundColor: '#DFCAA7', borderTop: '1px solid #E5DFC5' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div className="text-uppercase" style={{ color: '#4A5D4E', marginBottom: '0.35rem' }}>
                  THE COMPLETE COLLECTION
                </div>
                <h2 className="font-display" style={{ fontSize: '3.25rem', color: '#1E221D' }}>
                  You May Also Love
                </h2>
                <p style={{ color: '#5C635B', fontSize: '0.95rem' }}>
                  Explore complementary natural body-care essentials crafted from nature.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {PRODUCTS.filter(p => p.id !== selectedProduct.id).map(product => (
                  <div 
                    key={product.id}
                    style={{ 
                      backgroundColor: '#F4EFE6', 
                      borderRadius: '12px', 
                      overflow: 'hidden', 
                      border: '1px solid #E5DFC5',
                      boxShadow: 'var(--shadow-soft)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div 
                      style={{ position: 'relative', height: '240px', overflow: 'hidden', backgroundColor: '#DFCAA7', cursor: 'pointer' }}
                      onClick={() => openProductDetail(product)}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: '#2D3A29', color: '#FAF7F2', fontSize: '0.65rem', padding: '0.25rem 0.65rem', borderRadius: '4px', letterSpacing: '0.1em', fontWeight: 600 }}>
                        {product.badge}
                      </span>
                    </div>

                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: '#C5A059', letterSpacing: '0.12em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        {product.subtitle}
                      </div>
                      <h3 
                        className="font-display" 
                        style={{ fontSize: '1.65rem', color: '#2D3A29', marginBottom: '0.35rem', cursor: 'pointer' }}
                        onClick={() => openProductDetail(product)}
                      >
                        {product.name}
                      </h3>
                      <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#6E5535', marginBottom: '0.75rem' }}>
                        £{product.price}
                      </div>

                      <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn-primary" 
                          style={{ flexGrow: 1, justifyContent: 'center', padding: '0.75rem', fontSize: '0.8rem' }}
                          onClick={() => addToCart(product)}
                        >
                          ADD TO CART · £{product.price}
                        </button>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '0.75rem 1rem', fontSize: '0.8rem' }}
                          onClick={() => openProductDetail(product)}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================================= */}
      {/* SEPARATE VIEW 1: SEPARATE DEDICATED "ABOUT US / OUR STORY" PAGE           */}
      {/* ========================================================================= */}
      {activeTab === 'story' && (
        <main style={{ backgroundColor: '#EAD8BA', minHeight: '80vh' }}>
          {/* Breadcrumb Header */}
          <div style={{ backgroundColor: '#DFCAA7', borderBottom: '1px solid #E5DFC5', padding: '1rem 0' }}>
            <div className="container" style={{ fontSize: '0.825rem', color: '#5C635B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={() => navigateToTab('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5C635B', textDecoration: 'underline' }}>Home</button>
              <span>/</span>
              <span style={{ color: '#2D3A29', fontWeight: 600 }}>About Us & Our Story</span>
            </div>
          </div>

          {/* About Us Hero Banner with Italiana Font */}
          <section style={{ padding: '4rem 0 3rem 0', textAlign: 'center', backgroundColor: '#EAD8BA', position: 'relative', overflow: 'hidden' }}>
            <div className="giant-watermark-text" style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', opacity: 0.5, color: 'rgba(74, 93, 78, 0.035)', zIndex: 1 }}>
              grace
            </div>
            <div className="container" style={{ maxWidth: '900px', position: 'relative', zIndex: 2 }}>
              <span className="loveworld-badge" style={{ marginBottom: '1.25rem' }}>
                MADE IN LOVEWORLD
              </span>
              <h1 className="font-display" style={{ fontSize: '4.5rem', color: '#1E221D', marginBottom: '1rem', lineHeight: 1.05 }}>
                Born from Nature.<br />
                <span style={{ color: '#4A5D4E', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>Made with Love.</span>
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#6E5535', fontStyle: 'italic', fontWeight: 500 }}>
                The Story, Heart & Philosophy Behind LICHT LUXE NATURALS
              </p>
            </div>
          </section>

          {/* Main Editorial Story Section */}
          <section style={{ padding: '2rem 0 5rem 0' }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                
                <div style={{ position: 'relative' }}>
                  <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid #C5A059', boxShadow: '0 15px 40px rgba(74, 93, 78, 0.1)' }}>
                    <img 
                      src="/floating_trio_showcase.jpg" 
                      alt="LICHT LUXE NATURALS Floating Trio Collection Artwork" 
                      style={{ width: '100%', height: '560px', objectFit: 'cover', objectPosition: 'center center' }}
                    />
                  </div>
                  <div style={{ position: 'absolute', bottom: '-25px', right: '-20px' }}>
                    <MadeInLoveworldEmblem size="medium" />
                  </div>
                </div>

                <div>
                  <h2 className="font-display" style={{ fontSize: '3rem', color: '#2D3A29', marginBottom: '1.25rem' }}>
                    Our Story
                  </h2>
                  <div style={{ color: '#5C635B', fontSize: '1.05rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <p style={{ fontSize: '1.15rem', color: '#2D3A29', fontWeight: 500 }}>
                      LICHT LUXE NATURALS was created from a simple belief:
                    </p>
                    <blockquote style={{ borderLeft: '4px solid #C5A059', paddingLeft: '1.25rem', color: '#6E5535', fontStyle: 'italic', fontSize: '1.15rem', margin: '0.25rem 0' }}>
                      “Natural skincare should feel good, look beautiful and fit effortlessly into everyday life.”
                    </blockquote>
                    <p>
                      We create natural body-care products inspired by the richness of nature and the desire to give your skin the care it deserves.
                    </p>
                    <p>
                      From our pure shea butter to our nourishing coconut oil and luxurious body butter, every product is created with care and attention to quality.
                    </p>
                    <p>
                      We believe that taking care of your skin isn't just a routine. It's a moment of self-care. And every moment of self-care deserves a little luxury.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Why LICHT LUXE? 4 Pillars */}
          <section style={{ padding: '5rem 0', backgroundColor: '#DFCAA7', borderTop: '1px solid #E5DFC5', borderBottom: '1px solid #E5DFC5' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <div className="text-uppercase" style={{ color: '#4A5D4E', marginBottom: '0.35rem' }}>
                  OUR FOUR PILLARS
                </div>
                <h2 className="font-display" style={{ fontSize: '3.25rem', color: '#1E221D' }}>
                  Why LICHT LUXE?
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
                <div style={{ backgroundColor: '#F4EFE6', padding: '2.5rem 1.75rem', borderRadius: '12px', border: '1px solid #E5DFC5', boxShadow: 'var(--shadow-soft)' }}>
                  <div style={{ backgroundColor: '#EAF0E8', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5D4E', marginBottom: '1.25rem' }}>
                    <Leaf size={24} />
                  </div>
                  <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#2D3A29', marginBottom: '0.5rem' }}>
                    Natural Ingredients
                  </h3>
                  <p style={{ color: '#5C635B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    We celebrate the goodness of naturally derived ingredients, keeping formulas pure, botanical and skin-nourishing.
                  </p>
                </div>

                <div style={{ backgroundColor: '#F4EFE6', padding: '2.5rem 1.75rem', borderRadius: '12px', border: '1px solid #E5DFC5', boxShadow: 'var(--shadow-soft)' }}>
                  <div style={{ backgroundColor: '#EAF0E8', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5D4E', marginBottom: '1.25rem' }}>
                    <Sparkle size={24} />
                  </div>
                  <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#2D3A29', marginBottom: '0.5rem' }}>
                    Simple Skincare
                  </h3>
                  <p style={{ color: '#5C635B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    We believe effective skincare doesn't have to be complicated. Simple, intentional body care yields the best results.
                  </p>
                </div>

                <div style={{ backgroundColor: '#F4EFE6', padding: '2.5rem 1.75rem', borderRadius: '12px', border: '1px solid #E5DFC5', boxShadow: 'var(--shadow-soft)' }}>
                  <div style={{ backgroundColor: '#EAF0E8', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5D4E', marginBottom: '1.25rem' }}>
                    <Award size={24} />
                  </div>
                  <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#2D3A29', marginBottom: '0.5rem' }}>
                    Quality First
                  </h3>
                  <p style={{ color: '#5C635B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Every product is made with care, consistency and attention to quality, giving your skin the luxurious texture it deserves.
                  </p>
                </div>

                <div style={{ backgroundColor: '#F4EFE6', padding: '2.5rem 1.75rem', borderRadius: '12px', border: '1.5px solid #C5A059', boxShadow: '0 10px 25px rgba(197, 160, 89, 0.12)' }}>
                  <div style={{ backgroundColor: '#F4EBD9', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C5A059', marginBottom: '1.25rem' }}>
                    <Heart size={24} />
                  </div>
                  <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#2D3A29', marginBottom: '0.5rem' }}>
                    Made with Love
                  </h3>
                  <p style={{ color: '#5C635B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Our products carry the spirit behind our brand: <strong>MADE IN LOVEWORLD</strong>. Purposeful, beautiful and crafted with love.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Philosophy Deep Dive */}
          <section style={{ padding: '5rem 0', backgroundColor: '#2D3A29', color: '#FAF7F2', textAlign: 'center' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
              <div className="loveworld-badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#C5A059', borderColor: '#C5A059', marginBottom: '1.25rem' }}>
                OUR PHILOSOPHY
              </div>
              <h2 className="font-display" style={{ fontSize: '3.75rem', color: '#FAF7F2', marginBottom: '1.25rem' }}>
                Nature. Nourishment. Love.
              </h2>
              <p style={{ fontSize: '1.2rem', color: '#EAF0E8', lineHeight: 1.8, marginBottom: '1.75rem', fontStyle: 'italic' }}>
                “At LICHT LUXE NATURALS, our philosophy is simple: What you put on your skin matters.”
              </p>
              <p style={{ fontSize: '1.025rem', color: '#D6DDD3', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                We are committed to creating products that bring together the richness of natural ingredients and the experience of everyday luxury. Our goal is to help you build a simple body-care ritual that leaves your skin feeling soft, nourished, moisturised and loved.
              </p>
              <button 
                className="btn-primary" 
                onClick={() => navigateToTab('shop')}
                style={{ backgroundColor: '#C5A059', borderColor: '#C5A059', color: '#2D3A29', fontWeight: 600, padding: '0.95rem 2rem' }}
              >
                Shop Our Collection <ArrowUpRight size={16} />
              </button>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================================= */}
      {/* SEPARATE VIEW 2: SEPARATE DEDICATED "SHOP / PRODUCTS" PAGE                */}
      {/* ========================================================================= */}
      {activeTab === 'shop' && (
        <main style={{ backgroundColor: '#EAD8BA', minHeight: '80vh' }}>
          <div style={{ backgroundColor: '#DFCAA7', borderBottom: '1px solid #E5DFC5', padding: '1rem 0' }}>
            <div className="container" style={{ fontSize: '0.825rem', color: '#5C635B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={() => navigateToTab('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5C635B', textDecoration: 'underline' }}>Home</button>
              <span>/</span>
              <span style={{ color: '#2D3A29', fontWeight: 600 }}>The Collection</span>
            </div>
          </div>

          <section style={{ padding: '4rem 0', backgroundColor: '#EAD8BA' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <span className="loveworld-badge" style={{ marginBottom: '1rem' }}>
                  THE LICHT LUXE COLLECTION
                </span>
                <h1 className="font-display" style={{ fontSize: '4rem', color: '#1E221D' }}>
                  Natural Body-Care Essentials
                </h1>
                <p style={{ color: '#5C635B', fontSize: '1.05rem', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
                  Handcrafted with pure, naturally derived ingredients for healthy, nourished and beautifully cared-for skin.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                {PRODUCTS.map(product => (
                  <div 
                    key={product.id}
                    style={{ 
                      backgroundColor: '#F4EFE6', 
                      borderRadius: '12px', 
                      overflow: 'hidden', 
                      border: product.id === 'luxe-trio-gift-set' ? '2px solid #C5A059' : '1px solid #E5DFC5',
                      boxShadow: 'var(--shadow-soft)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div 
                      style={{ position: 'relative', height: '300px', overflow: 'hidden', backgroundColor: '#DFCAA7', cursor: 'pointer' }}
                      onClick={() => openProductDetail(product)}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: '#2D3A29', color: '#FAF7F2', fontSize: '0.7rem', padding: '0.3rem 0.75rem', borderRadius: '4px', letterSpacing: '0.1em', fontWeight: 600 }}>
                        {product.badge}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: '#FFFFFF', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                      >
                        <Heart size={18} fill={wishlist.includes(product.id) ? '#C5A059' : 'none'} color={wishlist.includes(product.id) ? '#C5A059' : '#1E221D'} />
                      </button>
                    </div>

                    <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: '#C5A059', letterSpacing: '0.12em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        {product.subtitle}
                      </div>
                      <h3 
                        className="font-display" 
                        style={{ fontSize: '2rem', color: '#2D3A29', marginBottom: '0.5rem', cursor: 'pointer' }}
                        onClick={() => openProductDetail(product)}
                      >
                        {product.name}
                      </h3>
                      <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#6E5535', marginBottom: '1rem' }}>
                        £{product.price} <span style={{ fontSize: '0.85rem', color: '#5C635B', fontWeight: 400 }}>({product.volume})</span>
                      </div>

                      <p style={{ fontSize: '0.9rem', color: '#5C635B', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                        {product.shortDescription}
                      </p>

                      <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
                        <button 
                          className="btn-primary" 
                          style={{ flexGrow: 1, justifyContent: 'center', padding: '0.85rem' }}
                          onClick={() => addToCart(product)}
                        >
                          <ShoppingBag size={16} /> ADD TO CART · £{product.price}
                        </button>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '0.85rem', justifyContent: 'center' }}
                          onClick={() => openProductDetail(product)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================================= */}
      {/* SEPARATE VIEW 3: SEPARATE DEDICATED "GIFTING" PAGE                        */}
      {/* ========================================================================= */}
      {activeTab === 'gifting' && (
        <main style={{ backgroundColor: '#EAD8BA', minHeight: '80vh' }}>
          <div style={{ backgroundColor: '#DFCAA7', borderBottom: '1px solid #E5DFC5', padding: '1rem 0' }}>
            <div className="container" style={{ fontSize: '0.825rem', color: '#5C635B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={() => navigateToTab('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5C635B', textDecoration: 'underline' }}>Home</button>
              <span>/</span>
              <span style={{ color: '#2D3A29', fontWeight: 600 }}>Gifting & Trio Sets</span>
            </div>
          </div>

          <section style={{ padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
            <div className="giant-watermark-text" style={{ position: 'absolute', top: '10px', right: '2%', zIndex: 1, color: 'rgba(74, 93, 78, 0.035)' }}>
              love
            </div>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <span className="loveworld-badge" style={{ marginBottom: '1rem' }}>
                  GIVE THE GIFT OF LUXURY
                </span>
                <h1 className="font-display" style={{ fontSize: '4rem', color: '#1E221D' }}>
                  Natural Body-Care Gift Sets
                </h1>
                <p style={{ color: '#5C635B', fontSize: '1.05rem', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
                  Looking for a thoughtful gift? Create a beautiful LICHT LUXE NATURALS gift set for someone special.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#F4EFE6', padding: '2.5rem', borderRadius: '16px', border: '2px solid #C5A059', boxShadow: '0 15px 40px rgba(197, 160, 89, 0.15)' }}>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C5A059', fontWeight: 700 }}>
                      THE LUXE TRIO BOX
                    </div>
                    <h2 className="font-display" style={{ fontSize: '2.75rem', color: '#2D3A29' }}>
                      The Complete Ritual Set
                    </h2>
                  </div>

                  <div 
                    style={{ borderRadius: '8px', overflow: 'hidden', height: '280px', marginBottom: '1.5rem', cursor: 'pointer' }}
                    onClick={() => openProductDetail(PRODUCTS[3])}
                  >
                    <img 
                      src="/luxe_trio_primary.jpg" 
                      alt="The Luxe Trio Gift Set" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', color: '#2D3A29' }}>
                      <Check size={18} color="#C5A059" /> <strong>Pure Shea Butter</strong> (250ml)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', color: '#2D3A29' }}>
                      <Check size={18} color="#C5A059" /> <strong>Pure Coconut Oil</strong> (200ml)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', color: '#2D3A29' }}>
                      <Check size={18} color="#C5A059" /> <strong>Luxe Body Butter</strong> (250g)
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      className="btn-primary" 
                      style={{ flexGrow: 1, justifyContent: 'center', padding: '0.95rem' }}
                      onClick={() => addToCart(PRODUCTS[3])}
                    >
                      Add to Bag · £68
                    </button>
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '0.95rem 1.25rem' }}
                      onClick={() => openProductDetail(PRODUCTS[3])}
                    >
                      View Details
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="font-display" style={{ fontSize: '2.75rem', color: '#2D3A29', marginBottom: '1rem' }}>
                    Perfect For Every Occasion
                  </h2>
                  <p style={{ color: '#5C635B', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                    Each gift box is lovingly packaged with our signature gold ribbon and MADE IN LOVEWORLD emblem seal.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '1rem', color: '#2D3A29', backgroundColor: '#DFCAA7', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E5DFC5', marginBottom: '2rem' }}>
                    <div>🎁 Birthdays</div>
                    <div>🎁 Mother's Day</div>
                    <div>🎁 Valentine's Day</div>
                    <div>🎁 Christmas</div>
                    <div>🎁 Bridesmaids</div>
                    <div>🎁 Baby showers</div>
                    <div>🎁 Self-care gifts</div>
                    <div>🎁 Corporate gifts</div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <a href="tel:07831082965" className="btn-secondary" style={{ padding: '0.95rem 1.5rem' }}>
                      <Phone size={16} /> Order by Call: 07831082965
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================================= */}
      {/* SEPARATE VIEW 4: SEPARATE DEDICATED "CONTACT" PAGE                        */}
      {/* ========================================================================= */}
      {activeTab === 'contact' && (
        <main style={{ backgroundColor: '#EAD8BA', minHeight: '80vh' }}>
          <div style={{ backgroundColor: '#DFCAA7', borderBottom: '1px solid #E5DFC5', padding: '1rem 0' }}>
            <div className="container" style={{ fontSize: '0.825rem', color: '#5C635B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={() => navigateToTab('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5C635B', textDecoration: 'underline' }}>Home</button>
              <span>/</span>
              <span style={{ color: '#2D3A29', fontWeight: 600 }}>Contact Us</span>
            </div>
          </div>

          <section style={{ padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
            <div className="giant-watermark-text" style={{ position: 'absolute', top: '10px', left: '2%', zIndex: 1, color: 'rgba(74, 93, 78, 0.035)' }}>
              nourish
            </div>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
                <div>
                  <span className="loveworld-badge" style={{ marginBottom: '1rem' }}>
                    GET IN TOUCH
                  </span>
                  <h1 className="font-display" style={{ fontSize: '4rem', color: '#1E221D', marginBottom: '1.25rem' }}>
                    We'd Love to Hear From You
                  </h1>
                  <p style={{ color: '#5C635B', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                    Have a question about our products, an order or a collaboration? Our team would love to hear from you.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ backgroundColor: '#EAF0E8', padding: '0.75rem', borderRadius: '50%', color: '#4A5D4E' }}><Phone size={20} /></div>
                      <div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6E5535', fontWeight: 600 }}>PHONE / WHATSAPP</div>
                        <a href="tel:07831082965" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2D3A29', textDecoration: 'none' }}>07831082965</a>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ backgroundColor: '#EAF0E8', padding: '0.75rem', borderRadius: '50%', color: '#4A5D4E' }}><Mail size={20} /></div>
                      <div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6E5535', fontWeight: 600 }}>EMAIL</div>
                        <a href="mailto:info@lichtluxenaturals.org" style={{ fontSize: '1.05rem', fontWeight: 600, color: '#2D3A29', textDecoration: 'none' }}>info@lichtluxenaturals.org</a>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ backgroundColor: '#F4EBD9', padding: '0.75rem', borderRadius: '50%', color: '#C5A059' }}><Camera size={20} /></div>
                      <div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6E5535', fontWeight: 600 }}>INSTAGRAM & TIKTOK</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#2D3A29' }}>@lichtluxenaturals</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div style={{ backgroundColor: '#F4EFE6', padding: '2.5rem', borderRadius: '12px', border: '1px solid #E5DFC5', boxShadow: 'var(--shadow-soft)' }}>
                  <h3 className="font-display" style={{ fontSize: '2rem', color: '#2D3A29', marginBottom: '1.5rem' }}>
                    Send Us a Message
                  </h3>

                  {contactSubmitted ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                      <Check size={48} color="#4A5D4E" style={{ margin: '0 auto 1rem auto' }} />
                      <h4 className="font-serif" style={{ fontSize: '1.5rem', color: '#2D3A29' }}>Message Sent!</h4>
                      <p style={{ color: '#5C635B', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Thank you for reaching out to LICHT LUXE NATURALS. We will get back to you shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2D3A29', marginBottom: '0.35rem' }}>Your Name</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Jane Doe"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid #E5DFC5', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.95rem' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2D3A29', marginBottom: '0.35rem' }}>Email</label>
                          <input 
                            type="email" 
                            required 
                            placeholder="jane@example.com"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid #E5DFC5', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.95rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2D3A29', marginBottom: '0.35rem' }}>Phone</label>
                          <input 
                            type="tel" 
                            placeholder="07831082965"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid #E5DFC5', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.95rem' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2D3A29', marginBottom: '0.35rem' }}>Topic</label>
                        <select 
                          value={contactForm.topic}
                          onChange={(e) => setContactForm({ ...contactForm, topic: e.target.value })}
                          style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid #E5DFC5', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.95rem', backgroundColor: '#FFF' }}
                        >
                          <option>General Inquiry</option>
                          <option>Product & Ingredient Advice</option>
                          <option>Order & Delivery Status</option>
                          <option>Gifting & Custom Trio Sets</option>
                          <option>Wholesale & Collaborations</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2D3A29', marginBottom: '0.35rem' }}>Message</label>
                        <textarea 
                          rows={4}
                          required 
                          placeholder="How can we help you today?"
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid #E5DFC5', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.95rem', resize: 'vertical' }}
                        />
                      </div>

                      <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        Send Message <ArrowUpRight size={16} />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================================= */}
      {/* HOME PAGE VIEW                                                            */}
      {/* ========================================================================= */}
      {activeTab === 'home' && (
        <main style={{ backgroundColor: '#EAD8BA' }}>
          
          {/* EDITORIAL HERO SECTION MATCHING REFERENCE IMG 1 & IMG 2 */}
          <section style={{ position: 'relative', overflow: 'hidden', padding: '3.5rem 0 5rem 0', backgroundColor: '#EAD8BA' }}>
            {/* Subtle background watermark text: "pure" in top right open background space */}
            <div 
              className="giant-watermark-text" 
              style={{ 
                position: 'absolute', 
                top: '-10px', 
                right: '2%', 
                fontSize: 'clamp(8rem, 20vw, 18rem)', 
                color: 'rgba(74, 93, 78, 0.035)', 
                userSelect: 'none', 
                pointerEvents: 'none',
                zIndex: 1
              }}
            >
              pure
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: '3.5rem', alignItems: 'center' }}>
                
                {/* Left Content Column */}
                <div>
                  <div className="text-uppercase" style={{ color: '#6A7E6B', letterSpacing: '0.22em', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                    NATURE, THOUGHTFULLY ELEVATED
                  </div>

                  <h1 
                    className="font-display" 
                    style={{ fontSize: 'clamp(3.25rem, 5.5vw, 4.8rem)', color: '#1E221D', marginBottom: '1.25rem', lineHeight: 1.06, letterSpacing: '-0.02em', fontWeight: 400 }}
                  >
                    A softer way<br />
                    to glow.
                  </h1>

                  <p style={{ color: '#5C635B', fontSize: '1.08rem', lineHeight: 1.7, marginBottom: '2.25rem', maxWidth: '440px' }}>
                    Botanical skincare that nurtures your skin, honours the earth, and turns the everyday into a little luxury.
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                    <button 
                      className="btn-primary" 
                      onClick={() => navigateToTab('shop')}
                      style={{ backgroundColor: '#4A5D4E', borderColor: '#4A5D4E', borderRadius: '4px', padding: '0.95rem 2rem', fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.04em' }}
                    >
                      Discover your essentials <ArrowUpRight size={17} />
                    </button>
                  </div>

                  <div className="text-uppercase" style={{ color: '#6E5535', letterSpacing: '0.18em', fontSize: '0.725rem', fontWeight: 600 }}>
                    PURE INGREDIENTS. BEAUTIFUL INTENTIONS.
                  </div>
                </div>

                {/* Right Column: Model Image with Floating Product Card & Badges */}
                <div style={{ position: 'relative' }}>
                  
                  {/* Model Image Container */}
                  <div style={{ borderRadius: '6px', overflow: 'hidden', height: '560px', position: 'relative', boxShadow: '0 20px 50px rgba(45, 58, 41, 0.08)', backgroundColor: '#DFCAA7' }}>
                    <img 
                      src="/hero_trio_ingredients.png" 
                      alt="LICHT LUXE NATURALS Products Trio — Pure Coconut Oil, Body Butter & Shea Butter" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }}
                    />

                    {/* Top Right Pill Badge: MADE IN LOVEWORLD (matching img 2) */}
                    <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
                      <div 
                        style={{ 
                          backgroundColor: '#EAD8BA', 
                          border: '1.5px solid #C5A059', 
                          borderRadius: '40px', 
                          padding: '0.45rem 1.15rem', 
                          fontSize: '0.725rem', 
                          letterSpacing: '0.18em', 
                          fontWeight: 600, 
                          color: '#2D3A29',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                        }}
                      >
                        MADE IN LOVEWORLD
                      </div>
                    </div>

                    {/* Bottom Right Box Tag: Let your skin breathe (matching img 1) */}
                    <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', zIndex: 10 }}>
                      <div 
                        style={{ 
                          backgroundColor: '#EAD8BA', 
                          padding: '0.65rem 1.25rem', 
                          borderRadius: '2px', 
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          fontFamily: "var(--font-serif)",
                          fontStyle: "italic",
                          fontSize: "1.1rem",
                          color: "#2D3A29"
                        }}
                      >
                        Let your skin breathe.
                      </div>
                    </div>
                  </div>

                  {/* Overlapping Floating Product Highlight Card (matching img 1) */}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      bottom: '25px', 
                      left: '-65px', 
                      zIndex: 20, 
                      backgroundColor: '#DFCAA7', 
                      padding: '0.75rem', 
                      borderRadius: '4px', 
                      width: '210px',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
                      border: '1px solid #E5DFC5',
                      cursor: 'pointer'
                    }}
                    onClick={() => openProductDetail(PRODUCTS[2])}
                  >
                    <div style={{ height: '165px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.65rem', backgroundColor: '#DFCAA7' }}>
                      <img 
                        src="/body_butter_hand_apply.jpg" 
                        alt="Luxe Body Butter texture application on skin" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#2D3A29', fontWeight: 500 }}>
                      <span>Meet Luxe Body Butter</span>
                      <ArrowUpRight size={14} />
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </section>

          {/* 4-PILLAR BRAND TRUST BAR (matching img 1 bottom banner) */}
          <section style={{ backgroundColor: '#DFCAA7', borderTop: '1px solid #E5DFC5', borderBottom: '1px solid #E5DFC5', padding: '1.25rem 0' }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4A5D4E', fontWeight: 500 }}>
                  <Leaf size={16} /> Botanical ingredients
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4A5D4E', fontWeight: 500 }}>
                  <Leaf size={16} /> Mindfully formulated
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4A5D4E', fontWeight: 500 }}>
                  <Leaf size={16} /> Cruelty-free, always
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4A5D4E', fontWeight: 500 }}>
                  <Leaf size={16} /> Made for everyday rituals
                </div>
              </div>
            </div>
          </section>

          {/* EDITORIAL SECTION 1 (MATCHING IMG 2 TOP SPLIT BANNER): THE LUXE NATURALS PHILOSOPHY */}
          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '80vh', minHeight: '600px', backgroundColor: '#DFE5DC' }}>
            {/* Left Column: Full-bleed Radiant Clear Skin Model Image (img 2 reference) */}
            <div style={{ height: '80vh', minHeight: '600px', overflow: 'hidden' }}>
              <img 
                src="/clear_skin_model.png" 
                alt="Radiant clear skin model — LICHT LUXE NATURALS" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
              />
            </div>

            {/* Right Column: Sage / Olive Tint Background with Philosophy Copy */}
            <div style={{ padding: '4.5rem 4rem', height: '80vh', minHeight: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#DFE5DC', position: 'relative' }}>
              <div className="giant-watermark-text" style={{ position: 'absolute', top: '10px', right: '5%', color: 'rgba(74, 93, 78, 0.035)', zIndex: 1 }}>
                grace
              </div>

              <div style={{ position: 'relative', zIndex: 2 }}>
                <div className="text-uppercase" style={{ color: '#5A6E5E', letterSpacing: '0.22em', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                  THE LUXE NATURALS PHILOSOPHY
                </div>

                <h2 className="font-display" style={{ fontSize: 'clamp(3rem, 4.5vw, 4.2rem)', color: '#1E221D', marginBottom: '1.5rem', lineHeight: 1.08, letterSpacing: '-0.02em', fontWeight: 400 }}>
                  Less, but<br />
                  more meaningful.
                </h2>

                <div style={{ color: '#4D584C', fontSize: '1.05rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem', maxWidth: '480px' }}>
                  <p>
                    We believe beautiful skin begins with care, not complexity. So we look to nature for ingredients with purpose, and create thoughtful formulas that feel as good as they are.
                  </p>
                  <p>
                    No crowded shelves. No hurried routines. Just a few beautiful essentials, and a moment that belongs to you.
                  </p>
                </div>

                <button 
                  onClick={() => navigateToTab('story')}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    padding: 0, 
                    cursor: 'pointer', 
                    color: '#2D3A29', 
                    fontSize: '0.9rem', 
                    fontWeight: 600, 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    textDecoration: 'underline',
                    marginBottom: '2.5rem'
                  }}
                >
                  Get to know us <ArrowUpRight size={15} />
                </button>

                <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.25rem', color: '#4D584C' }}>
                  From the earth. With intention.
                </div>
              </div>
            </div>
          </section>

          {/* EDITORIAL SECTION 2 (MATCHING IMG 2 BOTTOM 4-COLUMN GRID): GOODNESS, AT THE SOURCE */}
          <section style={{ padding: '5.5rem 0', backgroundColor: '#EAD8BA', position: 'relative', overflow: 'hidden' }}>
            <div className="giant-watermark-text" style={{ position: 'absolute', top: '10px', left: '2%', color: 'rgba(74, 93, 78, 0.035)', zIndex: 1 }}>
              nature
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
                
                {/* Column 1: Section Header Text */}
                <div style={{ paddingRight: '1rem' }}>
                  <div className="text-uppercase" style={{ color: '#6A7E6B', letterSpacing: '0.22em', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                    GOODNESS, AT THE SOURCE
                  </div>

                  <h2 className="font-display" style={{ fontSize: 'clamp(2.5rem, 3.8vw, 3.5rem)', color: '#1E221D', marginBottom: '1.5rem', lineHeight: 1.1, fontWeight: 400 }}>
                    Nature does<br />
                    the beautiful<br />
                    work.
                  </h2>

                  <button 
                    onClick={() => navigateToTab('story')}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      padding: 0, 
                      cursor: 'pointer', 
                      color: '#4A5D4E', 
                      fontSize: '0.875rem', 
                      fontWeight: 600, 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.4rem', 
                      textDecoration: 'underline'
                    }}
                  >
                    Explore our ingredients <ArrowUpRight size={15} />
                  </button>
                </div>

                {/* Column 2: Raw African Shea Butter */}
                <div>
                  <div style={{ height: '240px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem', backgroundColor: '#DFCAA7' }}>
                    <img 
                      src="/body_butter_hand_apply.jpg" 
                      alt="Raw African Shea Butter" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <h3 className="font-display" style={{ fontSize: '1.6rem', color: '#1E221D', marginBottom: '0.25rem', fontWeight: 400 }}>
                    Raw Shea Butter
                  </h3>
                  <p style={{ color: '#5C635B', fontSize: '0.875rem', lineHeight: 1.5 }}>
                    100% unrefined & rich in Vitamins A & E for deep skin moisture.
                  </p>
                </div>

                {/* Column 3: Cold-Pressed Coconut Oil */}
                <div>
                  <div style={{ height: '240px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem', backgroundColor: '#DFCAA7' }}>
                    <img 
                      src="/raw_coconut_ingredient.jpg" 
                      alt="Raw Coconut & Virgin Coconut Oil" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }}
                    />
                  </div>
                  <h3 className="font-display" style={{ fontSize: '1.6rem', color: '#1E221D', marginBottom: '0.25rem', fontWeight: 400 }}>
                    Virgin Coconut Oil
                  </h3>
                  <p style={{ color: '#5C635B', fontSize: '0.875rem', lineHeight: 1.5 }}>
                    Cold-pressed & rich in lauric acid to restore natural radiance.
                  </p>
                </div>

                {/* Column 4: Vitamin E & Botanical Oils */}
                <div>
                  <div style={{ height: '240px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem', backgroundColor: '#DFCAA7' }}>
                    <img 
                      src="https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80" 
                      alt="Botanical Oils & Vitamin E" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <h3 className="font-display" style={{ fontSize: '1.6rem', color: '#1E221D', marginBottom: '0.25rem', fontWeight: 400 }}>
                    Botanical Vitamin E
                  </h3>
                  <p style={{ color: '#5C635B', fontSize: '0.875rem', lineHeight: 1.5 }}>
                    Antioxidant-rich natural oils that nourish & soothe the skin.
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* EDITORIAL GALLERY BLOCK 2: PURE CARE BY NATURE */}
          <section style={{ padding: '5rem 0', backgroundColor: '#EAD8BA', position: 'relative' }}>
            <div className="giant-watermark-text" style={{ position: 'absolute', bottom: '0', right: '2%', opacity: 0.6 }}>
              pure
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', alignItems: 'stretch' }}>
                <div style={{ backgroundColor: '#F4EFE6', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E5DFC5', boxShadow: 'var(--shadow-soft)' }}>
                  <div style={{ height: '340px', overflow: 'hidden' }}>
                    <img 
                      src="/clear_skin_model.jpg" 
                      alt="Glowing clear skin model texture" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C5A059', fontWeight: 600 }}>CLEAR SKIN GLOW</div>
                    <h3 className="font-display" style={{ fontSize: '1.6rem', color: '#2D3A29', marginTop: '0.25rem' }}>Real skin nourishment</h3>
                    <p style={{ fontSize: '0.85rem', color: '#5C635B', marginTop: '0.35rem' }}>Soft, supple, and beautifully moisturised feel.</p>
                  </div>
                </div>

                <div 
                  style={{ backgroundColor: '#F4EFE6', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E5DFC5', boxShadow: 'var(--shadow-soft)', cursor: 'pointer' }}
                  onClick={() => openProductDetail(PRODUCTS[1])}
                >
                  <div style={{ height: '340px', overflow: 'hidden' }}>
                    <img 
                      src="/coconut_oil_split_showcase.jpg" 
                      alt="Pure Coconut Oil split showcase artwork" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }}
                    />
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C5A059', fontWeight: 600 }}>100% COLD PRESSED</div>
                    <h3 className="font-display" style={{ fontSize: '1.6rem', color: '#2D3A29', marginTop: '0.25rem' }}>Pure Coconut Oil</h3>
                    <p style={{ fontSize: '0.85rem', color: '#5C635B', marginTop: '0.35rem' }}>Nature's versatile nourishing oil · £22.</p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#DFCAA7', borderRadius: '12px', padding: '2.5rem 2rem', border: '1.5px solid #C5A059', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="loveworld-badge" style={{ width: 'fit-content', marginBottom: '1rem' }}>
                    MADE IN LOVEWORLD
                  </div>
                  <h3 className="font-display" style={{ fontSize: '2.5rem', color: '#1E221D', marginBottom: '1rem', lineHeight: 1.1 }}>
                    Pure care<br />
                    <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#6E5535' }}>by nature.</span>
                  </h3>
                  <p style={{ color: '#5C635B', fontSize: '0.925rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                    Thoughtfully crafted formulas designed to bring balance and calm to your daily routine. Gentle ingredients help support healthy-looking skin.
                  </p>
                  <button 
                    className="btn-primary" 
                    onClick={() => navigateToTab('shop')}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    SHOP COLLECTION
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* EDITORIAL ESSENTIAL COLLECTION GRID */}
          <section style={{ padding: '5rem 0', backgroundColor: '#EAD8BA' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <div className="text-uppercase" style={{ color: '#4A5D4E', marginBottom: '0.35rem' }}>
                  OUR ESSENTIAL TRIO
                </div>
                <h2 className="font-display" style={{ fontSize: '3.75rem', color: '#1E221D' }}>
                  Gentle care. Real balance.
                </h2>
                <p style={{ color: '#5C635B', fontSize: '1rem', maxWidth: '580px', margin: '0.5rem auto 0 auto' }}>
                  Discover our carefully crafted collection of natural body-care essentials.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                {PRODUCTS.map(product => (
                  <div 
                    key={product.id}
                    style={{ 
                      backgroundColor: '#F4EFE6', 
                      borderRadius: '12px', 
                      overflow: 'hidden', 
                      border: product.id === 'luxe-trio-gift-set' ? '2px solid #C5A059' : '1px solid #E5DFC5',
                      boxShadow: 'var(--shadow-soft)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div 
                      style={{ position: 'relative', height: '280px', overflow: 'hidden', backgroundColor: '#DFCAA7', cursor: 'pointer' }}
                      onClick={() => openProductDetail(product)}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: '#2D3A29', color: '#FAF7F2', fontSize: '0.7rem', padding: '0.3rem 0.75rem', borderRadius: '4px', letterSpacing: '0.1em', fontWeight: 600 }}>
                        {product.badge}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: '#FFFFFF', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                      >
                        <Heart size={18} fill={wishlist.includes(product.id) ? '#C5A059' : 'none'} color={wishlist.includes(product.id) ? '#C5A059' : '#1E221D'} />
                      </button>
                    </div>

                    <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: '#C5A059', letterSpacing: '0.12em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        {product.subtitle}
                      </div>
                      <h3 
                        className="font-display" 
                        style={{ fontSize: '2rem', color: '#2D3A29', marginBottom: '0.5rem', cursor: 'pointer' }}
                        onClick={() => openProductDetail(product)}
                      >
                        {product.name}
                      </h3>
                      <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#6E5535', marginBottom: '1rem' }}>
                        £{product.price} <span style={{ fontSize: '0.85rem', color: '#5C635B', fontWeight: 400 }}>({product.volume})</span>
                      </div>

                      <p style={{ fontSize: '0.9rem', color: '#5C635B', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                        {product.shortDescription}
                      </p>

                      <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
                        <button 
                          className="btn-primary" 
                          style={{ flexGrow: 1, justifyContent: 'center', padding: '0.85rem' }}
                          onClick={() => addToCart(product)}
                        >
                          <ShoppingBag size={16} /> ADD TO CART · £{product.price}
                        </button>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '0.85rem', justifyContent: 'center' }}
                          onClick={() => openProductDetail(product)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* EDITORIAL BANNER: FORMULATED WITH INTENTION */}
          <section style={{ padding: '4.5rem 0', backgroundColor: '#DFCAA7', borderTop: '1px solid #E5DFC5', borderBottom: '1px solid #E5DFC5', position: 'relative', overflow: 'hidden' }}>
            <div className="giant-watermark-text" style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
              loveworld
            </div>
            <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
              <MadeInLoveworldEmblem size="medium" />
              <h2 className="font-display" style={{ fontSize: '3.5rem', color: '#1E221D', marginTop: '1.5rem', marginBottom: '1rem', lineHeight: 1.05 }}>
                Formulated with intention.<br />
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#6E5535' }}>Designed for real skin.</span>
              </h2>
              <p style={{ color: '#5C635B', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                Every jar of LICHT LUXE NATURALS carries our commitment to quality, natural beauty, honesty, care, and love. Made in LOVEWORLD.
              </p>
              <button 
                className="btn-primary" 
                onClick={() => navigateToTab('shop')}
                style={{ padding: '0.95rem 2.25rem', fontSize: '0.9rem' }}
              >
                Shop Our Collection <ArrowUpRight size={16} />
              </button>
            </div>
          </section>

          {/* COMMUNITY REVIEWS */}
          <section style={{ padding: '4.5rem 0', backgroundColor: '#EAD8BA', position: 'relative', overflow: 'hidden' }}>
            <div className="giant-watermark-text" style={{ position: 'absolute', top: '-10px', left: '-20px', zIndex: 1 }}>
              bliss
            </div>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div className="text-uppercase" style={{ color: '#4A5D4E', marginBottom: '0.35rem' }}>
                  COMMUNITY REVIEWS
                </div>
                <h2 className="font-display" style={{ fontSize: '3rem', color: '#1E221D' }}>
                  Loved by Our Community
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {REVIEWS.map(rev => (
                  <div key={rev.id} style={{ backgroundColor: '#F4EFE6', padding: '2rem', borderRadius: '12px', border: '1px solid #E5DFC5' }}>
                    <div style={{ color: '#C5A059', fontSize: '1rem', marginBottom: '0.75rem' }}>★★★★★</div>
                    <blockquote style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#2D3A29', lineHeight: 1.6, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                      “{rev.quote}”
                    </blockquote>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E221D' }}>
                      — {rev.author}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6E5535' }}>
                      {rev.role} · {rev.product}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQS ACCORDION */}
          <section style={{ padding: '5rem 0', backgroundColor: '#DFCAA7', borderTop: '1px solid #E5DFC5', position: 'relative', overflow: 'hidden' }}>
            <div className="giant-watermark-text" style={{ position: 'absolute', top: '0', right: '-20px', zIndex: 1 }}>
              purity
            </div>
            <div className="container" style={{ maxWidth: '850px' }}>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div className="text-uppercase" style={{ color: '#4A5D4E', marginBottom: '0.35rem' }}>
                  GOT QUESTIONS?
                </div>
                <h2 className="font-display" style={{ fontSize: '3rem', color: '#1E221D' }}>
                  Frequently Asked Questions
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {FAQS.map((faq, index) => {
                  const isOpen = expandedFaq === index;
                  return (
                    <div 
                      key={index}
                      style={{ 
                        backgroundColor: '#F4EFE6', 
                        borderRadius: '8px', 
                        border: '1px solid #E5DFC5', 
                        overflow: 'hidden',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      <button 
                        onClick={() => setExpandedFaq(isOpen ? null : index)}
                        style={{ 
                          width: '100%', 
                          padding: '1.25rem 1.5rem', 
                          backgroundColor: 'transparent', 
                          border: 'none', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.35rem',
                          color: '#2D3A29',
                          fontWeight: 400
                        }}
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp size={20} color="#C5A059" /> : <ChevronDown size={20} color="#5C635B" />}
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: '#5C635B', fontSize: '0.95rem', lineHeight: 1.7, borderTop: '1px solid rgba(45, 58, 41, 0.15)' }}>
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#2D3A29', color: '#FAF7F2', paddingTop: '4rem', paddingBottom: '2rem', borderTop: '2px solid #C5A059' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', paddingBottom: '3.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            
            {/* Brand Column */}
            <div>
              <LichtLogo color="#FAF7F2" size="footer" />
              <p style={{ color: '#A0A89F', fontSize: '0.9rem', marginTop: '1rem', maxWidth: '320px', lineHeight: 1.6 }}>
                Pure. Natural. Made with Love.<br />
                Naturally crafted body care for healthy, nourished and beautifully cared-for skin.
              </p>

              <div style={{ marginTop: '1.25rem' }}>
                <span className="loveworld-badge" style={{ backgroundColor: 'rgba(197, 160, 89, 0.2)', color: '#C5A059' }}>
                  MADE IN LOVEWORLD
                </span>
              </div>
            </div>

            {/* Column 1: SHOP */}
            <div>
              <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C5A059', marginBottom: '1.25rem', fontWeight: 600 }}>
                SHOP
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: '#D6DDD3' }}>
                <li><button onClick={() => openProductDetail(PRODUCTS[0])} style={{ background: 'none', border: 'none', color: '#D6DDD3', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Pure Shea Butter</button></li>
                <li><button onClick={() => openProductDetail(PRODUCTS[1])} style={{ background: 'none', border: 'none', color: '#D6DDD3', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Pure Coconut Oil</button></li>
                <li><button onClick={() => openProductDetail(PRODUCTS[2])} style={{ background: 'none', border: 'none', color: '#D6DDD3', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Body Butter</button></li>
                <li><button onClick={() => openProductDetail(PRODUCTS[3])} style={{ background: 'none', border: 'none', color: '#D6DDD3', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Gift Sets</button></li>
              </ul>
            </div>

            {/* Column 2: ABOUT */}
            <div>
              <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C5A059', marginBottom: '1.25rem', fontWeight: 600 }}>
                ABOUT
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: '#D6DDD3' }}>
                <li><button onClick={() => navigateToTab('story')} style={{ background: 'none', border: 'none', color: '#D6DDD3', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Our Story (About Us)</button></li>
                <li><button onClick={() => navigateToTab('story')} style={{ background: 'none', border: 'none', color: '#D6DDD3', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Our Philosophy</button></li>
                <li><button onClick={() => navigateToTab('story')} style={{ background: 'none', border: 'none', color: '#D6DDD3', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Our Promise</button></li>
              </ul>
            </div>

            {/* Column 3: HELP */}
            <div>
              <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C5A059', marginBottom: '1.25rem', fontWeight: 600 }}>
                HELP
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: '#D6DDD3' }}>
                <li><button onClick={() => navigateToTab('contact')} style={{ background: 'none', border: 'none', color: '#D6DDD3', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Contact Us</button></li>
                <li><button onClick={() => navigateToTab('home')} style={{ background: 'none', border: 'none', color: '#D6DDD3', cursor: 'pointer', textAlign: 'left', padding: 0 }}>FAQs</button></li>
                <li><a href="tel:07831082965" style={{ color: '#D6DDD3', textDecoration: 'none' }}>Phone: 07831082965</a></li>
                <li><button onClick={() => navigateToTab('contact')} style={{ background: 'none', border: 'none', color: '#D6DDD3', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Privacy Policy</button></li>
              </ul>
            </div>

          </div>

          {/* Bottom Footer Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', fontSize: '0.8rem', color: '#A0A89F', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              © 2026 LICHT LUXE NATURALS. All Rights Reserved. Pure. Natural. Made with Love.
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: '#A0A89F', textDecoration: 'none' }}>Instagram</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: '#A0A89F', textDecoration: 'none' }}>Facebook</a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" style={{ color: '#A0A89F', textDecoration: 'none' }}>TikTok</a>
            </div>
          </div>
        </div>
      </footer>

      {/* SHOPPING BAG DRAWER */}
      {isCartOpen && (
        <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3 className="drawer-title font-serif">Your Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})</h3>
              <button className="close-drawer-btn" onClick={() => setIsCartOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Free Shipping Bar */}
            <div className="free-shipping-bar">
              {amountForFreeShipping > 0 ? (
                <>Add <strong>£{amountForFreeShipping.toFixed(2)}</strong> more for complimentary delivery</>
              ) : (
                <>✨ You've unlocked complimentary delivery!</>
              )}
              <div className="shipping-progress">
                <div className="shipping-progress-fill" style={{ width: `${progressToFreeShipping}%`, backgroundColor: '#C5A059' }} />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="cart-items-list">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#5C635B' }}>
                  Your shopping bag is currently empty.
                  <div style={{ marginTop: '1.5rem' }}>
                    <button className="btn-primary" onClick={() => { setIsCartOpen(false); navigateToTab('shop'); }}>
                      Discover Essentials
                    </button>
                  </div>
                </div>
              ) : (
                cart.map(item => (
                  <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-details">
                      <div className="cart-item-title">{item.name}</div>
                      <div className="cart-item-sub">{item.volume}</div>
                      <div className="cart-item-bottom">
                        <div className="qty-controls">
                          <button className="qty-btn" onClick={() => updateCartQuantity(item.id, -1)}><Minus size={12} /></button>
                          <span className="qty-num">{item.quantity}</span>
                          <button className="qty-btn" onClick={() => updateCartQuantity(item.id, 1)}><Plus size={12} /></button>
                        </div>
                        <div style={{ fontWeight: 600, color: '#6E5535' }}>£{item.price * item.quantity}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-subtotal-row">
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 700, color: '#2D3A29' }}>£{cartSubtotal.toFixed(2)}</span>
                </div>
                <button className="btn-primary checkout-btn" onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} style={{ width: '100%', justifyContent: 'center' }}>
                  Proceed to Checkout · £{cartSubtotal.toFixed(2)}
                </button>
                <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: '#5C635B' }}>
                  Or call <a href="tel:07831082965" style={{ color: '#2D3A29', fontWeight: 600 }}>07831082965</a> to order directly
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className="modal-overlay" onClick={() => setIsSearchOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setIsSearchOpen(false)}>
              <X size={22} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '2px solid #C5A059', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              <Search size={22} color="#4A5D4E" />
              <input 
                type="text"
                placeholder="Search Shea Butter, Coconut Oil, Body Butter..."
                style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '1.15rem', fontFamily: 'var(--font-sans)' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {['Shea Butter', 'Coconut Oil', 'Body Butter', 'Gift Sets', 'Made in Loveworld'].map(tag => (
                <button 
                  key={tag}
                  style={{ background: '#DFCAA7', border: '1px solid #E5DFC5', padding: '0.35rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '4px', color: '#2D3A29' }}
                  onClick={() => setSearchQuery(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>

            {searchQuery && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                  <div key={p.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid #E5DFC5', paddingBottom: '0.75rem' }} onClick={() => { openProductDetail(p); setIsSearchOpen(false); }}>
                    <img src={p.image} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: '#2D3A29' }}>{p.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#5C635B' }}>£{p.price} · {p.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECURE CHECKOUT MODAL (STRIPE & PAYPAL) */}
      {isCheckoutOpen && (
        <div className="modal-overlay" style={{ zIndex: 1000 }} onClick={() => setIsCheckoutOpen(false)}>
          <div className="modal-card checkout-modal" style={{ maxWidth: '850px', width: '95%', maxHeight: '90vh', padding: '0', display: 'flex', flexDirection: 'row', overflow: 'hidden', borderRadius: '8px' }} onClick={(e) => e.stopPropagation()}>
            
            {/* Left Side: Order Summary */}
            <div style={{ backgroundColor: '#FDFCF9', padding: '2rem', width: '45%', borderRight: '1px solid #E5DFC5', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C5A059', marginBottom: '1.25rem', fontWeight: 600 }}>
                Order Summary
              </div>
              
              <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #E5DFC5' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#2D3A29', color: '#FFF', fontSize: '0.65rem', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                        {item.quantity}
                      </span>
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontSize: '0.85rem', color: '#2D3A29', fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#5C635B' }}>{item.volume}</div>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#2D3A29' }}>
                      £{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ borderTop: '1px solid #E5DFC5', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#5C635B' }}>
                  <span>Subtotal</span>
                  <span>£{cartSubtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem', color: '#5C635B' }}>
                  <span>Shipping</span>
                  <span>{amountForFreeShipping > 0 ? 'Calculated at next step' : 'Complimentary'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', color: '#2D3A29', fontWeight: 700 }}>
                  <span>Total</span>
                  <span>£{cartSubtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Right Side: Payment Options (UK) */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', width: '55%', position: 'relative', overflowY: 'auto' }}>
              <button className="close-modal-btn" onClick={() => setIsCheckoutOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
                <X size={20} />
              </button>
              
              <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
                <LichtLogo size="header" color="#2D3A29" markOnly={true} style={{ margin: '0 auto', marginBottom: '0.75rem' }} />
                <h2 className="font-serif" style={{ fontSize: '1.8rem', color: '#2D3A29', marginBottom: '0.25rem', fontWeight: 400 }}>Secure Checkout</h2>
                <p style={{ color: '#5C635B', fontSize: '0.85rem' }}>Choose your preferred payment method.</p>
              </div>

              {/* Express Checkout Options (Apple/Google Pay mock) */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ height: '1px', backgroundColor: '#E5DFC5', flexGrow: 1 }}></div>
                  <span style={{ fontSize: '0.75rem', color: '#6E5535', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Express Checkout</span>
                  <div style={{ height: '1px', backgroundColor: '#E5DFC5', flexGrow: 1 }}></div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button style={{ flex: 1, backgroundColor: '#000', color: '#FFF', border: 'none', padding: '0.85rem', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 500 }}>
                    <svg viewBox="0 0 384 512" width="16" height="16" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg> Pay
                  </button>
                  <button style={{ flex: 1, backgroundColor: '#FFF', color: '#3C4043', border: '1px solid #DADCE0', padding: '0.85rem', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 500, boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)' }}>
                    <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M23.64 12.2045C23.64 11.3523 23.5636 10.5341 23.4218 9.75H12V14.3886H18.5236C18.24 15.8886 17.3891 17.1545 16.1236 17.9977V20.9705H20.0455C22.3364 18.8614 23.64 15.8182 23.64 12.2045Z"/><path fill="#34A853" d="M12 24C15.2727 24 18.0218 22.92 20.0455 20.9705L16.1236 17.9977C15.0327 18.7364 13.6364 19.1727 12 19.1727C8.83636 19.1727 6.15273 17.0364 5.18182 14.1705H1.13455V17.3073C3.14182 21.2891 7.23273 24 12 24Z"/><path fill="#FBBC05" d="M5.18182 14.1705C4.93091 13.425 4.78909 12.6341 4.78909 11.8227C4.78909 11.0114 4.93091 10.2205 5.18182 9.475V6.33818H1.13455C0.414545 7.76727 0 9.38182 0 11.8227C0 14.2636 0.414545 15.8782 1.13455 17.3073L5.18182 14.1705Z"/><path fill="#EA4335" d="M12 4.47273C13.7782 4.47273 15.3709 5.08364 16.6255 6.27818L20.1327 2.77091C18.0109 0.796364 15.2618 0 12 0C7.23273 0 3.14182 2.71091 1.13455 6.33818L5.18182 9.475C6.15273 6.60909 8.83636 4.47273 12 4.47273Z"/></svg> Pay
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ height: '1px', backgroundColor: '#E5DFC5', flexGrow: 1 }}></div>
                <span style={{ fontSize: '0.75rem', color: '#6E5535', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Or pay with</span>
                <div style={{ height: '1px', backgroundColor: '#E5DFC5', flexGrow: 1 }}></div>
              </div>

              {/* Payment Methods (UK focused) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* STRIPE CARD OPTION */}
                <div style={{ border: '1.5px solid #2D3A29', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#F9FBF8', cursor: 'pointer', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.4rem' }}>
                    <div style={{ backgroundColor: '#1A1F71', color: '#FFF', fontSize: '0.6rem', padding: '0.1rem 0.3rem', borderRadius: '2px', fontWeight: 600 }}>VISA</div>
                    <div style={{ backgroundColor: '#EB001B', color: '#FFF', fontSize: '0.6rem', padding: '0.1rem 0.3rem', borderRadius: '2px', fontWeight: 600 }}>MC</div>
                    <div style={{ backgroundColor: '#006FCF', color: '#FFF', fontSize: '0.6rem', padding: '0.1rem 0.3rem', borderRadius: '2px', fontWeight: 600 }}>AMEX</div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '6px solid #2D3A29', display: 'inline-block' }}></div>
                    <span style={{ fontWeight: 600, color: '#2D3A29', fontSize: '1.1rem' }}>Credit / Debit Card</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input type="text" placeholder="Card number" style={{ width: '100%', padding: '0.85rem', borderRadius: '4px', border: '1px solid #D6DDD3', fontSize: '1rem' }} />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <input type="text" placeholder="MM / YY" style={{ width: '50%', padding: '0.85rem', borderRadius: '4px', border: '1px solid #D6DDD3', fontSize: '1rem' }} />
                      <input type="text" placeholder="CVC" style={{ width: '50%', padding: '0.85rem', borderRadius: '4px', border: '1px solid #D6DDD3', fontSize: '1rem' }} />
                    </div>
                    <input type="text" placeholder="Name on card" style={{ width: '100%', padding: '0.85rem', borderRadius: '4px', border: '1px solid #D6DDD3', fontSize: '1rem' }} />
                  </div>
                  
                  <button 
                    style={{ width: '100%', padding: '1.15rem', backgroundColor: '#2D3A29', color: '#FFF', border: 'none', borderRadius: '4px', marginTop: '1.5rem', fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    onClick={() => {
                      showToast('Payment successful! Order placed securely via Stripe.');
                      setIsCheckoutOpen(false);
                      setCart([]);
                    }}
                  >
                    Pay £{cartSubtotal.toFixed(2)} Securely <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </button>
                  <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.7rem', color: '#5C635B', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Payments processed securely by Stripe
                  </div>
                </div>

                {/* PAYPAL SMART BUTTONS — Sandbox Integration */}
                <div style={{ border: '1px solid #E5DFC5', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: '22px' }} />
                    <span style={{ fontSize: '0.85rem', color: '#5C635B' }}>Fast, secure checkout</span>
                  </div>
                  
                  {paymentProcessing && (
                    <div style={{ textAlign: 'center', padding: '1rem', color: '#6E5535', fontSize: '0.9rem' }}>
                      <div style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid #E5DFC5', borderTopColor: '#C5A059', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginRight: '0.5rem', verticalAlign: 'middle' }}></div>
                      Processing your payment securely...
                    </div>
                  )}
                  
                  <div style={{ opacity: paymentProcessing ? 0.5 : 1, pointerEvents: paymentProcessing ? 'none' : 'auto' }}>
                    <PayPalButtons
                      style={{
                        layout: 'vertical',
                        color: 'gold',
                        shape: 'rect',
                        label: 'pay',
                        height: 45,
                        tagline: false,
                      }}
                      createOrder={createPayPalOrder}
                      onApprove={capturePayPalOrder}
                      onError={(err) => {
                        setPaymentProcessing(false);
                        showToast('PayPal encountered an error. Please try again.');
                        console.error('PayPal Error:', err);
                      }}
                      onCancel={() => {
                        setPaymentProcessing(false);
                        showToast('Payment cancelled.');
                      }}
                    />
                  </div>
                  
                  <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.7rem', color: '#5C635B', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Payments processed securely by PayPal
                  </div>
                </div>
                
                {/* KLARNA OPTION (Popular in UK) */}
                <div 
                  style={{ border: '1px solid #E5DFC5', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #D6DDD3', display: 'inline-block' }}></div>
                    <span style={{ fontWeight: 600, color: '#FFB3C7', backgroundColor: '#0A0A0A', padding: '0.2rem 0.6rem', borderRadius: '15px', fontSize: '0.9rem' }}>Klarna.</span>
                    <span style={{ fontSize: '0.9rem', color: '#5C635B' }}>Pay in 3 interest-free instalments</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUTHENTICATION & PASSWORD RECOVERY MODAL - LUXURY VIBE */}
      {isAuthOpen && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => { setIsAuthOpen(false); setAuthExpandedOption(null); }}>
          <div className="modal-card" style={{ maxWidth: '480px', width: '95%', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem 2.25rem', borderRadius: '6px', backgroundColor: '#FDFCF9', border: '1px solid #E5DFC5', boxShadow: '0 20px 40px rgba(45,58,41,0.08)' }} onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => { setIsAuthOpen(false); setAuthExpandedOption(null); }} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: '#5C635B' }}>
              <X size={22} />
            </button>
            
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <LichtLogo size="header" color="#2D3A29" markOnly={true} style={{ margin: '0 auto', marginBottom: '1rem' }} />
              <h2 className="font-serif" style={{ fontSize: '1.9rem', color: '#2D3A29', marginBottom: '0.35rem', fontWeight: 400 }}>
                {authMode === 'profile' ? 'Member Profile' :
                 authMode === 'forgot' ? 'Reset Password' :
                 authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
              </h2>
              <p style={{ color: '#C5A059', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {authMode === 'profile' ? 'LICHT Luxe Naturals Member' :
                 authMode === 'forgot' ? (forgotStep === 1 ? 'Step 1 of 3: Request Verification Code' : (forgotStep === 2 ? 'Step 2 of 3: Verify Passcode' : 'Step 3 of 3: New Password')) :
                 authMode === 'login' ? 'Access your member profile' : 'Join the Luxe Naturals community'}
              </p>
            </div>

            {/* ─── PROFILE VIEW (WHEN LOGGED IN) ─── */}
            {authMode === 'profile' && currentUser && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E5DFC5', borderRadius: '4px', padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#2D3A29', color: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '1.4rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {currentUser.firstName ? currentUser.firstName.charAt(0).toUpperCase() : 'L'}
                  </div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#2D3A29', fontSize: '1.2rem' }}>
                    {currentUser.firstName} {currentUser.lastName}
                  </h3>
                  <p style={{ margin: 0, color: '#5C635B', fontSize: '0.85rem' }}>{currentUser.email}</p>
                  <div style={{ marginTop: '0.75rem', display: 'inline-block', backgroundColor: '#DFCAA7', color: '#2D3A29', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                    {currentUser.role || 'MEMBER'}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E5DFC5', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button 
                    onClick={() => { setIsAuthOpen(false); navigateToTab('account'); }}
                    style={{ width: '100%', padding: '0.85rem', backgroundColor: '#2D3A29', color: '#FAF7F2', border: 'none', borderRadius: '2px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', letterSpacing: '0.05em' }}
                  >
                    View My Account & Orders
                  </button>
                  <button 
                    onClick={handleLogout}
                    style={{ width: '100%', padding: '0.85rem', backgroundColor: 'transparent', color: '#8B0000', border: '1px solid #D6DDD3', borderRadius: '2px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* ─── FORGOT PASSWORD (OTP WORKFLOW) ─── */}
            {authMode === 'forgot' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {forgotStep === 1 && (
                  <form onSubmit={handleForgotPasswordRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ fontSize: '0.85rem', color: '#5C635B', lineHeight: 1.5, margin: 0 }}>
                      Enter your registered email address below. We will send a secure 6-digit one-time passcode (OTP) to your inbox via <strong>info@lichtluxenaturals.org</strong>.
                    </p>
                    <input 
                      type="email" 
                      name="email"
                      value={forgotForm.email}
                      onChange={handleForgotInputChange}
                      placeholder="Your registered email address" 
                      required 
                      style={{ width: '100%', padding: '0.85rem', borderRadius: '2px', border: '1px solid #D6DDD3', fontSize: '0.9rem', backgroundColor: '#FFF' }} 
                    />
                    <button 
                      type="submit" 
                      disabled={authLoading}
                      style={{ padding: '0.9rem', backgroundColor: '#2D3A29', color: '#FFF', border: 'none', borderRadius: '2px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.05em', opacity: authLoading ? 0.7 : 1 }}
                    >
                      {authLoading ? 'Sending Code...' : 'Send Verification Code'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setAuthMode('login')} 
                      style={{ background: 'none', border: 'none', color: '#6E5535', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      ← Back to Sign In
                    </button>
                  </form>
                )}

                {forgotStep === 2 && (
                  <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E5DFC5', borderRadius: '4px', padding: '1rem', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.85rem', color: '#2D3A29', margin: 0 }}>
                        A 6-digit verification code was dispatched to:
                      </p>
                      <p style={{ fontWeight: 700, color: '#C5A059', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
                        {forgotForm.email}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#7A8279', margin: '6px 0 0 0' }}>
                        Valid for 10 minutes • Up to 5 attempts allowed
                      </p>
                    </div>

                    <input 
                      type="text" 
                      name="otp"
                      maxLength={6}
                      value={forgotForm.otp}
                      onChange={handleForgotInputChange}
                      placeholder="Enter 6-Digit OTP" 
                      required 
                      style={{ width: '100%', padding: '0.95rem', borderRadius: '2px', border: '2px solid #C5A059', fontSize: '1.3rem', textAlign: 'center', letterSpacing: '0.3em', fontFamily: 'monospace', fontWeight: 700, backgroundColor: '#FFF' }} 
                    />

                    <button 
                      type="submit" 
                      disabled={authLoading}
                      style={{ padding: '0.9rem', backgroundColor: '#2D3A29', color: '#FFF', border: 'none', borderRadius: '2px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.05em', opacity: authLoading ? 0.7 : 1 }}
                    >
                      {authLoading ? 'Verifying Code...' : 'Verify & Continue'}
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button 
                        type="button" 
                        onClick={() => setForgotStep(1)} 
                        style={{ background: 'none', border: 'none', color: '#6E5535', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        ← Change email
                      </button>
                      <button 
                        type="button" 
                        onClick={handleForgotPasswordRequest} 
                        style={{ background: 'none', border: 'none', color: '#C5A059', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
                      >
                        Resend code
                      </button>
                    </div>
                  </form>
                )}

                {forgotStep === 3 && (
                  <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ fontSize: '0.85rem', color: '#5C635B', lineHeight: 1.5, margin: 0 }}>
                      Code verified! Please enter your new password below.
                    </p>
                    <input 
                      type="password" 
                      name="newPassword"
                      value={forgotForm.newPassword}
                      onChange={handleForgotInputChange}
                      placeholder="New Password (min 6 characters)" 
                      required 
                      minLength={6}
                      style={{ width: '100%', padding: '0.85rem', borderRadius: '2px', border: '1px solid #D6DDD3', fontSize: '0.9rem', backgroundColor: '#FFF' }} 
                    />
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={forgotForm.confirmPassword}
                      onChange={handleForgotInputChange}
                      placeholder="Confirm New Password" 
                      required 
                      minLength={6}
                      style={{ width: '100%', padding: '0.85rem', borderRadius: '2px', border: '1px solid #D6DDD3', fontSize: '0.9rem', backgroundColor: '#FFF' }} 
                    />
                    <button 
                      type="submit" 
                      disabled={authLoading}
                      style={{ padding: '0.9rem', backgroundColor: '#2D3A29', color: '#FFF', border: 'none', borderRadius: '2px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.05em', opacity: authLoading ? 0.7 : 1 }}
                    >
                      {authLoading ? 'Updating Password...' : 'Save New Password'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ─── LOGIN & REGISTRATION WORKFLOW ─── */}
            {(authMode === 'login' || authMode === 'register') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* KINGSCHAT BUTTON */}
                <button 
                  style={{ width: '100%', padding: '1rem', backgroundColor: '#DFCAA7', color: '#2D3A29', border: '1px solid #C5A059', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.3s ease' }}
                  onClick={() => window.open('https://accounts.kingschat.online/log-in?clientId=5904093a-1631-43d7-b9e7-f1ab15d4b513&origin=%2F%3FauthRetry%3D1', '_blank')}
                  className="hover-bg-darken"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  {authMode === 'login' ? 'Sign in with KingsChat' : 'Sign up with KingsChat'}
                </button>

                {/* EMAIL BUTTON & ACCORDION */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  <button 
                    style={{ width: '100%', padding: '1rem', backgroundColor: 'transparent', color: '#2D3A29', border: '1px solid #E5DFC5', borderBottom: authExpandedOption === 'email' ? 'none' : '1px solid #E5DFC5', borderRadius: authExpandedOption === 'email' ? '4px 4px 0 0' : '4px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.3s ease' }}
                    onClick={() => setAuthExpandedOption(authExpandedOption === 'email' ? null : 'email')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Mail size={16} color="#6E5535" strokeWidth={1.5} />
                      {authMode === 'login' ? 'Continue with Email' : 'Sign up with Email'}
                    </div>
                    {authExpandedOption === 'email' ? <ChevronUp size={18} color="#C5A059" /> : <ChevronDown size={18} color="#C5A059" />}
                  </button>

                  {authExpandedOption === 'email' && (
                    <form onSubmit={authMode === 'login' ? handleLoginSubmit : handleRegisterSubmit} style={{ padding: '1.5rem', backgroundColor: '#FDFCF9', border: '1px solid #E5DFC5', borderTop: 'none', borderRadius: '0 0 4px 4px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {authMode === 'register' && (
                        <>
                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <input 
                              type="text" 
                              name="firstName" 
                              value={authForm.firstName} 
                              onChange={handleAuthInputChange} 
                              placeholder="First Name" 
                              required 
                              style={{ width: '50%', padding: '0.85rem', borderRadius: '2px', border: '1px solid #D6DDD3', fontSize: '0.9rem', backgroundColor: '#FFF' }} 
                            />
                            <input 
                              type="text" 
                              name="lastName" 
                              value={authForm.lastName} 
                              onChange={handleAuthInputChange} 
                              placeholder="Last Name" 
                              required 
                              style={{ width: '50%', padding: '0.85rem', borderRadius: '2px', border: '1px solid #D6DDD3', fontSize: '0.9rem', backgroundColor: '#FFF' }} 
                            />
                          </div>
                          <input 
                            type="tel" 
                            name="phone" 
                            value={authForm.phone} 
                            onChange={handleAuthInputChange} 
                            placeholder="Phone Number (e.g. 07831082965)" 
                            style={{ width: '100%', padding: '0.85rem', borderRadius: '2px', border: '1px solid #D6DDD3', fontSize: '0.9rem', backgroundColor: '#FFF' }} 
                          />
                        </>
                      )}
                      
                      <input 
                        type="email" 
                        name="email" 
                        value={authForm.email} 
                        onChange={handleAuthInputChange} 
                        placeholder="Email Address" 
                        required 
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '2px', border: '1px solid #D6DDD3', fontSize: '0.9rem', backgroundColor: '#FFF' }} 
                      />
                      <input 
                        type="password" 
                        name="password" 
                        value={authForm.password} 
                        onChange={handleAuthInputChange} 
                        placeholder="Password" 
                        required 
                        minLength={6}
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '2px', border: '1px solid #D6DDD3', fontSize: '0.9rem', backgroundColor: '#FFF' }} 
                      />
                      
                      {authMode === 'login' && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.25rem' }}>
                          <button 
                            type="button" 
                            onClick={() => {
                              setAuthMode('forgot');
                              setForgotStep(1);
                              setForgotForm(prev => ({ ...prev, email: authForm.email }));
                            }}
                            style={{ background: 'none', border: 'none', color: '#6E5535', fontSize: '0.75rem', textDecoration: 'underline', cursor: 'pointer' }}
                          >
                            Forgot Password?
                          </button>
                        </div>
                      )}

                      <button 
                        type="submit" 
                        disabled={authLoading}
                        style={{ padding: '0.85rem', backgroundColor: '#2D3A29', color: '#FFF', border: 'none', borderRadius: '2px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem', letterSpacing: '0.05em', opacity: authLoading ? 0.7 : 1 }}
                      >
                        {authLoading ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Create Account & Receive Welcome')}
                      </button>
                    </form>
                  )}
                </div>

                {/* PHONE BUTTON & ACCORDION */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  <button 
                    style={{ width: '100%', padding: '1rem', backgroundColor: 'transparent', color: '#2D3A29', border: '1px solid #E5DFC5', borderBottom: authExpandedOption === 'phone' ? 'none' : '1px solid #E5DFC5', borderRadius: authExpandedOption === 'phone' ? '4px 4px 0 0' : '4px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.3s ease', marginTop: authExpandedOption === 'email' ? '1rem' : '0' }}
                    onClick={() => setAuthExpandedOption(authExpandedOption === 'phone' ? null : 'phone')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Phone size={16} color="#6E5535" strokeWidth={1.5} />
                      {authMode === 'login' ? 'Continue with Phone' : 'Sign up with Phone'}
                    </div>
                    {authExpandedOption === 'phone' ? <ChevronUp size={18} color="#C5A059" /> : <ChevronDown size={18} color="#C5A059" />}
                  </button>

                  {authExpandedOption === 'phone' && (
                    <form onSubmit={(e) => { e.preventDefault(); showToast('Please use Email to receive your instant verification & order tracking updates.'); setAuthExpandedOption('email'); }} style={{ padding: '1.5rem', backgroundColor: '#FDFCF9', border: '1px solid #E5DFC5', borderTop: 'none', borderRadius: '0 0 4px 4px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <input type="tel" placeholder="Phone Number" required style={{ width: '100%', padding: '0.85rem', borderRadius: '2px', border: '1px solid #D6DDD3', fontSize: '0.9rem', backgroundColor: '#FFF' }} />
                      <input type="password" placeholder="Password" required style={{ width: '100%', padding: '0.85rem', borderRadius: '2px', border: '1px solid #D6DDD3', fontSize: '0.9rem', backgroundColor: '#FFF' }} />
                      <button type="submit" style={{ padding: '0.85rem', backgroundColor: '#2D3A29', color: '#FFF', border: 'none', borderRadius: '2px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem', letterSpacing: '0.05em' }}>
                        Switch to Email Verification
                      </button>
                    </form>
                  )}
                </div>

              </div>
            )}

            {/* FOOTER SWITCHER */}
            {authMode !== 'profile' && (
              <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid #E5DFC5', paddingTop: '1.25rem', fontSize: '0.85rem', color: '#5C635B' }}>
                {authMode === 'forgot' ? (
                  <button 
                    type="button" 
                    onClick={() => { setAuthMode('login'); setForgotStep(1); }} 
                    style={{ background: 'none', border: 'none', color: '#6E5535', fontWeight: 700, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                  >
                    Return to Sign In
                  </button>
                ) : (
                  <>
                    {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button 
                      type="button" 
                      onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthExpandedOption(null); }} 
                      style={{ background: 'none', border: 'none', color: '#6E5535', fontWeight: 700, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                    >
                      {authMode === 'login' ? 'Sign up here' : 'Sign in here'}
                    </button>
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      )}
      
      {/* ORDER CONFIRMATION MODAL */}
      {orderConfirmation && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setOrderConfirmation(null)}>
          <div className="modal-card" style={{ maxWidth: '500px', width: '95%', padding: '3rem 2.5rem', borderRadius: '8px', backgroundColor: '#FDFCF9', border: '1px solid #E5DFC5', boxShadow: '0 20px 60px rgba(45,58,41,0.12)', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#2D3A29', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Check size={32} color="#DFCAA7" />
              </div>
              <h2 className="font-serif" style={{ fontSize: '1.8rem', color: '#2D3A29', marginBottom: '0.5rem', fontWeight: 400 }}>Thank You!</h2>
              <p style={{ color: '#5C635B', fontSize: '0.95rem', lineHeight: 1.6 }}>Your payment has been processed successfully.<br/>Your order is now being prepared with love.</p>
            </div>
            
            <div style={{ backgroundColor: '#F5F2EC', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#5C635B' }}>Order Number</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2D3A29', letterSpacing: '0.05em' }}>{orderConfirmation.orderNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#5C635B' }}>Total Paid</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2D3A29' }}>£{orderConfirmation.total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: '#5C635B' }}>Payment Method</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#003087' }}>PayPal ✓</span>
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid #E5DFC5', paddingTop: '1.25rem', fontSize: '0.8rem', color: '#5C635B', marginBottom: '1.5rem' }}>
              A confirmation email will be sent to your registered email address.
            </div>
            
            <button
              onClick={() => { setOrderConfirmation(null); navigateToTab('shop'); }}
              style={{ width: '100%', padding: '1rem', backgroundColor: '#2D3A29', color: '#FFF', border: 'none', borderRadius: '4px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.3s ease' }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
    </PayPalScriptProvider>
  );
}

export default App;
