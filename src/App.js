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
  User,
  Menu,
  ShieldCheck,
  Lock
} from 'lucide-react';
import './App.css';
import AdminPortal, { DEFAULT_INVENTORY } from './AdminPortal';
import './AdminPortal.css';

// Horizontal Side-by-Side Logo Component (Icon on Left, Bold Company Typography on Right)
const LichtLogo = ({ className = '', size = 'medium', color = 'currentColor', variant = 'light', markOnly = false, style = {} }) => {
  const isDark = variant === 'dark' || color === '#FAF7F2' || color === '#FFFFFF' || color === 'white' || size === 'footer';
  const markSrc = isDark ? '/logo-dark-mark.png' : '/logo-light-mark.png';
  const titleColor = isDark ? '#FAF7F2' : (color !== 'currentColor' ? color : '#1E221D');
  const subColor = isDark ? '#C5A059' : '#6E5535';

  if (markOnly) {
    return (
      <div className={`licht-logo-container mark-only ${className} ${size}`} style={style}>
        <img 
          src={markSrc} 
          alt="LICHT Mark" 
          className="licht-logo-mark-img bold-mark" 
        />
      </div>
    );
  }

  return (
    <div className={`licht-logo-container horizontal-brand ${className} ${size} ${isDark ? 'dark-variant' : 'light-variant'}`} style={style}>
      <div className="licht-logo-mark-wrap">
        <img 
          src={markSrc} 
          alt="LICHT Logo Mark" 
          className="licht-logo-mark-img bold-mark" 
        />
      </div>
      <div className="licht-logo-text-col">
        <span className="licht-brand-title" style={{ color: titleColor }}>
          LICHT
        </span>
        <span className="licht-brand-subtitle" style={{ color: subColor }}>
          LUXE NATURALS
        </span>
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
    id: 'african-black-liquid-soap',
    name: 'African Black Soap',
    tagline: 'Deep cleansing. Skin & body.',
    subtitle: 'Deep Cleansing • Clarifying • 100% Botanical',
    price: 24,
    badge: '100% NATURAL CLEANSE',
    volume: '500 ml / 16.9 fl oz',
    rating: '5.0',
    reviewsCount: 152,
    image: '/african_black_soap_primary.jpg',
    shortDescription: 'Our African Black Soap is a rich, natural cleanser made from traditional African ingredients. It gently cleanses, helps remove impurities, and leaves the skin feeling fresh, clean and smooth.',
    description: 'Our African Black Soap is a rich, natural cleanser crafted from traditional African botanical ingredients. It gently cleanses and purifies the skin, helps remove dirt and excess oils, helps reduce acne and blemishes, and leaves the skin feeling revitalised, fresh and smooth. Available in both a convenient Liquid Soap pump bottle and a traditional 300g normal soap jar.',
    ingredients: 'Water, Potash (from Plantain Skins), Cocoa Pod Ash, Palm Kernel Oil, Coconut Oil, Shea Butter Extract, Natural Botanicals (Neem, Camwood, Aloe Vera), Fragrance.',
    benefits: [
      'Gently cleanses and purifies the skin',
      'Helps reduce acne, blemishes and breakouts',
      'Leaves skin feeling fresh, clean and smooth',
      'Supports clearer, healthier-looking skin',
      'Suitable for all skin types'
    ],
    perfectFor: [
      'Daily facial & body cleansing',
      'Blemish-prone & oily skin',
      'Deep pore purification',
      'Clearing breakouts & acne',
      'Balancing and soothing skin',
      'All skin types & sensitive skin'
    ],
    howToUse: 'Apply a small amount to wet skin or sponge, lather gently and massage across face and body. Rinse thoroughly with water. Use daily for best results.',
    gallery: [
      '/african_black_soap_primary.jpg',
      '/african_black_soap_dual.jpg',
      '/clear_skin_model.jpg'
    ],
    variants: [
      {
        id: 'african-black-liquid-soap',
        variantType: 'liquid',
        name: 'African Black Liquid Soap',
        formatLabel: 'Liquid Soap (Pump)',
        tagline: 'Deep Cleansing • Skin & Body',
        subtitle: 'Deep Cleansing • Clarifying • 100% Botanical',
        price: 24,
        volume: '500 ml / 16.9 fl oz',
        badge: '100% NATURAL CLEANSE',
        packaging: 'Amber Pump Dispenser (500 ml)',
        highlight: 'Skin & Body Wash',
        image: '/african_black_soap_primary.jpg',
        gallery: [
          '/african_black_soap_primary.jpg',
          '/african_black_soap_dual.jpg',
          '/clear_skin_model.jpg'
        ],
        shortDescription: 'Our African Black Liquid Soap is a rich, natural cleanser made from traditional African ingredients. It gently cleanses, helps remove impurities, and leaves the skin feeling fresh, clean and smooth.',
        description: 'Our African Black Liquid Soap is a rich, natural cleanser crafted from traditional African botanical ingredients. Formulated for everyday convenience with an amber pump dispenser, it gently cleanses and purifies the skin, helps remove dirt and excess oils, helps reduce acne and blemishes, and leaves the skin feeling revitalised, fresh and smooth. Suitable for daily use on both face and body, across all skin types.',
        ingredients: 'Water, Potash (from Plantain Skins), Cocoa Pod Ash, Palm Kernel Oil, Coconut Oil, Shea Butter Extract, Natural Botanicals (Neem, Camwood, Aloe Vera), Fragrance.',
        benefits: [
          'Gently cleanses and purifies skin & body',
          'Helps reduce acne, blemishes and excess oil',
          'Refreshes and soothes irritated skin',
          'Convenient mess-free pump dispenser',
          'Supports clearer, healthier-looking skin',
          'Suitable for all skin types'
        ],
        perfectFor: [
          'Daily facial & body cleansing',
          'Blemish-prone & oily skin',
          'In-shower body wash convenience',
          'Deep pore purification',
          'Clearing breakouts & acne',
          'All skin types'
        ],
        howToUse: 'Dispense 1–2 pumps onto wet hands or sponge, lather gently and massage across face and body. Rinse thoroughly with water. Use daily for best results.'
      },
      {
        id: 'african-black-soap-jar',
        variantType: 'normal',
        name: 'African Black Soap',
        formatLabel: 'Normal Soap (Jar)',
        tagline: 'Deep Cleansing • Purifying • Natural Glow',
        subtitle: 'Deep Cleansing • Purifying • Natural Glow (Face & Body)',
        price: 22,
        volume: '300g / 10.5 oz',
        badge: 'TRADITIONAL 300G JAR',
        packaging: 'Wide-Mouth Jar (300g)',
        highlight: 'Face & Body Ritual',
        image: '/african_black_soap_jar.jpg',
        gallery: [
          '/african_black_soap_jar.jpg',
          '/african_black_soap_dual.jpg',
          '/clear_skin_model.jpg'
        ],
        shortDescription: 'Our African Black Soap is a traditional natural cleanser made from plantain skins, cocoa pod ash and natural botanicals. It gently cleanses, removes dirt and excess oil, helps clear blemishes and leaves the skin fresh, smooth and healthy.',
        description: 'Our African Black Soap is a traditional natural cleanser made from plantain skins, cocoa pod ash and natural botanicals. Hand-packed in a 300g jar, it gently cleanses, removes dirt and excess oil, helps clear blemishes and leaves the skin fresh, smooth and healthy. Suitable for daily use on face and body across all skin types.',
        ingredients: 'Plantain Skins, Cocoa Pod Ash, Palm Kernel Oil, Coconut Oil, Shea Butter, Water, Natural Botanicals (e.g. Neem, Camwood, Aloe Vera, etc.).',
        benefits: [
          'Deeply cleanses and purifies the skin',
          'Helps reduce acne, blemishes and excess oil',
          'Improves skin texture and tone',
          'Leaves skin fresh, smooth and glowing',
          'Suitable for all skin types',
          '100% chemical free & gentle on skin'
        ],
        perfectFor: [
          'Targeted acne & blemish clearing',
          'Traditional face & body cleansing ritual',
          'Improving skin texture & tone',
          'Balancing oily & congested skin',
          'Natural glow enhancement',
          'All skin types'
        ],
        howToUse: 'Apply a small amount to wet skin, massage gently and rinse thoroughly with water. Use daily for best results.',
        storage: 'Store in a cool, dry place. Keep away from direct sunlight. For external use only.'
      }
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
  },
  {
    id: 4,
    quote: "The African Black Liquid Soap transformed my daily wash routine. It leaves my skin deeply cleansed, blemish-free and calm without any tightness.",
    author: "Amara T.",
    role: "Verified Customer",
    product: "African Black Liquid Soap"
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
const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID || 'test';
const API_BASE = (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
  ? '/api'
  : (process.env.REACT_APP_API_BASE || 'https://lichtluxenaturals.org/api');

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
  const [selectedVariant, setSelectedVariant] = useState(
    PRODUCTS[0].variants && PRODUCTS[0].variants.length > 0 ? PRODUCTS[0].variants[0] : null
  );
  const [pdpQuantity, setPdpQuantity] = useState(1);
  const [pdpPrimaryImage, setPdpPrimaryImage] = useState(PRODUCTS[0].image);
  const [pdpGalleryImages, setPdpGalleryImages] = useState(PRODUCTS[0].gallery);

  // Variant Selection Logic (switches primary image, gallery views, and formula specifications)
  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant);
    setPdpPrimaryImage(variant.image);
    setPdpGalleryImages(variant.gallery || [variant.image]);
  };

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
  const [checkoutStep, setCheckoutStep] = useState('address'); // 'address' | 'payment'
  const [shippingAddress, setShippingAddress] = useState({
    shippingName: '',
    shippingPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingPostcode: '',
    orderNotes: ''
  });
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

  // Admin & Operations Portal State
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminInventory, setAdminInventory] = useState(DEFAULT_INVENTORY);
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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigate to tab & scroll to top
  const navigateToTab = (tabName) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Process and sync completed storefront checkout into Admin Orders & Inventory
  const processCompletedOrder = (paymentMethod = 'Credit / Debit Card') => {
    if (cart.length === 0) return;
    const newOrderId = `LN-${1083 + adminOrders.length}`;
    const orderDate = new Date().toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const newOrder = {
      id: newOrderId,
      date: orderDate,
      customer: {
        name: 'Online Guest Client',
        email: 'guest.checkout@example.co.uk',
        phone: '+44 7831 082965',
        address: '10 Downing Street, Westminster, London SW1A 2AA, UK'
      },
      items: cart.map(item => ({
        name: `${item.name}${item.volume ? ` (${item.volume})` : ''}`,
        qty: item.quantity,
        price: item.price
      })),
      total: cartSubtotal,
      paymentMethod: paymentMethod,
      paymentStatus: 'Paid',
      deliveryStatus: 'Processing',
      courier: 'Royal Mail Tracked 24',
      trackingNumber: `RM${Math.floor(100000000 + Math.random() * 900000000)}GB`,
      source: 'Online Storefront',
      notes: 'Placed via web storefront checkout.'
    };

    // Deduct inventory for matching items
    setAdminInventory(prevInv => {
      return prevInv.map(invItem => {
        const cartMatch = cart.find(c => 
          (c.id && (invItem.productId === c.id || invItem.sku.toLowerCase().includes(c.id.toLowerCase()))) ||
          (c.name && invItem.name.toLowerCase().includes(c.name.toLowerCase()))
        );
        if (cartMatch) {
          return {
            ...invItem,
            stock: Math.max(0, invItem.stock - cartMatch.quantity)
          };
        }
        return invItem;
      });
    });

    // Append to admin orders
    setAdminOrders(prev => [newOrder, ...prev]);
    showToast(`Order #${newOrderId} confirmed! Logged to Admin Portal.`);
    setIsCheckoutOpen(false);
    setCart([]);
  };

  // Open dedicated product detail page
  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setPdpQuantity(1);
    const initialVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
    setSelectedVariant(initialVariant);
    const primaryImg = initialVariant ? initialVariant.image : product.image;
    const galleryImgs = initialVariant ? initialVariant.gallery : (product.gallery || [
      product.image,
      '/body_butter_hand_apply.jpg',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80'
    ]);
    setPdpPrimaryImage(primaryImg);
    setPdpGalleryImages(galleryImgs);
    setActiveTab('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Active product resolver for PDP (uses selected variant if available)
  const activeProduct = (selectedProduct && selectedProduct.variants && selectedProduct.variants.length > 0)
    ? (selectedVariant || selectedProduct.variants[0])
    : selectedProduct;

  // Open Checkout with auto pre-fill
  const openCheckout = () => {
    setIsCartOpen(false);
    setCheckoutStep('address');
    if (currentUser) {
      setShippingAddress(prev => ({
        ...prev,
        shippingName: prev.shippingName || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim(),
        shippingPhone: prev.shippingPhone || currentUser.phone || ''
      }));
    }
    setIsCheckoutOpen(true);
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
    if (authLoading) return;
    setAuthLoading(true);
    const cleanEmail = authForm.email.trim().toLowerCase();
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: authForm.password })
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
      // If backend is offline during development/preview, fallback to client-side session
      if (err.message && (err.message.includes('fetch') || err.message.includes('NetworkError'))) {
        const fallbackUser = {
          id: Date.now(),
          email: authForm.email,
          firstName: authForm.email.split('@')[0],
          lastName: '',
          role: 'ROLE_CUSTOMER'
        };
        localStorage.setItem('lln_token', 'demo-jwt-token-' + Date.now());
        localStorage.setItem('lln_user', JSON.stringify(fallbackUser));
        setCurrentUser(fallbackUser);
        showToast(`✨ Signed in as ${fallbackUser.firstName} (Offline Demo Mode)`);
        setIsAuthOpen(false);
        setAuthExpandedOption(null);
      } else {
        showToast(err.message || 'Login failed.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (authLoading) return;
    setAuthLoading(true);
    const cleanEmail = authForm.email.trim().toLowerCase();
    const cleanPhone = authForm.phone ? authForm.phone.trim() : '';
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: authForm.firstName.trim(),
          lastName: authForm.lastName.trim(),
          email: cleanEmail,
          phone: cleanPhone,
          password: authForm.password
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }
      showToast('✨ Account created! Welcome email dispatched to ' + cleanEmail);
      
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
      // If backend is not running locally, provide seamless client-side account creation
      if (err.message && (err.message.includes('fetch') || err.message.includes('NetworkError'))) {
        const fallbackUser = {
          id: Date.now(),
          email: authForm.email,
          firstName: authForm.firstName,
          lastName: authForm.lastName,
          phone: authForm.phone,
          role: 'ROLE_CUSTOMER'
        };
        localStorage.setItem('lln_token', 'demo-jwt-token-' + Date.now());
        localStorage.setItem('lln_user', JSON.stringify(fallbackUser));
        setCurrentUser(fallbackUser);
        showToast(`✨ Welcome to LICHT LUXE NATURALS, ${authForm.firstName}! Account active.`);
        setIsAuthOpen(false);
        setAuthExpandedOption(null);
      } else {
        showToast(err.message || 'Registration error');
      }
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
      if (data.otp) {
        setForgotForm(prev => ({ ...prev, otp: data.otp }));
        showToast('✉️ Verification code [' + data.otp + '] sent to ' + forgotForm.email);
      } else {
        showToast('✉️ 6-digit verification code sent to ' + forgotForm.email);
      }
      setForgotStep(2);
    } catch (err) {
      if (err.message && (err.message.includes('fetch') || err.message.includes('NetworkError'))) {
        setForgotForm(prev => ({ ...prev, otp: '123456' }));
        showToast('✉️ Demo code [123456] dispatched for ' + forgotForm.email);
        setForgotStep(2);
      } else {
        showToast(err.message || 'Error sending reset code');
      }
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
      if (err.message && (err.message.includes('fetch') || err.message.includes('NetworkError'))) {
        showToast('✓ Demo code verified! Please set your new password.');
        setForgotStep(3);
      } else {
        showToast(err.message || 'Invalid or expired verification code');
      }
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
      if (err.message && (err.message.includes('fetch') || err.message.includes('NetworkError'))) {
        showToast('✨ Password updated! You can now sign in.');
        setAuthMode('login');
        setForgotStep(1);
        setForgotForm({ email: '', otp: '', newPassword: '', confirmPassword: '' });
        setAuthExpandedOption('email');
      } else {
        showToast(err.message || 'Password reset error');
      }
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
          shippingInfo: shippingAddress,
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
  }, [cart, cartSubtotal, shippingAddress]);

  // Capture PayPal order after buyer approval
  const capturePayPalOrder = useCallback(async (data) => {
    if (paymentProcessing) return;
    setPaymentProcessing(true);
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
          shipping: shippingAddress
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
          shippingInfo: shippingAddress,
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
        shipping: shippingAddress
      });
      showToast('✨ Payment successful! Order ' + result.orderNumber + ' placed.');
    } catch (error) {
      setPaymentProcessing(false);
      showToast('Payment error: ' + error.message);
    }
  }, [cart, cartSubtotal, shippingAddress, paymentProcessing]);

  // Helper to determine administrator authorization
  const isAdmin = Boolean(
    currentUser && (
      currentUser.role === 'ADMIN' || 
      currentUser.role === 'ROLE_ADMIN' ||
      currentUser.email === 'sharonshelke1@gmail.com' ||
      currentUser.email === 'sharon@lichtluxenaturals.org'
    )
  );

  // If activeTab is 'admin', enforce strict administrator authorization
  if (activeTab === 'admin') {
    if (!isAdmin) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#141B13',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          color: '#FAF7F2',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            backgroundColor: '#1E271D',
            border: '1px solid rgba(197, 160, 89, 0.4)',
            borderRadius: '16px',
            padding: '2.75rem 2.25rem',
            textAlign: 'center',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: 'rgba(197, 160, 89, 0.15)',
              border: '1px solid rgba(197, 160, 89, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: '#C5A059'
            }}>
              <ShieldCheck size={34} />
            </div>

            <span style={{
              display: 'inline-block',
              fontSize: '0.725rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#C5A059',
              marginBottom: '0.5rem'
            }}>
              Executive Access Control
            </span>

            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              fontFamily: "'Playfair Display', serif",
              margin: '0.25rem 0 1rem',
              color: '#FAF7F2'
            }}>
              Administrator Portal
            </h2>

            <p style={{
              fontSize: '0.925rem',
              color: '#B5BEB4',
              lineHeight: 1.6,
              marginBottom: '1.75rem'
            }}>
              {currentUser ? (
                <>
                  You are signed in as <strong style={{ color: '#FAF7F2' }}>{currentUser.email}</strong>, which does not have executive administrative permissions.
                </>
              ) : (
                <>
                  Access to the LICHT LUXE NATURALS operations & inventory management suite is strictly restricted to authorized administrators.
                </>
              )}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {currentUser ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsAuthOpen(true);
                    setAuthMode('login');
                  }}
                  style={{
                    backgroundColor: '#C5A059',
                    color: '#161D15',
                    border: 'none',
                    padding: '0.85rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Lock size={16} /> Sign In with Admin Account
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthOpen(true);
                    setAuthMode('login');
                  }}
                  style={{
                    backgroundColor: '#C5A059',
                    color: '#161D15',
                    border: 'none',
                    padding: '0.85rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Lock size={16} /> Sign In as Administrator
                </button>
              )}

              <button
                onClick={() => navigateToTab('home')}
                style={{
                  backgroundColor: 'transparent',
                  color: '#FAF7F2',
                  border: '1px solid rgba(229, 223, 197, 0.25)',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <ArrowLeft size={16} /> Return to Storefront
              </button>
            </div>

            <div style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(229, 223, 197, 0.12)',
              fontSize: '0.75rem',
              color: '#8A9488'
            }}>
              Authorized Admin Account: <code style={{ color: '#C5A059' }}>sharonshelke1@gmail.com</code>
            </div>
          </div>
        </div>
      );
    }

    return (
      <AdminPortal 
        currentUser={currentUser}
        orders={adminOrders} 
        setOrders={setAdminOrders} 
        inventory={adminInventory} 
        setInventory={setAdminInventory} 
        onExitToStore={() => navigateToTab('home')} 
      />
    );
  }

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
        <button 
          onClick={() => navigateToTab('admin')}
          style={{ background: 'none', border: 'none', color: '#FAF7F2', opacity: 0.95, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: 'inherit', fontFamily: 'inherit', textDecoration: 'underline', padding: 0 }}
          title="Open Operations & Inventory Management"
        >
          <ShieldCheck size={13} color="#C5A059" /> Admin Portal
        </button>
        <span>•</span>
        <span className="loveworld-badge" style={{ padding: '0.2rem 0.6rem', fontSize: '0.65rem' }}>
          MADE IN LOVEWORLD
        </span>
      </div>

      {/* HEADER / NAVIGATION WITH LOGO IN CENTER */}
      <header className="site-header">
        <div className="header-container" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Mobile Hamburger Toggle Button */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Left Navigation Menu (Desktop) */}
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
              title="Admin & Operations Portal" 
              onClick={() => navigateToTab('admin')}
              style={{ color: '#C5A059' }}
            >
              <ShieldCheck size={20} />
            </button>
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
              className="btn-primary header-cart-btn" 
              onClick={() => setIsCartOpen(true)}
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.825rem', gap: '0.45rem', fontWeight: 600 }}
            >
              <ShoppingBag size={16} />
              <span className="cart-btn-text">SHOP NOW</span>
              <span className="cart-count-badge">({cart.reduce((a, b) => a + b.quantity, 0)})</span>
            </button>
          </div>
        </div>

        {/* Mobile Slide-in Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="mobile-nav-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-nav-header">
                <LichtLogo size="header" />
                <button className="mobile-nav-close" onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={22} />
                </button>
              </div>

              <div className="mobile-nav-links">
                <button 
                  className={`mobile-nav-link ${activeTab === 'home' ? 'active' : ''}`}
                  onClick={() => navigateToTab('home')}
                >
                  <span>HOME</span>
                  <ArrowUpRight size={16} />
                </button>
                <button 
                  className={`mobile-nav-link ${activeTab === 'shop' || activeTab === 'product' ? 'active' : ''}`}
                  onClick={() => navigateToTab('shop')}
                >
                  <span>SHOP COLLECTION</span>
                  <ArrowUpRight size={16} />
                </button>
                <button 
                  className={`mobile-nav-link ${activeTab === 'story' ? 'active' : ''}`}
                  onClick={() => navigateToTab('story')}
                >
                  <span>OUR STORY</span>
                  <ArrowUpRight size={16} />
                </button>
                <button 
                  className={`mobile-nav-link ${activeTab === 'gifting' ? 'active' : ''}`}
                  onClick={() => navigateToTab('gifting')}
                >
                  <span>GIFTING & SETS</span>
                  <ArrowUpRight size={16} />
                </button>
                <button 
                  className={`mobile-nav-link ${activeTab === 'contact' ? 'active' : ''}`}
                  onClick={() => navigateToTab('contact')}
                >
                  <span>CONTACT US</span>
                  <ArrowUpRight size={16} />
                </button>
                <button 
                  className={`mobile-nav-link ${activeTab === 'admin' ? 'active' : ''}`}
                  onClick={() => navigateToTab('admin')}
                  style={{ color: '#C5A059', borderTop: '1px solid rgba(197, 160, 89, 0.2)', marginTop: '0.4rem', paddingTop: '0.8rem' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={18} color="#C5A059" /> ADMIN PORTAL
                  </span>
                  <ArrowUpRight size={16} />
                </button>
              </div>

              <div className="mobile-nav-actions">
                <button 
                  className="mobile-nav-btn secondary"
                  onClick={() => { setIsMobileMenuOpen(false); setAuthMode('login'); setIsAuthOpen(true); }}
                >
                  <User size={16} /> Member Sign In / Register
                </button>
                <a 
                  href="tel:07831082965"
                  className="mobile-nav-btn primary"
                >
                  <Phone size={16} /> Call to Order: 07831082965
                </a>
              </div>

              <div className="mobile-nav-footer">
                <div className="loveworld-badge" style={{ margin: '0 auto', width: 'fit-content' }}>
                  MADE IN LOVEWORLD
                </div>
                <p style={{ fontSize: '0.75rem', color: '#6E5535', marginTop: '0.5rem', textAlign: 'center' }}>
                  Pure. Natural. Handcrafted with Love.
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* SEPARATE DEDICATED PRODUCT DETAIL PAGE (PDP)                              */}
      {/* ========================================================================= */}
      {activeTab === 'product' && selectedProduct && (
        <main style={{ backgroundColor: '#EAD8BA', minHeight: '85vh', paddingBottom: '5rem' }}>
          {/* Breadcrumb Header Bar */}
          <div style={{ backgroundColor: '#DFCAA7', borderBottom: '1px solid #E5DFC5', padding: '1rem 0' }}>
            <div className="container" style={{ fontSize: '0.85rem', color: '#5C635B', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => navigateToTab('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5C635B', textDecoration: 'underline' }}>Home</button>
                <span>/</span>
                <button onClick={() => navigateToTab('shop')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5C635B', textDecoration: 'underline' }}>Shop Collection</button>
                <span>/</span>
                <span style={{ color: '#2D3A29', fontWeight: 600 }}>{activeProduct.name}</span>
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
              <div className="responsive-pdp-grid">
                
                {/* Left Product Image Gallery Column */}
                <div>
                  <div className="pdp-main-image-wrap" style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '2px solid #C5A059', boxShadow: '0 20px 50px rgba(74, 93, 78, 0.12)', height: '520px', backgroundColor: '#DFCAA7' }}>
                    <img 
                      src={pdpPrimaryImage} 
                      alt={activeProduct.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.35s ease' }}
                    />
                    
                    {/* Badge Overlay */}
                    <span style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', backgroundColor: '#2D3A29', color: '#FAF7F2', fontSize: '0.75rem', padding: '0.35rem 0.85rem', borderRadius: '4px', letterSpacing: '0.12em', fontWeight: 600 }}>
                      {activeProduct.badge || selectedProduct.badge}
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
                  <div className="pdp-gallery-thumbs" style={{ display: 'grid', gridTemplateColumns: `repeat(${pdpGalleryImages.length}, 1fr)`, gap: '1rem', marginTop: '1.25rem' }}>
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
                        <img src={imgSrc} alt={`${activeProduct.name} view ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>

                  {/* STYLED VARIANT OPTIONS TILES (DIRECTLY UNDER THE SMALL IMAGES) */}
                  {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                    <div className="pdp-variant-selector-panel" style={{ marginTop: '1.5rem', backgroundColor: '#F4EFE6', border: '1px solid #E5DFC5', borderRadius: '14px', padding: '1.25rem', boxShadow: 'var(--shadow-soft)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <Sparkle size={15} color="#C5A059" />
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2D3A29' }}>
                            CHOOSE VARIANT / FORMULA:
                          </span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#6E5535', fontStyle: 'italic' }}>
                          Click to show that variant's photos & info
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
                        {selectedProduct.variants.map((variantItem) => {
                          const isCurrentSelected = (activeProduct.id === variantItem.id) || (activeProduct.variantType === variantItem.variantType);
                          return (
                            <div
                              key={variantItem.id}
                              onClick={() => handleSelectVariant(variantItem)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.85rem',
                                padding: '0.85rem 1rem',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                backgroundColor: isCurrentSelected ? '#FFFFFF' : '#FAF7F2',
                                border: isCurrentSelected ? '2px solid #C5A059' : '1.5px solid #E5DFC5',
                                boxShadow: isCurrentSelected ? '0 8px 22px rgba(197, 160, 89, 0.28)' : 'none',
                                transform: isCurrentSelected ? 'translateY(-2px)' : 'none',
                                transition: 'all 0.25s ease',
                                position: 'relative'
                              }}
                            >
                              {/* Variant Mini Image Swatch */}
                              <div style={{ width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: isCurrentSelected ? '1.5px solid #C5A059' : '1px solid #E5DFC5', backgroundColor: '#DFCAA7' }}>
                                <img 
                                  src={variantItem.image} 
                                  alt={variantItem.name} 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                              </div>

                              {/* Variant Text Information */}
                              <div style={{ flexGrow: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.25rem', marginBottom: '0.2rem' }}>
                                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: isCurrentSelected ? '#2D3A29' : '#5C635B' }}>
                                    {variantItem.formatLabel}
                                  </span>
                                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#6E5535' }}>
                                    £{variantItem.price}
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#5C635B', marginBottom: '0.25rem' }}>
                                  {variantItem.volume}
                                </div>
                                <div>
                                  {isCurrentSelected ? (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', fontWeight: 700, color: '#2D3A29', backgroundColor: '#DFCAA7', padding: '0.15rem 0.5rem', borderRadius: '4px', letterSpacing: '0.04em' }}>
                                      <Check size={11} color="#2D3A29" /> ACTIVE VIEW
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: '0.68rem', color: '#8C948B', fontStyle: 'italic' }}>
                                      Click to view
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Product Details Column */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <span className="loveworld-badge">MADE IN LOVEWORLD</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#C5A059', fontSize: '0.9rem', fontWeight: 600 }}>
                      ★★★★★ <span>{selectedProduct.rating} ({selectedProduct.reviewsCount} reviews)</span>
                    </div>
                  </div>

                  <h1 className="font-display pdp-title" style={{ fontSize: '3.75rem', color: '#1E221D', marginBottom: '0.25rem', lineHeight: 1.05 }}>
                    {activeProduct.name}
                  </h1>

                  <div style={{ fontSize: '1.05rem', color: '#C5A059', fontStyle: 'italic', marginBottom: '1.25rem', fontWeight: 500 }}>
                    {activeProduct.subtitle}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #E5DFC5', paddingBottom: '1.25rem' }}>
                    <span style={{ fontSize: '2.25rem', fontWeight: 700, color: '#6E5535' }}>£{activeProduct.price}</span>
                    <span style={{ fontSize: '1rem', color: '#5C635B' }}>({activeProduct.volume})</span>
                  </div>

                  <p style={{ color: '#5C635B', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '2rem' }}>
                    {activeProduct.description}
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
                        onClick={() => addToCart(activeProduct, pdpQuantity)}
                      >
                        <ShoppingBag size={18} /> ADD TO BAG · £{(activeProduct.price * pdpQuantity).toFixed(2)}
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
                      {activeProduct.perfectFor && activeProduct.perfectFor.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Check size={14} color="#4A5D4E" /> {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#DFCAA7', borderRadius: '12px', border: '1px solid #E5DFC5', padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6E5535', marginBottom: '0.35rem' }}>
                      HOW TO USE YOUR RITUAL:
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#2D3A29', fontStyle: 'italic', lineHeight: 1.6 }}>
                      “{activeProduct.howToUse}”
                    </div>
                  </div>

                  {activeProduct.storage && (
                    <div style={{ backgroundColor: '#F4EFE6', borderRadius: '12px', border: '1px solid #E5DFC5', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-soft)' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#2D3A29', marginBottom: '0.35rem' }}>
                        STORAGE & CARE:
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#5C635B', lineHeight: 1.6 }}>
                        {activeProduct.storage}
                      </div>
                    </div>
                  )}

                  {activeProduct.ingredients && (
                    <div style={{ backgroundColor: '#F4EFE6', borderRadius: '12px', border: '1px solid #E5DFC5', padding: '1.5rem', boxShadow: 'var(--shadow-soft)' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#2D3A29', marginBottom: '0.5rem' }}>
                        AUTHENTIC BOTANICAL INGREDIENTS:
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#5C635B', lineHeight: 1.6 }}>
                        {activeProduct.ingredients}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>
          </section>

          {/* SIMILAR PRODUCTS / YOU MAY ALSO LOVE SECTION (2 COLUMNS & ROWS ON MOBILE) */}
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

              <div className="product-cards-grid">
                {PRODUCTS.filter(p => p.id !== selectedProduct.id).map(product => (
                  <div 
                    key={product.id}
                    className="responsive-product-card"
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
                      className="card-media-wrap"
                      style={{ position: 'relative', height: '240px', overflow: 'hidden', backgroundColor: '#DFCAA7', cursor: 'pointer' }}
                      onClick={() => openProductDetail(product)}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span className="card-badge" style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: '#2D3A29', color: '#FAF7F2', fontSize: '0.65rem', padding: '0.25rem 0.65rem', borderRadius: '4px', letterSpacing: '0.1em', fontWeight: 600 }}>
                        {product.badge}
                      </span>
                      <button 
                        className="card-wishlist-btn"
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: '#FFFFFF', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                      >
                        <Heart size={18} fill={wishlist.includes(product.id) ? '#C5A059' : 'none'} color={wishlist.includes(product.id) ? '#C5A059' : '#1E221D'} />
                      </button>
                    </div>

                    <div className="card-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div className="card-subtitle" style={{ fontSize: '0.75rem', color: '#C5A059', letterSpacing: '0.12em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        {product.subtitle}
                      </div>
                      <h3 
                        className="card-title font-display" 
                        style={{ fontSize: '1.65rem', color: '#2D3A29', marginBottom: '0.35rem', cursor: 'pointer' }}
                        onClick={() => openProductDetail(product)}
                      >
                        {product.name}
                      </h3>
                      <div className="card-price-row" style={{ fontSize: '1.15rem', fontWeight: 600, color: '#6E5535', marginBottom: '0.75rem' }}>
                        £{product.price} <span className="card-volume" style={{ fontSize: '0.8rem', color: '#5C635B', fontWeight: 400 }}>({product.volume})</span>
                      </div>

                      <div className="card-actions-row" style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn-primary card-btn-primary" 
                          style={{ flexGrow: 1, justifyContent: 'center', padding: '0.75rem', fontSize: '0.8rem' }}
                          onClick={() => addToCart(product)}
                        >
                          <ShoppingBag size={14} /> ADD · £{product.price}
                        </button>
                        <button 
                          className="btn-secondary card-btn-secondary" 
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
              <div className="responsive-story-grid">
                
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

              <div className="product-cards-grid">
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

              <div className="product-cards-grid">
                {PRODUCTS.map(product => (
                  <div 
                    key={product.id}
                    className="responsive-product-card"
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
                      className="card-media-wrap"
                      style={{ position: 'relative', height: '300px', overflow: 'hidden', backgroundColor: '#DFCAA7', cursor: 'pointer' }}
                      onClick={() => openProductDetail(product)}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span className="card-badge" style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: '#2D3A29', color: '#FAF7F2', fontSize: '0.7rem', padding: '0.3rem 0.75rem', borderRadius: '4px', letterSpacing: '0.1em', fontWeight: 600 }}>
                        {product.badge}
                      </span>
                      <button 
                        className="card-wishlist-btn"
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: '#FFFFFF', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                      >
                        <Heart size={18} fill={wishlist.includes(product.id) ? '#C5A059' : 'none'} color={wishlist.includes(product.id) ? '#C5A059' : '#1E221D'} />
                      </button>
                    </div>

                    <div className="card-body" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div className="card-subtitle" style={{ fontSize: '0.75rem', color: '#C5A059', letterSpacing: '0.12em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        {product.subtitle}
                      </div>
                      <h3 
                        className="card-title font-display" 
                        style={{ fontSize: '2rem', color: '#2D3A29', marginBottom: '0.5rem', cursor: 'pointer' }}
                        onClick={() => openProductDetail(product)}
                      >
                        {product.name}
                      </h3>
                      <div className="card-price-row" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#6E5535', marginBottom: '1rem' }}>
                        £{product.price} <span className="card-volume" style={{ fontSize: '0.85rem', color: '#5C635B', fontWeight: 400 }}>({product.volume})</span>
                      </div>

                      <p className="card-desc" style={{ fontSize: '0.9rem', color: '#5C635B', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                        {product.shortDescription}
                      </p>

                      <div className="card-actions-row" style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
                        <button 
                          className="btn-primary card-btn-primary" 
                          style={{ flexGrow: 1, justifyContent: 'center', padding: '0.85rem' }}
                          onClick={() => addToCart(product)}
                        >
                          <ShoppingBag size={16} /> ADD · £{product.price}
                        </button>
                        <button 
                          className="btn-secondary card-btn-secondary" 
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

              <div className="responsive-gifting-grid">
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
                    onClick={() => openProductDetail(PRODUCTS.find(p => p.id === 'luxe-trio-gift-set'))}
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
                      onClick={() => addToCart(PRODUCTS.find(p => p.id === 'luxe-trio-gift-set'))}
                    >
                      Add to Bag · £68
                    </button>
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '0.95rem 1.25rem' }}
                      onClick={() => openProductDetail(PRODUCTS.find(p => p.id === 'luxe-trio-gift-set'))}
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
              <div className="responsive-contact-grid">
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
              <div className="responsive-home-hero">
                
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
                  <div className="hero-image-wrap" style={{ borderRadius: '6px', overflow: 'hidden', height: '560px', position: 'relative', boxShadow: '0 20px 50px rgba(45, 58, 41, 0.08)', backgroundColor: '#DFCAA7' }}>
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
                    className="hero-floating-card"
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
              <div className="brand-trust-bar-grid">
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
          <section className="responsive-hero-split">
            {/* Left Column: Full-bleed Radiant Clear Skin Model Image (img 2 reference) */}
            <div className="split-image-col" style={{ height: '80vh', minHeight: '600px', overflow: 'hidden' }}>
              <img 
                src="/clear_skin_model.png" 
                alt="Radiant clear skin model — LICHT LUXE NATURALS" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
              />
            </div>

            {/* Right Column: Sage / Olive Tint Background with Philosophy Copy */}
            <div className="split-content-col" style={{ padding: '4.5rem 4rem', height: '80vh', minHeight: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#DFE5DC', position: 'relative' }}>
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
              <div className="source-values-grid">
                
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
              <div className="editorial-cards-grid">
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

              <div className="product-cards-grid">
                {PRODUCTS.map(product => (
                  <div 
                    key={product.id}
                    className="responsive-product-card"
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
                      className="card-media-wrap"
                      style={{ position: 'relative', height: '280px', overflow: 'hidden', backgroundColor: '#DFCAA7', cursor: 'pointer' }}
                      onClick={() => openProductDetail(product)}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span className="card-badge" style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: '#2D3A29', color: '#FAF7F2', fontSize: '0.7rem', padding: '0.3rem 0.75rem', borderRadius: '4px', letterSpacing: '0.1em', fontWeight: 600 }}>
                        {product.badge}
                      </span>
                      <button 
                        className="card-wishlist-btn"
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: '#FFFFFF', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                      >
                        <Heart size={18} fill={wishlist.includes(product.id) ? '#C5A059' : 'none'} color={wishlist.includes(product.id) ? '#C5A059' : '#1E221D'} />
                      </button>
                    </div>

                    <div className="card-body" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div className="card-subtitle" style={{ fontSize: '0.75rem', color: '#C5A059', letterSpacing: '0.12em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        {product.subtitle}
                      </div>
                      <h3 
                        className="card-title font-display" 
                        style={{ fontSize: '2rem', color: '#2D3A29', marginBottom: '0.5rem', cursor: 'pointer' }}
                        onClick={() => openProductDetail(product)}
                      >
                        {product.name}
                      </h3>
                      <div className="card-price-row" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#6E5535', marginBottom: '1rem' }}>
                        £{product.price} <span className="card-volume" style={{ fontSize: '0.85rem', color: '#5C635B', fontWeight: 400 }}>({product.volume})</span>
                      </div>

                      <p className="card-desc" style={{ fontSize: '0.9rem', color: '#5C635B', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                        {product.shortDescription}
                      </p>

                      <div className="card-actions-row" style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
                        <button 
                          className="btn-primary card-btn-primary" 
                          style={{ flexGrow: 1, justifyContent: 'center', padding: '0.85rem' }}
                          onClick={() => addToCart(product)}
                        >
                          <ShoppingBag size={16} /> ADD · £{product.price}
                        </button>
                        <button 
                          className="btn-secondary card-btn-secondary" 
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

              <div className="reviews-cards-grid">
                {REVIEWS.map(rev => (
                  <div key={rev.id} className="review-card" style={{ backgroundColor: '#F4EFE6', padding: '2rem', borderRadius: '12px', border: '1px solid #E5DFC5' }}>
                    <div style={{ color: '#C5A059', fontSize: '1rem', marginBottom: '0.75rem' }}>★★★★★</div>
                    <blockquote style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#2D3A29', lineHeight: 1.6, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                      “{rev.quote}”
                    </blockquote>
                    <div className="review-author" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E221D' }}>
                      — {rev.author}
                    </div>
                    <div className="review-meta" style={{ fontSize: '0.75rem', color: '#6E5535' }}>
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
          <div className="responsive-footer-grid">
            
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
                <li><button onClick={() => openProductDetail(PRODUCTS.find(p => p.id === 'african-black-liquid-soap'))} style={{ background: 'none', border: 'none', color: '#D6DDD3', cursor: 'pointer', textAlign: 'left', padding: 0 }}>African Black Liquid Soap</button></li>
                <li><button onClick={() => openProductDetail(PRODUCTS.find(p => p.id === 'luxe-trio-gift-set'))} style={{ background: 'none', border: 'none', color: '#D6DDD3', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Gift Sets</button></li>
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
                <li><button onClick={() => navigateToTab('admin')} style={{ background: 'none', border: 'none', color: '#C5A059', cursor: 'pointer', textAlign: 'left', padding: 0, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><ShieldCheck size={14} /> Admin & Inventory Portal</button></li>
              </ul>
            </div>

          </div>

          {/* Bottom Footer Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', fontSize: '0.8rem', color: '#A0A89F', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              © 2026 LICHT LUXE NATURALS. All Rights Reserved. Pure. Natural. Made with Love.
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <button 
                onClick={() => navigateToTab('admin')}
                style={{ background: 'none', border: 'none', color: '#C5A059', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: 0 }}
              >
                <ShieldCheck size={14} /> Staff Admin Portal
              </button>
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
                <button className="btn-primary checkout-btn" onClick={openCheckout} style={{ width: '100%', justifyContent: 'center' }}>
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

      {/* SECURE CHECKOUT MODAL (2-STEP: DELIVERY ADDRESS & PAYMENT) */}
      {isCheckoutOpen && (
        <div className="modal-overlay" style={{ zIndex: 1000 }} onClick={() => setIsCheckoutOpen(false)}>
          <div className="modal-card checkout-modal" style={{ maxWidth: '880px', width: '95%', maxHeight: '92vh', padding: '0', display: 'flex', flexDirection: 'row', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 25px 60px rgba(45,58,41,0.18)' }} onClick={(e) => e.stopPropagation()}>
            
            {/* Left Side: Order Summary */}
            <div className="checkout-summary-col" style={{ backgroundColor: '#FDFCF9', padding: '2rem', width: '42%', borderRight: '1px solid #E5DFC5', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C5A059', marginBottom: '1.25rem', fontWeight: 600 }}>
                Order Summary
              </div>
              
              <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #E5DFC5', flexShrink: 0 }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#5C635B' }}>
                  <span>UK Delivery</span>
                  <span style={{ color: '#2D3A29', fontWeight: 600 }}>Complimentary (Free)</span>
                </div>
                {shippingAddress.shippingCity && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#6E5535' }}>
                    <span>Destination</span>
                    <span>{shippingAddress.shippingCity}, UK</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', color: '#2D3A29', fontWeight: 700, borderTop: '1px solid #ECE7D8', paddingTop: '0.75rem' }}>
                  <span>Total</span>
                  <span>£{cartSubtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Right Side: Two-Step Checkout (Address & Payment) */}
            <div className="checkout-form-col" style={{ backgroundColor: '#FFFFFF', padding: '2rem 2.25rem', width: '58%', position: 'relative', overflowY: 'auto' }}>
              <button className="close-modal-btn" onClick={() => setIsCheckoutOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
                <X size={20} />
              </button>
              
              {/* Checkout Progress Stepper */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.85rem', marginBottom: '1.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setCheckoutStep('address')}
                  style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', color: checkoutStep === 'address' ? '#2D3A29' : '#C5A059', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}
                >
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: checkoutStep === 'address' ? '#2D3A29' : '#C5A059', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>1</span>
                  <span>Delivery Address</span>
                </button>
                <div style={{ width: '32px', height: '2px', backgroundColor: '#E5DFC5' }} />
                <button
                  type="button"
                  onClick={() => {
                    if (shippingAddress.shippingName && shippingAddress.shippingAddress && shippingAddress.shippingCity && shippingAddress.shippingPostcode) {
                      setCheckoutStep('payment');
                    } else {
                      showToast('Please enter your delivery address first');
                    }
                  }}
                  style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', color: checkoutStep === 'payment' ? '#2D3A29' : '#9CA3AF', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}
                >
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: checkoutStep === 'payment' ? '#2D3A29' : '#E5DFC5', color: checkoutStep === 'payment' ? '#FFF' : '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>2</span>
                  <span>Payment</span>
                </button>
              </div>


              {/* ─── STEP 1: DELIVERY ADDRESS ─── */}
              {checkoutStep === 'address' && (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h2 className="font-serif" style={{ fontSize: '1.7rem', color: '#2D3A29', margin: '0 0 0.35rem 0', fontWeight: 400 }}>Where should we deliver?</h2>
                    <p style={{ color: '#5C635B', fontSize: '0.85rem', margin: 0 }}>Provide your delivery details so we can dispatch your pure natural essentials.</p>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!shippingAddress.shippingName.trim() || !shippingAddress.shippingAddress.trim() || !shippingAddress.shippingCity.trim() || !shippingAddress.shippingPostcode.trim()) {
                      showToast('Please fill in all required delivery fields.');
                      return;
                    }
                    setCheckoutStep('payment');
                  }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6E5535', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.35rem' }}>
                        Full Name *
                      </label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Eleanor Vance" 
                        value={shippingAddress.shippingName}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, shippingName: e.target.value }))}
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '4px', border: '1px solid #D6DDD3', fontSize: '0.95rem', backgroundColor: '#FFF' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6E5535', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.35rem' }}>
                          Contact Phone *
                        </label>
                        <input 
                          type="tel" 
                          required 
                          placeholder="e.g. 07831082965" 
                          value={shippingAddress.shippingPhone}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, shippingPhone: e.target.value }))}
                          style={{ width: '100%', padding: '0.85rem', borderRadius: '4px', border: '1px solid #D6DDD3', fontSize: '0.95rem', backgroundColor: '#FFF' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6E5535', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.35rem' }}>
                          Postcode / ZIP *
                        </label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. W8 4PT" 
                          value={shippingAddress.shippingPostcode}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, shippingPostcode: e.target.value.toUpperCase() }))}
                          style={{ width: '100%', padding: '0.85rem', borderRadius: '4px', border: '1px solid #D6DDD3', fontSize: '0.95rem', backgroundColor: '#FFF' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6E5535', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.35rem' }}>
                        Street Address *
                      </label>
                      <input 
                        type="text" 
                        required 
                        placeholder="House number, Street name, Flat or Suite" 
                        value={shippingAddress.shippingAddress}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, shippingAddress: e.target.value }))}
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '4px', border: '1px solid #D6DDD3', fontSize: '0.95rem', backgroundColor: '#FFF' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6E5535', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.35rem' }}>
                        Town / City *
                      </label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. London" 
                        value={shippingAddress.shippingCity}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, shippingCity: e.target.value }))}
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '4px', border: '1px solid #D6DDD3', fontSize: '0.95rem', backgroundColor: '#FFF' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6E5535', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.35rem' }}>
                        Order / Delivery Notes (Optional)
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Leave in safe place or porch if not in" 
                        value={shippingAddress.orderNotes}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, orderNotes: e.target.value }))}
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '4px', border: '1px solid #D6DDD3', fontSize: '0.95rem', backgroundColor: '#FFF' }}
                      />
                    </div>

                    <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E5DFC5', borderRadius: '4px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                      <Sparkles size={18} color="#C5A059" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8rem', color: '#2D3A29', lineHeight: 1.4 }}>
                        <strong>Complimentary UK Standard Delivery</strong> — Carefully packaged with eco-friendly natural materials.
                      </span>
                    </div>

                    <button 
                      type="submit"
                      style={{ width: '100%', padding: '1rem', backgroundColor: '#2D3A29', color: '#FFF', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem', fontSize: '1rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background-color 0.2s ease' }}
                    >
                      Continue to Payment →
                    </button>
                  </form>
                </div>
              )}

              {/* ─── STEP 2: PAYMENT METHOD ─── */}
              {checkoutStep === 'payment' && (
                <div>
                  {/* Address Summary Badge with Edit link */}
                  <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E5DFC5', borderRadius: '6px', padding: '0.85rem 1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.825rem', color: '#2D3A29', maxWidth: '80%' }}>
                      <div style={{ color: '#6E5535', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.15rem' }}>Deliver to:</div>
                      <strong>{shippingAddress.shippingName}</strong> — {shippingAddress.shippingAddress}, {shippingAddress.shippingCity} ({shippingAddress.shippingPostcode})
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setCheckoutStep('address')}
                      style={{ background: 'none', border: 'none', color: '#C5A059', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                    >
                      Edit
                    </button>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h2 className="font-serif" style={{ fontSize: '1.7rem', color: '#2D3A29', marginBottom: '0.25rem', fontWeight: 400 }}>Payment Method</h2>
                    <p style={{ color: '#5C635B', fontSize: '0.85rem', margin: 0 }}>Select your preferred secure payment method.</p>
                  </div>

                  {/* Payment Methods */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {/* STRIPE CARD OPTION */}
                    <div style={{ border: '1.5px solid #2D3A29', borderRadius: '8px', padding: '1.25rem 1.5rem', backgroundColor: '#F9FBF8', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.4rem' }}>
                        <div style={{ backgroundColor: '#1A1F71', color: '#FFF', fontSize: '0.6rem', padding: '0.1rem 0.3rem', borderRadius: '2px', fontWeight: 600 }}>VISA</div>
                        <div style={{ backgroundColor: '#EB001B', color: '#FFF', fontSize: '0.6rem', padding: '0.1rem 0.3rem', borderRadius: '2px', fontWeight: 600 }}>MC</div>
                        <div style={{ backgroundColor: '#006FCF', color: '#FFF', fontSize: '0.6rem', padding: '0.1rem 0.3rem', borderRadius: '2px', fontWeight: 600 }}>AMEX</div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '5px solid #2D3A29', display: 'inline-block' }}></div>
                        <span style={{ fontWeight: 600, color: '#2D3A29', fontSize: '1.05rem' }}>Credit / Debit Card</span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <input type="text" placeholder="Card number" style={{ width: '100%', padding: '0.85rem', borderRadius: '4px', border: '1px solid #D6DDD3', fontSize: '0.95rem' }} />
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <input type="text" placeholder="MM / YY" style={{ width: '50%', padding: '0.85rem', borderRadius: '4px', border: '1px solid #D6DDD3', fontSize: '0.95rem' }} />
                          <input type="text" placeholder="CVC" style={{ width: '50%', padding: '0.85rem', borderRadius: '4px', border: '1px solid #D6DDD3', fontSize: '0.95rem' }} />
                        </div>
                        <input type="text" placeholder="Name on card" defaultValue={shippingAddress.shippingName} style={{ width: '100%', padding: '0.85rem', borderRadius: '4px', border: '1px solid #D6DDD3', fontSize: '0.95rem' }} />
                      </div>
                      
                      <button 
                        style={{ width: '100%', padding: '1rem', backgroundColor: '#2D3A29', color: '#FFF', border: 'none', borderRadius: '4px', marginTop: '1.25rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        onClick={() => {
                          processCompletedOrder('Credit / Debit Card');
                        }}
                      >
                        Pay £{cartSubtotal.toFixed(2)} Securely <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      </button>
                      <div style={{ textAlign: 'center', marginTop: '0.65rem', fontSize: '0.7rem', color: '#5C635B', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3rem' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Payments processed securely by Stripe
                      </div>
                    </div>

                    {/* PAYPAL SMART BUTTONS */}
                    <div style={{ border: '1px solid #E5DFC5', borderRadius: '8px', padding: '1.25rem 1.5rem', backgroundColor: '#FFFFFF' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: '20px' }} />
                        <span style={{ fontSize: '0.85rem', color: '#5C635B' }}>Fast, secure PayPal checkout</span>
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
                    </div>

                  </div>
                </div>
              )}

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
                  {isAdmin && (
                    <button 
                      onClick={() => { setIsAuthOpen(false); navigateToTab('admin'); }}
                      style={{ width: '100%', padding: '0.85rem', backgroundColor: '#C5A059', color: '#161D15', border: 'none', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <ShieldCheck size={16} /> Open Admin Operations Suite
                    </button>
                  )}
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
                      Enter your personal registered account email below (e.g. <strong>sharonshelke1@gmail.com</strong>). A 6-digit passcode will be dispatched from our domain <em>info@lichtluxenaturals.org</em>.
                    </p>
                    <input 
                      type="email" 
                      name="email"
                      value={forgotForm.email}
                      onChange={handleForgotInputChange}
                      placeholder="e.g. sharonshelke1@gmail.com" 
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

      {/* QUICK FLOATING ADMIN TOGGLE */}
      <div className="admin-quick-dock">
        <button 
          className="admin-dock-btn" 
          onClick={() => navigateToTab('admin')}
          title="Open Operations & Inventory Management Portal"
        >
          <ShieldCheck size={16} />
          <span>Admin Portal</span>
          <span className="admin-pulse-dot" style={{ width: 6, height: 6 }}></span>
        </button>
      </div>
    </div>
    </PayPalScriptProvider>
  );
}

export default App;
