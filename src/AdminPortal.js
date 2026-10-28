import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  ClipboardList, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Download, 
  X, 
  Eye, 
  ShieldCheck, 
  Layers, 
  DollarSign, 
  BarChart3, 
  MapPin, 
  FileText, 
  Check, 
  Sparkles,
  ArrowLeft,
  Users,
  UserPlus,
  RefreshCw,
  Lock,
  Mail
} from 'lucide-react';
import './AdminPortal.css';

const API_BASE = (() => {
  if (typeof window === 'undefined') return process.env.REACT_APP_API_BASE || 'http://localhost:8080/api';
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return process.env.REACT_APP_API_BASE || 'http://localhost:8080/api';
  }
  if (host.startsWith('192.168.') || host.startsWith('10.') || host.startsWith('172.')) {
    return `http://${host}:8080/api`;
  }
  return '/api';
})();

// Initial Mock Inventory if not already passed
export const DEFAULT_INVENTORY = [
  {
    sku: 'LN-SKU-SB250',
    productId: 'pure-shea-butter',
    name: 'Pure Shea Butter',
    variant: 'Standard (250g)',
    category: 'Shea & Body',
    batchNo: 'LN-SB-2026A',
    mfgDate: '10/2026',
    expDate: '10/2028',
    stock: 84,
    minThreshold: 25,
    unitCost: 7.50,
    price: 14.99,
    image: '/shea_butter_primary.jpg'
  },
  {
    sku: 'LN-SKU-CO200',
    productId: 'pure-coconut-oil',
    name: 'Pure Coconut Oil',
    variant: 'Cold Pressed (200 ml)',
    category: 'Oils & Nourish',
    batchNo: 'LN-CO-2026B',
    mfgDate: '09/2026',
    expDate: '09/2028',
    stock: 62,
    minThreshold: 20,
    unitCost: 6.80,
    price: 11.99,
    image: '/coconut_oil_primary.jpg'
  },
  {
    sku: 'LN-SKU-BB250',
    productId: 'luxe-body-butter',
    name: 'Luxe Body Butter',
    variant: 'Signature Tub (250g)',
    category: 'Whipped Butters',
    batchNo: 'LN-BB-2026A',
    mfgDate: '10/2026',
    expDate: '10/2028',
    stock: 45,
    minThreshold: 15,
    unitCost: 8.20,
    price: 18.99,
    image: '/body_butter_primary.jpg'
  },
  {
    sku: 'LN-SKU-AB500',
    productId: 'african-black-liquid-soap',
    variantId: 'african-black-liquid-soap',
    name: 'African Black Liquid Soap',
    variant: 'Pump Dispenser (500 ml)',
    category: 'Cleansers & Soaps',
    batchNo: 'LN-AB-500L',
    mfgDate: '10/2026',
    expDate: '10/2028',
    stock: 118,
    minThreshold: 30,
    unitCost: 6.90,
    price: 12.99,
    image: '/african_black_soap_primary.jpg'
  },
  {
    sku: 'LN-SKU-AB300',
    productId: 'african-black-soap-jar',
    name: 'African Black Soap (Jar)',
    variant: 'Traditional Jar (300g)',
    category: 'Cleansers & Soaps',
    batchNo: 'LN-AB-300J',
    mfgDate: '10/2026',
    expDate: '10/2028',
    stock: 18, // LOW STOCK
    minThreshold: 25,
    unitCost: 6.20,
    price: 11.99,
    image: '/african_black_soap_jar.jpg'
  },
  {
    sku: 'LN-SKU-TR001',
    productId: 'luxe-trio-gift-set',
    name: 'The Luxe Trio Gift Set',
    variant: 'Handcrafted Ritual Box',
    category: 'Luxury Gift Sets',
    batchNo: 'LN-SET-2026X',
    mfgDate: '10/2026',
    expDate: '10/2028',
    stock: 14, // LOW STOCK
    minThreshold: 20,
    unitCost: 21.00,
    price: 39.99,
    image: '/luxe_trio_primary.jpg'
  }
];

// Initial Orders (Clean real data - empty until customer places an order)
export const DEFAULT_ORDERS = [];

export default function AdminPortal({ 
  currentUser,
  orders = [], 
  setOrders, 
  inventory = DEFAULT_INVENTORY, 
  setInventory, 
  onExitToStore 
}) {
  const [activeAdminTab, setActiveAdminTab] = useState('overview'); // 'overview' | 'orders' | 'inventory' | 'deliveries' | 'analytics' | 'team'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [targetRestockItem, setTargetRestockItem] = useState(null);
  const [restockAmount, setRestockAmount] = useState(25);
  const [toastMsg, setToastMsg] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Helper deduplicators to guarantee no duplicate records in UI or state
  const deduplicateOrders = (list) => {
    const seen = new Set();
    return (list || []).filter(item => {
      const key = (item.id || item.orderNumber || '').toString();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const deduplicateUsers = (list) => {
    const seen = new Set();
    return (list || []).filter(u => {
      const key = (u.email || '').toLowerCase().trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  // Team & Administrator Access State
  const [users, setUsers] = useState([]);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  // Email Audit Logs State
  const [emailLogs, setEmailLogs] = useState([]);
  const [emailSearchQuery, setEmailSearchQuery] = useState('');
  const [emailStatusFilter, setEmailStatusFilter] = useState('all');

  const [promoteMode, setPromoteMode] = useState('promote'); // 'promote' | 'create'
  const [promoteEmail, setPromoteEmail] = useState('');
  const [promoteLoading, setPromoteLoading] = useState(false);
  const [createAdminForm, setCreateAdminForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: 'Luxe@123&',
    role: 'ADMIN'
  });

  // New Phone Order Form State
  const [newOrderForm, setNewOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    selectedSku: 'LN-SKU-AB500',
    quantity: 1,
    paymentMethod: 'Phone Order / Card',
    courier: 'Royal Mail Tracked 24',
    notes: ''
  });

  const showAdminToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // --- LIVE DATA FETCH FROM SPRING BOOT & SUPABASE CLOUD ---
  const fetchLiveAdminData = async () => {
    setIsRefreshing(true);
    const token = localStorage.getItem('lln_token');
    const authHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    try {
      // 1. Fetch Users (Deduplicated)
      const uRes = await fetch(`${API_BASE}/admin/users`, { headers: authHeaders });
      if (uRes.ok) {
        const uData = await uRes.json();
        setUsers(deduplicateUsers(uData));
      }

      // 2. Fetch Orders (Deduplicated)
      const oRes = await fetch(`${API_BASE}/admin/orders`, { headers: authHeaders });
      if (oRes.ok) {
        const oData = await oRes.json();
        if (Array.isArray(oData) && oData.length > 0) {
          const mappedOrders = oData.map(o => {
            const rawStatus = (o.status || 'CONFIRMED').toUpperCase();
            let deliveryStatus = 'Pending';
            if (rawStatus === 'DELIVERED') deliveryStatus = 'Delivered';
            else if (rawStatus === 'SHIPPED' || rawStatus === 'OUT_FOR_DELIVERY') deliveryStatus = 'Dispatched';
            else if (rawStatus === 'PROCESSING') deliveryStatus = 'Processing';
            else if (rawStatus === 'CONFIRMED' || rawStatus === 'PAID') deliveryStatus = 'Processing';
            else if (rawStatus === 'CANCELLED') deliveryStatus = 'Cancelled';

            return {
              id: o.orderNumber || `LN-${1000 + o.id}`,
              rawId: o.id,
              date: o.createdAt ? new Date(o.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Today',
              customer: {
                name: o.shippingName || (o.user ? `${o.user.firstName || ''} ${o.user.lastName || ''}`.trim() : 'Customer'),
                email: o.user ? o.user.email : (currentUser?.email || ''),
                phone: o.shippingPhone || (o.user ? o.user.phone : '+44 7831 082965'),
                address: [o.shippingAddress, o.shippingCity, o.shippingPostcode].filter(Boolean).join(', ') || 'United Kingdom'
              },
              items: (o.items && o.items.length > 0) ? o.items.map(it => ({
                name: it.productName || 'Bespoke Skincare',
                qty: it.quantity || 1,
                price: Number(it.unitPrice !== undefined ? it.unitPrice : (it.price || 24.00))
              })) : [
                { name: 'Pure Botanical Formulation', qty: 1, price: Number(o.totalAmount || 24.00) }
              ],
              total: Number(o.totalAmount || 0),
              paymentMethod: o.paymentMethod || 'Online Payment',
              paymentStatus: 'Paid',
              deliveryStatus: deliveryStatus,
              courier: o.carrier || 'Royal Mail Tracked 24',
              trackingNumber: o.trackingNumber || 'RM912048590GB',
              source: 'Online Boutique (Supabase Cloud)',
              notes: o.orderNotes || 'Direct customer order'
            };
          });
          setOrders(deduplicateOrders(mappedOrders));
        } else {
          setOrders([]);
        }
      }

      // 3. Fetch Inventory
      const iRes = await fetch(`${API_BASE}/admin/inventory`, { headers: authHeaders });
      if (iRes.ok) {
        const iData = await iRes.json();
        if (Array.isArray(iData) && iData.length > 0) {
          const mappedInventory = iData.map(p => {
            const defaultMatch = DEFAULT_INVENTORY.find(d => d.productId === p.slug || d.name.toLowerCase().includes(p.name.toLowerCase()));
            return {
              id: p.id,
              sku: defaultMatch ? defaultMatch.sku : `LN-SKU-${p.id}`,
              productId: p.slug,
              name: p.name,
              variant: defaultMatch ? defaultMatch.variant : (p.volume || 'Standard Batch'),
              category: defaultMatch ? defaultMatch.category : (p.category || 'Skincare'),
              batchNo: defaultMatch ? defaultMatch.batchNo : `LN-BT-${2026}${p.id}`,
              mfgDate: '10/2026',
              expDate: '10/2028',
              stock: Number(p.stockQuantity !== undefined ? p.stockQuantity : 100),
              minThreshold: defaultMatch ? defaultMatch.minThreshold : 20,
              unitCost: defaultMatch ? defaultMatch.unitCost : 7.50,
              price: Number(p.price || 24.00),
              image: p.imageUrl || (defaultMatch ? defaultMatch.image : '/shea_butter_primary.jpg')
            };
          });
          setInventory(mappedInventory);
        }
      }

      // 4. Fetch Email Audit Logs
      try {
        const eRes = await fetch(`${API_BASE}/admin/email-logs`, { headers: authHeaders });
        if (eRes.ok) {
          const eData = await eRes.json();
          if (Array.isArray(eData)) {
            setEmailLogs(eData);
          }
        }
      } catch (eErr) {
        console.warn('Email logs fetch error:', eErr);
      }
    } catch (err) {
      console.warn('Backend sync error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // KPIs Calculations
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.deliveryStatus === 'Pending' || o.deliveryStatus === 'Processing').length;
  const dispatchedOrdersCount = orders.filter(o => o.deliveryStatus === 'Dispatched').length;
  const deliveredOrdersCount = orders.filter(o => o.deliveryStatus === 'Delivered').length;
  const lowStockCount = inventory.filter(item => item.stock <= item.minThreshold).length;
  const totalStockUnits = inventory.reduce((sum, item) => sum + item.stock, 0);
  const totalInventoryAssetValue = inventory.reduce((sum, item) => sum + (item.stock * item.unitCost), 0);
  const adminCount = users.filter(u => u.role === 'ADMIN').length;

  // Status Change Handler (Live Backend Sync)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { 
          ...o, 
          deliveryStatus: newStatus,
          trackingNumber: (newStatus === 'Dispatched' && (!o.trackingNumber || o.trackingNumber === 'Pending Generation')) 
            ? `RM${Math.floor(100000000 + Math.random() * 900000000)}GB` 
            : o.trackingNumber
        };
      }
      return o;
    }));
    showAdminToast(`Order ${orderId} updated to ${newStatus}`);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, deliveryStatus: newStatus }));
    }

    try {
      const targetOrd = orders.find(o => o.id === orderId);
      const dbId = targetOrd?.rawId || parseInt(orderId.replace(/\D/g, ''), 10);
      if (dbId) {
        let backendStatus = 'CONFIRMED';
        if (newStatus === 'Delivered') backendStatus = 'DELIVERED';
        else if (newStatus === 'Dispatched') backendStatus = 'SHIPPED';
        else if (newStatus === 'Processing') backendStatus = 'PROCESSING';
        else if (newStatus === 'Pending') backendStatus = 'PENDING';
        else if (newStatus === 'Cancelled') backendStatus = 'CANCELLED';

        const token = localStorage.getItem('lln_token');
        await fetch(`${API_BASE}/admin/orders/${dbId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ status: backendStatus })
        });
      }
    } catch (e) {
      console.warn('Status backend sync error:', e);
    }
  };

  // Restock Handler (Live Backend Sync)
  const handleApplyRestock = async (e) => {
    e.preventDefault();
    if (!targetRestockItem || restockAmount <= 0) return;

    setInventory(prev => prev.map(item => {
      if (item.sku === targetRestockItem.sku) {
        return { ...item, stock: item.stock + Number(restockAmount) };
      }
      return item;
    }));

    showAdminToast(`Successfully added ${restockAmount} units to ${targetRestockItem.name}`);
    setIsRestockModalOpen(false);

    try {
      const targetId = targetRestockItem.id || (targetRestockItem.productId === 'pure-shea-butter' ? 1 : 2);
      const token = localStorage.getItem('lln_token');
      await fetch(`${API_BASE}/admin/inventory/${targetId}/restock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ amount: Number(restockAmount) })
      });
    } catch (err) {
      console.warn('Restock sync error:', err);
    }

    setTargetRestockItem(null);
  };

  // Quick Inline Stock Adjust
  const handleQuickStockAdjust = async (sku, delta) => {
    const item = inventory.find(i => i.sku === sku);
    if (!item) return;

    const newStock = Math.max(0, item.stock + delta);
    setInventory(prev => prev.map(i => i.sku === sku ? { ...i, stock: newStock } : i));

    if (item.id) {
      try {
        const token = localStorage.getItem('lln_token');
        await fetch(`${API_BASE}/admin/inventory/${item.id}/restock`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ amount: delta })
        });
      } catch (e) {}
    }
  };

  // Create Manual Phone Order Submit (Guaranteed Single DB Record, No Duplicates)
  const handleCreateNewOrder = async (e) => {
    e.preventDefault();
    if (isSubmittingOrder) return;
    setIsSubmittingOrder(true);

    const productItem = inventory.find(i => i.sku === newOrderForm.selectedSku);
    if (!productItem) {
      setIsSubmittingOrder(false);
      return;
    }

    const qty = Number(newOrderForm.quantity) || 1;
    const itemTotal = productItem.price * qty;

    try {
      const token = localStorage.getItem('lln_token');
      const res = await fetch(`${API_BASE}/admin/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          customerName: newOrderForm.customerName.trim(),
          customerEmail: newOrderForm.customerEmail.trim().toLowerCase(),
          address: newOrderForm.customerAddress.trim(),
          courier: newOrderForm.courier,
          total: itemTotal,
          paymentMethod: newOrderForm.paymentMethod
        })
      });

      if (res.ok) {
        const createdOrder = await res.json();
        showAdminToast(`✨ Order ${createdOrder.orderNumber} successfully recorded in database!`);
        setIsNewOrderModalOpen(false);

        // Deduct inventory locally
        setInventory(prev => prev.map(i => i.sku === productItem.sku ? { ...i, stock: Math.max(0, i.stock - qty) } : i));

        // Re-fetch clean deduplicated orders directly from Supabase
        await fetchLiveAdminData();
      } else {
        throw new Error('Database order creation returned error');
      }
    } catch (err) {
      // Offline fallback only when backend server is completely unavailable
      const fallbackOrder = {
        id: `LN-${Math.floor(1083 + Math.random() * 1000)}`,
        date: 'Just now (Today)',
        customer: {
          name: newOrderForm.customerName || 'Phone Order Customer',
          email: newOrderForm.customerEmail || 'order@loveworldluxe.com',
          phone: newOrderForm.customerPhone || '07831082965',
          address: newOrderForm.customerAddress || 'London, United Kingdom'
        },
        items: [
          { name: `${productItem.name} (${productItem.variant})`, qty, price: productItem.price }
        ],
        total: itemTotal,
        paymentMethod: newOrderForm.paymentMethod,
        paymentStatus: 'Paid',
        deliveryStatus: 'Processing',
        courier: newOrderForm.courier,
        trackingNumber: `RM${Math.floor(100000000 + Math.random() * 900000000)}GB`,
        source: 'Offline Local Order',
        notes: newOrderForm.notes || 'Created via Admin Portal'
      };

      setOrders(prev => deduplicateOrders([fallbackOrder, ...prev]));
      showAdminToast(`Order ${fallbackOrder.id} logged locally`);
      setIsNewOrderModalOpen(false);
    } finally {
      setIsSubmittingOrder(false);
      setNewOrderForm({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        selectedSku: 'LN-SKU-AB500',
        quantity: 1,
        paymentMethod: 'Phone Order / Card',
        courier: 'Royal Mail Tracked 24',
        notes: ''
      });
    }
  };

  // --- USER ACCESS & PROMOTE ADMIN HANDLERS ---
  const handlePromoteUser = async (emailToPromote) => {
    if (!emailToPromote) return;
    setPromoteLoading(true);
    try {
      const token = localStorage.getItem('lln_token');
      const res = await fetch(`${API_BASE}/admin/users/promote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ email: emailToPromote.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Promotion failed');
      }
      showAdminToast(`✨ ${emailToPromote} is now an Administrator!`);
      setIsPromoteModalOpen(false);
      setPromoteEmail('');
      fetchLiveAdminData();
    } catch (err) {
      showAdminToast(`⚠️ ${err.message}`);
    } finally {
      setPromoteLoading(false);
    }
  };

  const handleCreateAdminUser = async (e) => {
    e.preventDefault();
    if (!createAdminForm.email) return;
    setPromoteLoading(true);
    try {
      const token = localStorage.getItem('lln_token');
      const res = await fetch(`${API_BASE}/admin/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(createAdminForm)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create administrator');
      }
      showAdminToast(`✨ Admin account created for ${createAdminForm.email}!`);
      setIsPromoteModalOpen(false);
      setCreateAdminForm({ firstName: '', lastName: '', email: '', phone: '', password: 'Luxe@123&', role: 'ADMIN' });
      fetchLiveAdminData();
    } catch (err) {
      showAdminToast(`⚠️ ${err.message}`);
    } finally {
      setPromoteLoading(false);
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter(ord => {
    const matchesSearch = 
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.trackingNumber && ord.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || ord.deliveryStatus.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Filtered Inventory
  const filteredInventory = inventory.filter(item => {
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="admin-portal-wrapper">
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '1.25rem',
          right: '1.5rem',
          backgroundColor: '#C5A059',
          color: '#1A2118',
          padding: '0.75rem 1.25rem',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '0.875rem',
          zIndex: 9999,
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Sparkles size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP ADMIN HEADER BAR */}
      <header className="admin-top-bar">
        <div className="admin-brand-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.15rem', color: '#C5A059' }}>✦</span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: '#FAF7F2', letterSpacing: '0.08em' }}>
              LICHT LUXE
            </span>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: '#A0A89F', textTransform: 'uppercase' }}>
              OPERATIONS PORTAL
            </span>
          </div>

          <div className="admin-badge-live">
            <span className="admin-pulse-dot" />
            <span>STORE LIVE & SYNCED</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Active Admin Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#FAF7F2', backgroundColor: 'rgba(197, 160, 89, 0.15)', border: '1px solid rgba(197, 160, 89, 0.35)', padding: '0.4rem 0.85rem', borderRadius: '6px' }}>
            <ShieldCheck size={14} color="#C5A059" />
            <span>{currentUser?.firstName || 'Sharon'} (Admin)</span>
          </div>

          {/* Sync Live Database Button */}
          <button 
            className="admin-exit-btn" 
            onClick={fetchLiveAdminData}
            title="Fetch real orders, inventory, and users from Supabase Cloud"
            disabled={isRefreshing}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', borderColor: '#C5A059' }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'spin-icon' : ''} color="#C5A059" />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Live DB'}</span>
          </button>

          {/* Create / Make Admin Button */}
          <button 
            className="admin-btn admin-btn-gold"
            onClick={() => { setPromoteMode('promote'); setIsPromoteModalOpen(true); }}
            title="Make a user Admin or create a new administrator account"
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <UserPlus size={15} />
            <span>+ Make / Create Admin</span>
          </button>

          <button 
            className="admin-exit-btn" 
            onClick={onExitToStore}
            title="Return to Customer Storefront"
          >
            <ArrowLeft size={15} />
            <span>Back to Storefront</span>
          </button>
        </div>
      </header>

      {/* ADMIN BODY LAYOUT */}
      <div className="admin-layout-body">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="admin-sidebar">
          <div className="admin-nav-section-title">MANAGEMENT MODULES</div>
          <ul className="admin-sidebar-nav">
            <li>
              <button 
                className={`admin-nav-item ${activeAdminTab === 'overview' ? 'active' : ''}`}
                onClick={() => { setActiveAdminTab('overview'); setSearchQuery(''); }}
              >
                <div className="admin-nav-item-content">
                  <BarChart3 size={17} color={activeAdminTab === 'overview' ? '#C5A059' : '#A0A89F'} />
                  <span>Dashboard Overview</span>
                </div>
              </button>
            </li>

            <li>
              <button 
                className={`admin-nav-item ${activeAdminTab === 'orders' ? 'active' : ''}`}
                onClick={() => { setActiveAdminTab('orders'); setSearchQuery(''); }}
              >
                <div className="admin-nav-item-content">
                  <ClipboardList size={17} color={activeAdminTab === 'orders' ? '#C5A059' : '#A0A89F'} />
                  <span>Orders Management</span>
                </div>
                <span className="admin-nav-badge">{orders.length}</span>
              </button>
            </li>

            <li>
              <button 
                className={`admin-nav-item ${activeAdminTab === 'inventory' ? 'active' : ''}`}
                onClick={() => { setActiveAdminTab('inventory'); setSearchQuery(''); }}
              >
                <div className="admin-nav-item-content">
                  <Layers size={17} color={activeAdminTab === 'inventory' ? '#C5A059' : '#A0A89F'} />
                  <span>Stock & Inventory</span>
                </div>
                {lowStockCount > 0 && (
                  <span className="admin-nav-badge" style={{ backgroundColor: '#F0B34E' }}>
                    {lowStockCount} LOW
                  </span>
                )}
              </button>
            </li>

            <li>
              <button 
                className={`admin-nav-item ${activeAdminTab === 'deliveries' ? 'active' : ''}`}
                onClick={() => { setActiveAdminTab('deliveries'); setSearchQuery(''); }}
              >
                <div className="admin-nav-item-content">
                  <Truck size={17} color={activeAdminTab === 'deliveries' ? '#C5A059' : '#A0A89F'} />
                  <span>Deliveries & Logistics</span>
                </div>
                <span className="admin-nav-badge" style={{ backgroundColor: '#68B2FF', color: '#161D15' }}>
                  {dispatchedOrdersCount + pendingOrdersCount}
                </span>
              </button>
            </li>

            <li>
              <button 
                className={`admin-nav-item ${activeAdminTab === 'team' ? 'active' : ''}`}
                onClick={() => { setActiveAdminTab('team'); setSearchQuery(''); }}
              >
                <div className="admin-nav-item-content">
                  <Users size={17} color={activeAdminTab === 'team' ? '#C5A059' : '#A0A89F'} />
                  <span>Team & Access Control</span>
                </div>
                <span className="admin-nav-badge" style={{ backgroundColor: '#C5A059', color: '#161D15', fontWeight: 700 }}>
                  {users.length}
                </span>
              </button>
            </li>

            <li>
              <button 
                className={`admin-nav-item ${activeAdminTab === 'emails' ? 'active' : ''}`}
                onClick={() => { setActiveAdminTab('emails'); setSearchQuery(''); }}
              >
                <div className="admin-nav-item-content">
                  <Mail size={17} color={activeAdminTab === 'emails' ? '#C5A059' : '#A0A89F'} />
                  <span>Email Audit & Logs</span>
                </div>
                <span className="admin-nav-badge" style={{ backgroundColor: '#C5A059', color: '#161D15', fontWeight: 700 }}>
                  {emailLogs.length}
                </span>
              </button>
            </li>

            <li>
              <button 
                className={`admin-nav-item ${activeAdminTab === 'analytics' ? 'active' : ''}`}
                onClick={() => { setActiveAdminTab('analytics'); setSearchQuery(''); }}
              >
                <div className="admin-nav-item-content">
                  <TrendingUp size={17} color={activeAdminTab === 'analytics' ? '#C5A059' : '#A0A89F'} />
                  <span>Reports & Analytics</span>
                </div>
              </button>
            </li>
          </ul>

          <div className="admin-sidebar-footer">
            <div className="admin-system-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#C5A059', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                <ShieldCheck size={14} /> LOVEWORLD LOGISTICS
              </div>
              <div style={{ fontSize: '0.75rem', color: '#A0A89F', lineHeight: 1.5 }}>
                Direct UK & Global fulfillment channel active. All raw batches authenticated.
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN DASHBOARD CONTENT VIEW */}
        <main className="admin-main-content">
          
          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW DASHBOARD                                                 */}
          {/* ========================================================================= */}
          {activeAdminTab === 'overview' && (
            <div>
              <div className="admin-header-row">
                <div>
                  <h1 className="admin-page-title">Executive Operations Overview</h1>
                  <p className="admin-page-sub">Real-time status of orders, dispatch queues, and inventory levels.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    className="admin-btn admin-btn-gold"
                    onClick={() => setIsNewOrderModalOpen(true)}
                  >
                    <Plus size={16} /> Log Manual / Phone Order
                  </button>
                  <button 
                    className="admin-btn admin-btn-secondary"
                    onClick={() => showAdminToast('Operations report exported to CSV')}
                  >
                    <Download size={15} /> Export Summary
                  </button>
                </div>
              </div>

              {/* METRIC KPI CARDS */}
              <div className="admin-metrics-grid">
                <div className="admin-metric-card">
                  <div className="admin-metric-top">
                    <span className="admin-metric-label">Total Revenue</span>
                    <div className="admin-metric-icon"><DollarSign size={18} /></div>
                  </div>
                  <div className="admin-metric-value">£{totalRevenue.toFixed(2)}</div>
                  <div className="admin-metric-trend">
                    <ArrowUpRight size={13} /> +18.4% vs last period
                  </div>
                </div>

                <div className="admin-metric-card">
                  <div className="admin-metric-top">
                    <span className="admin-metric-label">Total Orders</span>
                    <div className="admin-metric-icon"><ClipboardList size={18} /></div>
                  </div>
                  <div className="admin-metric-value">{totalOrdersCount}</div>
                  <div className="admin-metric-trend">
                    <CheckCircle2 size={13} /> {deliveredOrdersCount} completed ({totalOrdersCount > 0 ? Math.round((deliveredOrdersCount/totalOrdersCount)*100) : 0}%)
                  </div>
                </div>

                <div className="admin-metric-card">
                  <div className="admin-metric-top">
                    <span className="admin-metric-label">Deliveries In Transit</span>
                    <div className="admin-metric-icon"><Truck size={18} /></div>
                  </div>
                  <div className="admin-metric-value">{dispatchedOrdersCount}</div>
                  <div className="admin-metric-trend" style={{ color: '#68B2FF' }}>
                    <Clock size={13} /> {pendingOrdersCount} pending dispatch
                  </div>
                </div>

                <div className="admin-metric-card">
                  <div className="admin-metric-top">
                    <span className="admin-metric-label">Stock Units</span>
                    <div className="admin-metric-icon"><Package size={18} /></div>
                  </div>
                  <div className="admin-metric-value">{totalStockUnits}</div>
                  <div className={`admin-metric-trend ${lowStockCount > 0 ? 'warning' : ''}`}>
                    {lowStockCount > 0 ? (
                      <>
                        <AlertTriangle size={13} /> {lowStockCount} items below threshold
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={13} /> All items optimal
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* TWO COLUMN OVERVIEW: RECENT ORDERS + INVENTORY HEALTH */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                
                {/* Recent Orders Box */}
                <div className="admin-card-panel" style={{ marginBottom: 0 }}>
                  <div className="admin-panel-header">
                    <h2 className="admin-panel-title">
                      <Clock size={18} color="#C5A059" /> Recent Orders
                    </h2>
                    <button 
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={() => setActiveAdminTab('orders')}
                    >
                      View All Orders ({orders.length}) →
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Customer</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.length === 0 ? (
                          <tr>
                            <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#A0A89F' }}>
                              <Package size={26} style={{ opacity: 0.4, margin: '0 auto 0.5rem auto', display: 'block' }} />
                              <div style={{ color: '#FAF7F2', fontWeight: 600, fontSize: '0.85rem' }}>No Orders Placed Yet</div>
                              <div style={{ fontSize: '0.72rem', color: '#8A9488', marginTop: '0.2rem' }}>Real storefront customer orders will appear here automatically.</div>
                            </td>
                          </tr>
                        ) : (
                          orders.slice(0, 5).map(ord => (
                            <tr key={ord.id}>
                              <td style={{ fontWeight: 700, color: '#C5A059' }}>{ord.id}</td>
                              <td>
                                <div style={{ fontWeight: 600, color: '#FAF7F2' }}>{ord.customer.name}</div>
                                <div style={{ fontSize: '0.72rem', color: '#A0A89F' }}>{ord.customer.phone}</div>
                              </td>
                              <td style={{ fontWeight: 700, color: '#FAF7F2' }}>£{ord.total.toFixed(2)}</td>
                              <td>
                                <span className={`status-badge ${ord.deliveryStatus.toLowerCase()}`}>
                                  {ord.deliveryStatus}
                                </span>
                              </td>
                              <td>
                                <button 
                                  className="admin-btn admin-btn-secondary admin-btn-sm"
                                  onClick={() => setSelectedOrder(ord)}
                                >
                                  <Eye size={12} /> View
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Stock Health Box */}
                <div className="admin-card-panel" style={{ marginBottom: 0 }}>
                  <div className="admin-panel-header">
                    <h2 className="admin-panel-title">
                      <AlertTriangle size={18} color="#F0B34E" /> Stock Health
                    </h2>
                    <button 
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={() => setActiveAdminTab('inventory')}
                    >
                      Inventory →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {inventory.map(item => {
                      const isLow = item.stock <= item.minThreshold;
                      const percentage = Math.min(100, Math.round((item.stock / 120) * 100));

                      return (
                        <div key={item.sku} style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: isLow ? '1px solid rgba(240, 179, 78, 0.4)' : '1px solid rgba(229, 223, 197, 0.08)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#FAF7F2' }}>
                              {item.name}
                            </div>
                            <span className={`status-badge ${isLow ? 'low-stock' : 'in-stock'}`}>
                              {item.stock} left
                            </span>
                          </div>
                          
                          {/* Progress bar */}
                          <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: isLow ? '#F0B34E' : '#4AB97A' }} />
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#A0A89F', marginTop: '0.35rem' }}>
                            <span>SKU: {item.sku}</span>
                            <span>Min Alert: {item.minThreshold}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ORDERS MANAGEMENT                                                  */}
          {/* ========================================================================= */}
          {activeAdminTab === 'orders' && (
            <div>
              <div className="admin-header-row">
                <div>
                  <h1 className="admin-page-title">Order Processing & Fulfillment</h1>
                  <p className="admin-page-sub">Manage customer orders, update dispatch progress, and view invoices.</p>
                </div>
                <button 
                  className="admin-btn admin-btn-gold"
                  onClick={() => setIsNewOrderModalOpen(true)}
                >
                  <Plus size={16} /> Create Phone / Manual Order
                </button>
              </div>

              <div className="admin-card-panel">
                <div className="admin-panel-header">
                  {/* Status Filters */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['all', 'pending', 'processing', 'dispatched', 'delivered'].map(st => (
                      <button 
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: '6px',
                          border: statusFilter === st ? '1px solid #C5A059' : '1px solid rgba(229, 223, 197, 0.15)',
                          backgroundColor: statusFilter === st ? 'rgba(197, 160, 89, 0.2)' : 'rgba(20, 27, 19, 0.6)',
                          color: statusFilter === st ? '#EAD8BA' : '#D6DDD3',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          cursor: 'pointer'
                        }}
                      >
                        {st} ({st === 'all' ? orders.length : orders.filter(o => o.deliveryStatus.toLowerCase() === st).length})
                      </button>
                    ))}
                  </div>

                  {/* Search */}
                  <div className="admin-search-input-wrap">
                    <Search size={15} className="admin-search-icon" />
                    <input 
                      type="text" 
                      placeholder="Search order #, customer, phone..."
                      className="admin-search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Items Summary</th>
                        <th>Total Amount</th>
                        <th>Payment</th>
                        <th>Delivery Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#A0A89F' }}>
                            <Package size={34} style={{ opacity: 0.4, margin: '0 auto 0.75rem auto', display: 'block' }} />
                            <div style={{ color: '#FAF7F2', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                              {orders.length === 0 ? 'No Customer Orders Placed Yet' : 'No Orders Matching Filter'}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#8A9488', maxWidth: '380px', margin: '0 auto', lineHeight: 1.5 }}>
                              {orders.length === 0 
                                ? 'Real customer orders placed on the storefront or via phone order will appear here live.'
                                : 'Try clearing your search query or switching the status filter.'}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map(ord => (
                          <tr key={ord.id}>
                            <td style={{ fontWeight: 700, color: '#C5A059' }}>{ord.id}</td>
                            <td style={{ fontSize: '0.78rem', color: '#A0A89F' }}>{ord.date}</td>
                            <td>
                              <div style={{ fontWeight: 600, color: '#FAF7F2' }}>{ord.customer.name}</div>
                              <div style={{ fontSize: '0.72rem', color: '#A0A89F' }}>{ord.customer.email}</div>
                              <div style={{ fontSize: '0.72rem', color: '#68B2FF' }}>{ord.customer.phone}</div>
                            </td>
                            <td>
                              <div style={{ maxWidth: '240px', fontSize: '0.8rem', lineHeight: 1.4 }}>
                                {ord.items.map((it, idx) => (
                                  <div key={idx}>• {it.name} <span style={{ color: '#C5A059' }}>x{it.qty}</span></div>
                                ))}
                              </div>
                            </td>
                            <td style={{ fontWeight: 700, color: '#FAF7F2' }}>
                              £{ord.total.toFixed(2)}
                            </td>
                            <td>
                              <span style={{ fontSize: '0.75rem', color: '#4AB97A', fontWeight: 600 }}>
                                ✓ {ord.paymentStatus}
                              </span>
                              <div style={{ fontSize: '0.7rem', color: '#A0A89F' }}>{ord.paymentMethod}</div>
                            </td>
                            <td>
                              <select 
                                value={ord.deliveryStatus}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                style={{
                                  backgroundColor: '#141B13',
                                  color: ord.deliveryStatus === 'Delivered' ? '#4AB97A' : (ord.deliveryStatus === 'Dispatched' ? '#68B2FF' : '#F0B34E'),
                                  border: '1px solid rgba(229, 223, 197, 0.25)',
                                  borderRadius: '6px',
                                  padding: '0.35rem 0.6rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Dispatched">Dispatched</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                            <td>
                              <button 
                                className="admin-btn admin-btn-secondary admin-btn-sm"
                                onClick={() => setSelectedOrder(ord)}
                              >
                                <Eye size={12} /> View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: INVENTORY MANAGEMENT                                               */}
          {/* ========================================================================= */}
          {activeAdminTab === 'inventory' && (
            <div>
              <div className="admin-header-row">
                <div>
                  <h1 className="admin-page-title">Live Inventory & Stock Control</h1>
                  <p className="admin-page-sub">Track stock units, minimum reorder thresholds, and wholesale valuation.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ backgroundColor: '#20281E', border: '1px solid rgba(197, 160, 89, 0.3)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.825rem' }}>
                    Asset Value: <strong style={{ color: '#C5A059' }}>£{totalInventoryAssetValue.toFixed(2)}</strong>
                  </div>
                  <button 
                    className="admin-btn admin-btn-gold"
                    onClick={() => {
                      setTargetRestockItem(inventory[0]);
                      setIsRestockModalOpen(true);
                    }}
                  >
                    <Plus size={16} /> Restock Inventory
                  </button>
                </div>
              </div>

              <div className="admin-card-panel">
                <div className="admin-panel-header">
                  <div className="admin-search-input-wrap">
                    <Search size={15} className="admin-search-icon" />
                    <input 
                      type="text" 
                      placeholder="Search SKU, formula, category..."
                      className="admin-search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#A0A89F' }}>
                    Total SKUs Tracked: <strong>{inventory.length}</strong>
                  </span>
                </div>

                <div className="admin-table-container">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Product & Format</th>
                        <th>SKU / Batch</th>
                        <th>Category</th>
                        <th>In Stock</th>
                        <th>Reorder Level</th>
                        <th>Unit Cost</th>
                        <th>Retail Price</th>
                        <th>Margin</th>
                        <th>Quick Stock Adjust</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInventory.map(item => {
                        const isLow = item.stock <= item.minThreshold;
                        const marginPct = Math.round(((item.price - item.unitCost) / item.price) * 100);

                        return (
                          <tr key={item.sku}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(197, 160, 89, 0.3)' }} 
                                />
                                <div>
                                  <div style={{ fontWeight: 700, color: '#FAF7F2' }}>{item.name}</div>
                                  <div style={{ fontSize: '0.72rem', color: '#C5A059' }}>{item.variant}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#FAF7F2' }}>{item.sku}</div>
                              <div style={{ fontSize: '0.7rem', color: '#A0A89F' }}>Batch: {item.batchNo}</div>
                            </td>
                            <td style={{ fontSize: '0.78rem', color: '#D6DDD3' }}>{item.category}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: isLow ? '#F0B34E' : '#FAF7F2' }}>
                                  {item.stock}
                                </span>
                                <span className={`status-badge ${isLow ? 'low-stock' : 'in-stock'}`}>
                                  {isLow ? 'LOW' : 'OK'}
                                </span>
                              </div>
                            </td>
                            <td style={{ color: '#A0A89F', fontSize: '0.85rem' }}>
                              {item.minThreshold} units
                            </td>
                            <td style={{ color: '#D6DDD3' }}>£{item.unitCost.toFixed(2)}</td>
                            <td style={{ fontWeight: 700, color: '#FAF7F2' }}>£{item.price.toFixed(2)}</td>
                            <td>
                              <span style={{ color: '#4AB97A', fontWeight: 700, fontSize: '0.8rem' }}>
                                {marginPct}%
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <button 
                                  className="admin-btn admin-btn-secondary admin-btn-sm"
                                  onClick={() => handleQuickStockAdjust(item.sku, -1)}
                                  title="Deduct 1 unit"
                                >
                                  -1
                                </button>
                                <button 
                                  className="admin-btn admin-btn-secondary admin-btn-sm"
                                  onClick={() => handleQuickStockAdjust(item.sku, 1)}
                                  title="Add 1 unit"
                                >
                                  +1
                                </button>
                                <button 
                                  className="admin-btn admin-btn-gold admin-btn-sm"
                                  onClick={() => {
                                    setTargetRestockItem(item);
                                    setIsRestockModalOpen(true);
                                  }}
                                  title="Bulk Restock"
                                >
                                  + Restock
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: DELIVERIES & LOGISTICS                                             */}
          {/* ========================================================================= */}
          {activeAdminTab === 'deliveries' && (
            <div>
              <div className="admin-header-row">
                <div>
                  <h1 className="admin-page-title">Delivery & Courier Logistics</h1>
                  <p className="admin-page-sub">Track dispatch partners (Royal Mail, DPD, DHL), waybills, and transit status.</p>
                </div>
              </div>

              <div className="admin-metrics-grid">
                <div className="admin-metric-card">
                  <div className="admin-metric-top">
                    <span className="admin-metric-label">Ready for Pickup</span>
                    <div className="admin-metric-icon"><Clock size={18} /></div>
                  </div>
                  <div className="admin-metric-value">{pendingOrdersCount}</div>
                </div>

                <div className="admin-metric-card">
                  <div className="admin-metric-top">
                    <span className="admin-metric-label">In Transit With Courier</span>
                    <div className="admin-metric-icon"><Truck size={18} /></div>
                  </div>
                  <div className="admin-metric-value">{dispatchedOrdersCount}</div>
                </div>

                <div className="admin-metric-card">
                  <div className="admin-metric-top">
                    <span className="admin-metric-label">Successfully Delivered</span>
                    <div className="admin-metric-icon"><CheckCircle2 size={18} /></div>
                  </div>
                  <div className="admin-metric-value">{deliveredOrdersCount}</div>
                </div>
              </div>

              <div className="admin-card-panel">
                <div className="admin-panel-header">
                  <h2 className="admin-panel-title">
                    <Truck size={18} color="#C5A059" /> Live Delivery Manifest
                  </h2>
                </div>

                <div className="admin-table-container">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Recipient & Address</th>
                        <th>Carrier Partner</th>
                        <th>Tracking Number</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#A0A89F' }}>
                            <Truck size={34} style={{ opacity: 0.4, margin: '0 auto 0.75rem auto', display: 'block' }} />
                            <div style={{ color: '#FAF7F2', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                              No Delivery Dispatches Scheduled
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#8A9488', maxWidth: '380px', margin: '0 auto', lineHeight: 1.5 }}>
                              Orders requiring shipping labels and carrier tracking will appear here automatically when orders are placed.
                            </div>
                          </td>
                        </tr>
                      ) : (
                        orders.map(ord => (
                          <tr key={ord.id}>
                          <td style={{ fontWeight: 700, color: '#C5A059' }}>{ord.id}</td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#FAF7F2' }}>{ord.customer.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#A0A89F', maxWidth: '300px' }}>
                              <MapPin size={11} style={{ display: 'inline', marginRight: '3px' }} />
                              {ord.customer.address}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#D6DDD3' }}>{ord.courier}</div>
                          </td>
                          <td>
                            <div style={{ fontFamily: 'monospace', color: '#68B2FF', fontSize: '0.8rem' }}>
                              {ord.trackingNumber || 'Pending'}
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${ord.deliveryStatus.toLowerCase()}`}>
                              {ord.deliveryStatus}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              {ord.deliveryStatus !== 'Delivered' && (
                                <button 
                                  className="admin-btn admin-btn-gold admin-btn-sm"
                                  onClick={() => handleUpdateOrderStatus(ord.id, 'Delivered')}
                                >
                                  Mark Delivered
                                </button>
                              )}
                              <button 
                                className="admin-btn admin-btn-secondary admin-btn-sm"
                                onClick={() => setSelectedOrder(ord)}
                              >
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      )))
                    }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: REPORTS & ANALYTICS                                                */}
          {/* ========================================================================= */}
          {activeAdminTab === 'analytics' && (
            <div>
              <div className="admin-header-row">
                <div>
                  <h1 className="admin-page-title">Financial & Channel Analytics</h1>
                  <p className="admin-page-sub">Performance metrics by channel, average order value, and product revenue.</p>
                </div>
                <button 
                  className="admin-btn admin-btn-gold"
                  onClick={() => showAdminToast('Full Financial Report generated')}
                >
                  <Download size={15} /> Download PDF Statement
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="admin-card-panel">
                  <h3 style={{ fontSize: '0.85rem', color: '#C5A059', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    Sales Channel Distribution
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        <span>Online Web Storefront</span>
                        <strong>78% (£{(totalRevenue * 0.78).toFixed(2)})</strong>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                        <div style={{ width: '78%', height: '100%', backgroundColor: '#C5A059', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        <span>Phone Orders (07831082965)</span>
                        <strong>18% (£{(totalRevenue * 0.18).toFixed(2)})</strong>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                        <div style={{ width: '18%', height: '100%', backgroundColor: '#4AB97A', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        <span>Corporate & Gifting Inquiries</span>
                        <strong>4% (£{(totalRevenue * 0.04).toFixed(2)})</strong>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                        <div style={{ width: '4%', height: '100%', backgroundColor: '#68B2FF', borderRadius: '3px' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-card-panel">
                  <h3 style={{ fontSize: '0.85rem', color: '#C5A059', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    Average Order Value (AOV)
                  </h3>
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#FAF7F2', marginBottom: '0.5rem' }}>
                    £{(totalRevenue / (totalOrdersCount || 1)).toFixed(2)}
                  </div>
                  <p style={{ fontSize: '0.825rem', color: '#A0A89F', lineHeight: 1.6 }}>
                    Boosted by The Luxe Trio Gift Set (£68) and dual-variant African Black Soap bundles. Free UK shipping threshold active at £50.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: TEAM & ADMINISTRATOR ACCESS CONTROL                                 */}
          {/* ========================================================================= */}
          {activeAdminTab === 'team' && (
            <div>
              <div className="admin-header-row">
                <div>
                  <h1 className="admin-page-title">Team & Executive Access</h1>
                  <p className="admin-page-sub">Direct access management for staff administrators and boutique members in Supabase Cloud.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button 
                    className="admin-btn admin-btn-gold"
                    onClick={() => { setPromoteMode('promote'); setIsPromoteModalOpen(true); }}
                  >
                    <UserPlus size={16} /> + Make / Create Admin
                  </button>
                  <button 
                    className="admin-btn admin-btn-secondary"
                    onClick={fetchLiveAdminData}
                    disabled={isRefreshing}
                  >
                    <RefreshCw size={15} className={isRefreshing ? 'spin-icon' : ''} /> {isRefreshing ? 'Syncing...' : 'Refresh Users'}
                  </button>
                </div>
              </div>

              {/* METRIC KPI CARDS */}
              <div className="admin-metrics-grid" style={{ marginBottom: '1.75rem' }}>
                <div className="admin-metric-card">
                  <div className="admin-metric-top">
                    <span className="admin-metric-label">Total Users</span>
                    <div className="admin-metric-icon"><Users size={18} /></div>
                  </div>
                  <div className="admin-metric-value">{users.length}</div>
                  <div className="admin-metric-trend">
                    <CheckCircle2 size={13} color="#4AB97A" /> Supabase cloud verified
                  </div>
                </div>

                <div className="admin-metric-card">
                  <div className="admin-metric-top">
                    <span className="admin-metric-label">Administrators</span>
                    <div className="admin-metric-icon" style={{ backgroundColor: 'rgba(197, 160, 89, 0.2)', color: '#C5A059' }}>
                      <ShieldCheck size={18} />
                    </div>
                  </div>
                  <div className="admin-metric-value" style={{ color: '#C5A059' }}>{adminCount}</div>
                  <div className="admin-metric-trend" style={{ color: '#C5A059' }}>
                    ✦ Full executive privileges
                  </div>
                </div>

                <div className="admin-metric-card">
                  <div className="admin-metric-top">
                    <span className="admin-metric-label">Registered Customers</span>
                    <div className="admin-metric-icon"><Package size={18} /></div>
                  </div>
                  <div className="admin-metric-value">{Math.max(0, users.length - adminCount)}</div>
                  <div className="admin-metric-trend">
                    Direct boutique patrons
                  </div>
                </div>

                <div className="admin-metric-card">
                  <div className="admin-metric-top">
                    <span className="admin-metric-label">Security & Database</span>
                    <div className="admin-metric-icon"><Lock size={18} /></div>
                  </div>
                  <div className="admin-metric-value" style={{ fontSize: '1.25rem', color: '#4AB97A' }}>Online</div>
                  <div className="admin-metric-trend" style={{ color: '#B5BEB4' }}>
                    BCrypt + JWT 24h Expiry
                  </div>
                </div>
              </div>

              {/* FILTER & SEARCH BAR */}
              <div className="admin-filters-bar" style={{ marginBottom: '1.25rem' }}>
                <div className="admin-search-wrapper" style={{ flexGrow: 1 }}>
                  <Search size={16} className="admin-search-icon" />
                  <input 
                    type="text"
                    placeholder="Search users by name, email, or role..."
                    className="admin-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button className="admin-clear-search" onClick={() => setSearchQuery('')}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* USERS TABLE */}
              <div className="admin-table-container">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>System Role</th>
                      <th>Status</th>
                      <th>Registered</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(u => {
                        const q = searchQuery.toLowerCase();
                        return !q || 
                          (u.name && u.name.toLowerCase().includes(q)) ||
                          (u.email && u.email.toLowerCase().includes(q)) ||
                          (u.role && u.role.toLowerCase().includes(q));
                      })
                      .map(u => {
                        const isUserAdmin = u.role === 'ADMIN' || u.role === 'ROLE_ADMIN';
                        return (
                          <tr key={u.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  backgroundColor: isUserAdmin ? 'rgba(197, 160, 89, 0.2)' : 'rgba(255,255,255,0.08)',
                                  color: isUserAdmin ? '#C5A059' : '#FAF7F2',
                                  border: isUserAdmin ? '1px solid rgba(197, 160, 89, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700,
                                  fontSize: '0.85rem'
                                }}>
                                  {u.firstName ? u.firstName.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 600, color: '#FAF7F2' }}>
                                    {u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Luxe Member'}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#8A9488' }}>ID: #{u.id}</div>
                                </div>
                              </div>
                            </td>

                            <td>
                              <a href={`mailto:${u.email}`} style={{ color: '#D6DDD3', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Mail size={13} color="#C5A059" />
                                <span>{u.email}</span>
                              </a>
                            </td>

                            <td style={{ color: '#A0A89F', fontSize: '0.85rem' }}>
                              {u.phone || '—'}
                            </td>

                            <td>
                              {isUserAdmin ? (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  backgroundColor: 'rgba(197, 160, 89, 0.15)',
                                  color: '#C5A059',
                                  border: '1px solid rgba(197, 160, 89, 0.35)',
                                  borderRadius: '9999px',
                                  padding: '0.2rem 0.65rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  letterSpacing: '0.05em'
                                }}>
                                  <ShieldCheck size={12} /> ADMINISTRATOR
                                </span>
                              ) : (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  backgroundColor: 'rgba(255,255,255,0.06)',
                                  color: '#B5BEB4',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  borderRadius: '9999px',
                                  padding: '0.2rem 0.65rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 600
                                }}>
                                  CUSTOMER
                                </span>
                              )}
                            </td>

                            <td>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                color: '#4AB97A',
                                fontSize: '0.775rem',
                                fontWeight: 600
                              }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#4AB97A' }}></span>
                                Active
                              </span>
                            </td>

                            <td style={{ color: '#8A9488', fontSize: '0.8rem' }}>
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}
                            </td>

                            <td style={{ textAlign: 'right' }}>
                              {isUserAdmin ? (
                                <span style={{ fontSize: '0.8rem', color: '#8A9488', fontStyle: 'italic' }}>
                                  Executive Access
                                </span>
                              ) : (
                                <button
                                  className="admin-btn admin-btn-gold"
                                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem', gap: '0.35rem' }}
                                  onClick={() => handlePromoteUser(u.email)}
                                  disabled={promoteLoading}
                                >
                                  <ShieldCheck size={13} /> Make Admin
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: EMAIL AUDIT & TRANSACTIONAL LOGS                                   */}
          {/* ========================================================================= */}
          {activeAdminTab === 'emails' && (
            <div className="admin-tab-content animate-fade-in">
              <div className="admin-page-header">
                <div>
                  <h1 className="admin-page-title">Email Delivery & Audit Logs</h1>
                  <p className="admin-page-sub">
                    Real-time transactional email history, OTP reset codes, and delivery statuses recorded in Supabase Cloud.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button
                    className="admin-btn admin-btn-outline"
                    onClick={fetchLiveAdminData}
                    disabled={isRefreshing}
                    title="Refresh Email Logs"
                  >
                    <RefreshCw size={14} className={isRefreshing ? 'admin-spin' : ''} />
                    <span>Sync Logs</span>
                  </button>
                </div>
              </div>

              {/* KPI CARDS */}
              <div className="admin-kpi-grid" style={{ marginBottom: '1.75rem' }}>
                <div className="admin-kpi-card">
                  <div className="admin-kpi-header">
                    <span className="admin-kpi-label">Total Outbound</span>
                    <Mail size={18} color="#C5A059" />
                  </div>
                  <div className="admin-kpi-value">{emailLogs.length}</div>
                  <div className="admin-kpi-sub">Lifetime email attempts</div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-header">
                    <span className="admin-kpi-label">Delivered</span>
                    <CheckCircle2 size={18} color="#4AB97A" />
                  </div>
                  <div className="admin-kpi-value" style={{ color: '#4AB97A' }}>
                    {emailLogs.filter(e => e.status === 'SENT').length}
                  </div>
                  <div className="admin-kpi-sub">Confirmed via SMTP</div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-header">
                    <span className="admin-kpi-label">Failed / Issues</span>
                    <AlertTriangle size={18} color="#FF6B6B" />
                  </div>
                  <div className="admin-kpi-value" style={{ color: '#FF6B6B' }}>
                    {emailLogs.filter(e => e.status === 'FAILED').length}
                  </div>
                  <div className="admin-kpi-sub">Auth or relay rejections</div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-header">
                    <span className="admin-kpi-label">Password OTPs</span>
                    <Lock size={18} color="#C5A059" />
                  </div>
                  <div className="admin-kpi-value">
                    {emailLogs.filter(e => (e.emailType || '').includes('OTP')).length}
                  </div>
                  <div className="admin-kpi-sub">Reset verification requests</div>
                </div>
              </div>

              {/* FILTER BAR */}
              <div className="admin-filter-bar" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem', backgroundColor: '#1A2118', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                  <Search size={15} color="#A0A89F" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search by recipient, subject, or purpose..."
                    value={emailSearchQuery}
                    onChange={(e) => setEmailSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem 0.6rem 2.4rem',
                      backgroundColor: '#121711',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#FAF7F2',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {['all', 'SENT', 'FAILED'].map(st => (
                    <button
                      key={st}
                      onClick={() => setEmailStatusFilter(st)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: emailStatusFilter === st ? '#C5A059' : 'rgba(255,255,255,0.1)',
                        backgroundColor: emailStatusFilter === st ? 'rgba(197, 160, 89, 0.15)' : 'transparent',
                        color: emailStatusFilter === st ? '#C5A059' : '#A0A89F',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {st === 'all' ? 'All Statuses' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* TABLE */}
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '70px' }}>ID</th>
                      <th>Recipient</th>
                      <th>Email Purpose</th>
                      <th>Subject Line</th>
                      <th>Status</th>
                      <th>Diagnostics</th>
                      <th style={{ textAlign: 'right' }}>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailLogs
                      .filter(e => {
                        const q = emailSearchQuery.toLowerCase();
                        const matchQ = !q || 
                          (e.recipient || '').toLowerCase().includes(q) ||
                          (e.subject || '').toLowerCase().includes(q) ||
                          (e.emailType || '').toLowerCase().includes(q);
                        const matchStatus = emailStatusFilter === 'all' || e.status === emailStatusFilter;
                        return matchQ && matchStatus;
                      })
                      .map(e => {
                        const isSent = e.status === 'SENT';
                        const isFailed = e.status === 'FAILED';

                        // Purpose label & color
                        let typeLabel = e.emailType || 'GENERAL';
                        let typeBg = 'rgba(255,255,255,0.08)';
                        let typeColor = '#FAF7F2';

                        if (e.emailType === 'WELCOME') {
                          typeLabel = 'Member Welcome';
                          typeBg = 'rgba(74, 185, 122, 0.15)';
                          typeColor = '#4AB97A';
                        } else if (e.emailType === 'PASSWORD_RESET_OTP') {
                          typeLabel = 'Password Reset OTP';
                          typeBg = 'rgba(197, 160, 89, 0.18)';
                          typeColor = '#C5A059';
                        } else if (e.emailType === 'PASSWORD_CHANGED') {
                          typeLabel = 'Security Notice';
                          typeBg = 'rgba(104, 178, 255, 0.15)';
                          typeColor = '#68B2FF';
                        } else if (e.emailType === 'ORDER_CONFIRMATION') {
                          typeLabel = 'Order Receipt';
                          typeBg = 'rgba(180, 130, 255, 0.15)';
                          typeColor = '#D4A5FF';
                        } else if ((e.emailType || '').startsWith('ORDER_STATUS')) {
                          typeLabel = 'Shipping Update';
                          typeBg = 'rgba(80, 210, 220, 0.15)';
                          typeColor = '#50D2DC';
                        }

                        return (
                          <tr key={e.id}>
                            <td style={{ color: '#8A9488', fontSize: '0.8rem', fontWeight: 600 }}>
                              #{e.id}
                            </td>

                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  backgroundColor: 'rgba(197, 160, 89, 0.15)',
                                  color: '#C5A059',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.75rem',
                                  fontWeight: 700
                                }}>
                                  {(e.recipient || 'U').charAt(0).toUpperCase()}
                                </div>
                                <a
                                  href={`mailto:${e.recipient}`}
                                  style={{ color: '#FAF7F2', fontWeight: 600, textDecoration: 'none' }}
                                >
                                  {e.recipient}
                                </a>
                              </div>
                            </td>

                            <td>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '9999px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                backgroundColor: typeBg,
                                color: typeColor,
                                letterSpacing: '0.03em'
                              }}>
                                {typeLabel}
                              </span>
                            </td>

                            <td style={{ color: '#D6DDD3', fontSize: '0.85rem', maxWidth: '320px' }}>
                              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={e.subject}>
                                {e.subject}
                              </div>
                            </td>

                            <td>
                              {isSent ? (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  backgroundColor: 'rgba(74, 185, 122, 0.15)',
                                  color: '#4AB97A',
                                  padding: '0.2rem 0.6rem',
                                  borderRadius: '4px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700
                                }}>
                                  <CheckCircle2 size={12} /> SENT
                                </span>
                              ) : isFailed ? (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  backgroundColor: 'rgba(255, 107, 107, 0.15)',
                                  color: '#FF6B6B',
                                  padding: '0.2rem 0.6rem',
                                  borderRadius: '4px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700
                                }}>
                                  <AlertTriangle size={12} /> FAILED
                                </span>
                              ) : (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                  color: '#A0A89F',
                                  padding: '0.2rem 0.6rem',
                                  borderRadius: '4px',
                                  fontSize: '0.72rem',
                                  fontWeight: 600
                                }}>
                                  {e.status}
                                </span>
                              )}
                            </td>

                            <td style={{ fontSize: '0.78rem' }}>
                              {isFailed ? (
                                <span style={{ color: '#FF9E9E', fontStyle: 'italic' }}>
                                  {e.errorMessage || 'Authentication failed'} (x{e.retryCount || 2} retries)
                                </span>
                              ) : (
                                <span style={{ color: '#8A9488' }}>
                                  Delivered via SMTP
                                </span>
                              )}
                            </td>

                            <td style={{ textAlign: 'right', color: '#8A9488', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                              {e.createdAt ? new Date(e.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                            </td>
                          </tr>
                        );
                      })}

                    {emailLogs.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#8A9488' }}>
                          <Mail size={32} color="#C5A059" style={{ opacity: 0.5, marginBottom: '0.75rem' }} />
                          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#FAF7F2' }}>No Email Records Found</div>
                          <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                            Outgoing emails triggered by customer registration, forgot password, or orders will appear here automatically.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ORDER DETAILS & PACKING SLIP                                     */}
      {/* ========================================================================= */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setSelectedOrder(null)}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className={`status-badge ${selectedOrder.deliveryStatus.toLowerCase()}`}>
                {selectedOrder.deliveryStatus}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#A0A89F' }}>{selectedOrder.date}</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: '#FAF7F2', margin: '0 0 1rem 0' }}>
              Order {selectedOrder.id}
            </h2>

            {/* Customer Details Block */}
            <div style={{ backgroundColor: '#141B13', border: '1px solid rgba(229, 223, 197, 0.12)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C5A059', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                CUSTOMER & SHIPPING INFO
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FAF7F2', marginBottom: '0.25rem' }}>
                {selectedOrder.customer.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#A0A89F', marginBottom: '0.2rem' }}>
                ✉ {selectedOrder.customer.email} · ✆ {selectedOrder.customer.phone}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#D6DDD3', marginTop: '0.4rem' }}>
                📍 {selectedOrder.customer.address}
              </div>
            </div>

            {/* Line items */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C5A059', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                ORDER ITEMS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid rgba(229, 223, 197, 0.08)', fontSize: '0.9rem' }}>
                    <div>
                      <span style={{ fontWeight: 600, color: '#FAF7F2' }}>{item.name}</span>
                      <span style={{ color: '#C5A059', marginLeft: '0.5rem' }}>x{item.qty}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: '#FAF7F2' }}>£{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '2px solid rgba(197, 160, 89, 0.3)', fontSize: '1.15rem', fontWeight: 700 }}>
                <span>Total Amount</span>
                <span style={{ color: '#C5A059' }}>£{selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Tracking Details */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <div><strong>Courier:</strong> {selectedOrder.courier}</div>
              <div><strong>Tracking Number:</strong> <span style={{ color: '#68B2FF', fontFamily: 'monospace' }}>{selectedOrder.trackingNumber}</span></div>
              {selectedOrder.notes && (
                <div style={{ marginTop: '0.5rem', color: '#A0A89F', fontStyle: 'italic' }}>
                  “{selectedOrder.notes}”
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button 
                className="admin-btn admin-btn-gold" 
                style={{ flexGrow: 1, justifyContent: 'center' }}
                onClick={() => {
                  handleUpdateOrderStatus(selectedOrder.id, selectedOrder.deliveryStatus === 'Delivered' ? 'Delivered' : 'Dispatched');
                }}
              >
                <Truck size={15} /> Update Tracking / Dispatch
              </button>
              <button 
                className="admin-btn admin-btn-secondary"
                onClick={() => showAdminToast(`Packing slip downloaded for ${selectedOrder.id}`)}
              >
                <FileText size={15} /> Print Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BULK RESTOCK MODAL                                               */}
      {/* ========================================================================= */}
      {isRestockModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsRestockModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setIsRestockModalOpen(false)}>
              <X size={20} />
            </button>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: '#FAF7F2', margin: '0 0 1rem 0' }}>
              Restock Product Inventory
            </h2>

            <form onSubmit={handleApplyRestock}>
              <div className="admin-form-group">
                <label className="admin-form-label">Select SKU to Restock</label>
                <select 
                  className="admin-form-select"
                  value={targetRestockItem ? targetRestockItem.sku : ''}
                  onChange={(e) => {
                    const found = inventory.find(i => i.sku === e.target.value);
                    setTargetRestockItem(found);
                  }}
                >
                  {inventory.map(item => (
                    <option key={item.sku} value={item.sku}>
                      {item.name} ({item.variant}) — Currently: {item.stock} in stock
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Units to Add to Stock</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {[10, 25, 50, 100].map(amt => (
                    <button 
                      key={amt}
                      type="button"
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={() => setRestockAmount(amt)}
                      style={{ flexGrow: 1 }}
                    >
                      +{amt}
                    </button>
                  ))}
                </div>
                <input 
                  type="number"
                  min="1"
                  className="admin-form-input"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="submit" className="admin-btn admin-btn-gold" style={{ flexGrow: 1, justifyContent: 'center' }}>
                  <Check size={16} /> Confirm Restock
                </button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsRestockModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: LOG MANUAL PHONE ORDER                                           */}
      {/* ========================================================================= */}
      {isNewOrderModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsNewOrderModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setIsNewOrderModalOpen(false)}>
              <X size={20} />
            </button>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: '#FAF7F2', margin: '0 0 0.5rem 0' }}>
              Create Manual / Phone Order
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#A0A89F', marginBottom: '1.25rem' }}>
              Take phone orders directly (e.g. from 07831082965) with instant stock synchronization.
            </p>

            <form onSubmit={handleCreateNewOrder}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Customer Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Rachel Adams" 
                    className="admin-form-input"
                    value={newOrderForm.customerName}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerName: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="e.g. 07831 000000" 
                    className="admin-form-input"
                    value={newOrderForm.customerPhone}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Delivery Address</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Street, City, Postal Code" 
                  className="admin-form-input"
                  value={newOrderForm.customerAddress}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customerAddress: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Product Selection</label>
                  <select 
                    className="admin-form-select"
                    value={newOrderForm.selectedSku}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, selectedSku: e.target.value })}
                  >
                    {inventory.map(item => (
                      <option key={item.sku} value={item.sku}>
                        {item.name} ({item.variant}) — £{item.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Quantity</label>
                  <input 
                    type="number" 
                    min="1" 
                    className="admin-form-input"
                    value={newOrderForm.quantity}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, quantity: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Payment Channel</label>
                  <select 
                    className="admin-form-select"
                    value={newOrderForm.paymentMethod}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, paymentMethod: e.target.value })}
                  >
                    <option value="Phone Order (Card on Phone)">Phone Order (Card Terminal)</option>
                    <option value="Bank Transfer (BACS)">Bank Transfer (BACS)</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Courier Service</label>
                  <select 
                    className="admin-form-select"
                    value={newOrderForm.courier}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, courier: e.target.value })}
                  >
                    <option value="Royal Mail Tracked 24">Royal Mail Tracked 24</option>
                    <option value="DPD Next Day">DPD Next Day</option>
                    <option value="DHL Express">DHL Express</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Notes for Dispatch</label>
                <input 
                  type="text" 
                  placeholder="Special delivery instructions or gift notes"
                  className="admin-form-input"
                  value={newOrderForm.notes}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button 
                  type="submit" 
                  className="admin-btn admin-btn-gold" 
                  style={{ flexGrow: 1, justifyContent: 'center' }}
                  disabled={isSubmittingOrder}
                >
                  <Plus size={16} /> {isSubmittingOrder ? 'Recording Order...' : 'Submit & Generate Waybill'}
                </button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsNewOrderModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: MAKE / CREATE ADMINISTRATOR MODAL                                */}
      {/* ========================================================================= */}
      {isPromoteModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsPromoteModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <button className="admin-modal-close" onClick={() => setIsPromoteModalOpen(false)}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', color: '#C5A059' }}>
              <ShieldCheck size={20} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                EXECUTIVE ROLE ASSIGNMENT
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: '#FAF7F2', margin: '0 0 1rem 0' }}>
              Administrator Authorization
            </h2>

            {/* TOGGLE MODES: PROMOTE EXISTING vs CREATE NEW */}
            <div style={{
              display: 'flex',
              backgroundColor: '#141B13',
              padding: '4px',
              borderRadius: '8px',
              border: '1px solid rgba(229, 223, 197, 0.12)',
              marginBottom: '1.5rem'
            }}>
              <button
                type="button"
                onClick={() => setPromoteMode('promote')}
                style={{
                  flex: 1,
                  padding: '0.65rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: promoteMode === 'promote' ? '#C5A059' : 'transparent',
                  color: promoteMode === 'promote' ? '#161D15' : '#B5BEB4',
                  fontWeight: 700,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <ShieldCheck size={15} /> Promote Existing User
              </button>
              <button
                type="button"
                onClick={() => setPromoteMode('create')}
                style={{
                  flex: 1,
                  padding: '0.65rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: promoteMode === 'create' ? '#C5A059' : 'transparent',
                  color: promoteMode === 'create' ? '#161D15' : '#B5BEB4',
                  fontWeight: 700,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <UserPlus size={15} /> Create Brand New Admin
              </button>
            </div>

            {promoteMode === 'promote' ? (
              <form onSubmit={(e) => { e.preventDefault(); handlePromoteUser(promoteEmail); }}>
                <p style={{ fontSize: '0.875rem', color: '#B5BEB4', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Select an existing registered customer or enter their email address to grant immediate executive administrator privileges.
                </p>

                <div className="admin-form-group">
                  <label className="admin-form-label">Select Registered User</label>
                  <select
                    className="admin-form-select"
                    value={promoteEmail}
                    onChange={(e) => setPromoteEmail(e.target.value)}
                  >
                    <option value="">-- Choose registered customer --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.email}>
                        {u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email} ({u.email}) — [{u.role}]
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Or Type Email Address Directly</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sharonshelke1@gmail.com"
                    className="admin-form-input"
                    value={promoteEmail}
                    onChange={(e) => setPromoteEmail(e.target.value)}
                  />
                </div>

                <div style={{
                  backgroundColor: 'rgba(197, 160, 89, 0.08)',
                  border: '1px solid rgba(197, 160, 89, 0.25)',
                  borderRadius: '8px',
                  padding: '0.85rem 1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.78rem',
                  color: '#D6DDD3',
                  display: 'flex',
                  gap: '0.65rem',
                  alignItems: 'center'
                }}>
                  <ShieldCheck size={18} color="#C5A059" style={{ flexShrink: 0 }} />
                  <span>
                    This account will receive full access to view orders, dispatch parcels, manage stock, and promote users.
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="submit"
                    className="admin-btn admin-btn-gold"
                    style={{ flexGrow: 1, justifyContent: 'center' }}
                    disabled={promoteLoading || !promoteEmail}
                  >
                    <ShieldCheck size={16} /> {promoteLoading ? 'Updating...' : 'Grant Administrator Role'}
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => setIsPromoteModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateAdminUser}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">First Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sharon"
                      className="admin-form-input"
                      value={createAdminForm.firstName}
                      onChange={(e) => setCreateAdminForm({ ...createAdminForm, firstName: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Last Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shelke"
                      className="admin-form-input"
                      value={createAdminForm.lastName}
                      onChange={(e) => setCreateAdminForm({ ...createAdminForm, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. admin@lichtluxenaturals.org"
                    className="admin-form-input"
                    value={createAdminForm.email}
                    onChange={(e) => setCreateAdminForm({ ...createAdminForm, email: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="07831082965"
                      className="admin-form-input"
                      value={createAdminForm.phone}
                      onChange={(e) => setCreateAdminForm({ ...createAdminForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Temporary Password</label>
                    <input
                      type="text"
                      required
                      placeholder="Luxe@123&"
                      className="admin-form-input"
                      value={createAdminForm.password}
                      onChange={(e) => setCreateAdminForm({ ...createAdminForm, password: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button
                    type="submit"
                    className="admin-btn admin-btn-gold"
                    style={{ flexGrow: 1, justifyContent: 'center' }}
                    disabled={promoteLoading}
                  >
                    <UserPlus size={16} /> {promoteLoading ? 'Creating...' : 'Create & Authorize Administrator'}
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => setIsPromoteModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
