'use client';

import React, { useState, useEffect, useRef } from 'react';

// Safely initialize Firebase messaging on client side if config exists
let firebaseApp = null;
let messaging = null;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com` : '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com` : '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (
  typeof window !== 'undefined' &&
  firebaseConfig.apiKey &&
  firebaseConfig.messagingSenderId
) {
  try {
    const { initializeApp } = require('firebase/app');
    const { getMessaging } = require('firebase/messaging');
    firebaseApp = initializeApp(firebaseConfig);
    messaging = getMessaging(firebaseApp);
  } catch (err) {
    console.warn('Firebase Messaging failed to initialize:', err);
  }
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Data
  const [subscribers, setSubscribers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [upiConfig, setUpiConfig] = useState({ upiId: '', payeeName: '' });
  const [loadingData, setLoadingData] = useState(false);
  
  // UI Tabs & Filters
  const [activeTab, setActiveTab] = useState('subscribers');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  // FCM and Logs
  const [fcmToken, setFcmToken] = useState('');
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [fcmLog, setFcmLog] = useState('');
  const [fcmConfigStatus, setFcmConfigStatus] = useState('uninitialized');

  // Actions states
  const [updatingPrices, setUpdatingPrices] = useState(false);
  const [updatingUpi, setUpdatingUpi] = useState(false);
  const [runningAlertCheck, setRunningAlertCheck] = useState(false);
  const [extensionDates, setExtensionDates] = useState({}); // { subscriberId: 'yyyy-MM-dd' }

  // Check auth cookie on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/admin/login');
        const data = await res.json();
        if (res.ok && data.authenticated) {
          setIsAuthenticated(true);
          fetchDashboardData();
        }
      } catch (err) {
        console.error('Session check failed', err);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkSession();
  }, []);

  // Update browser permission status on client
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Register Service worker and FCM token if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      registerFcm();
    }
  }, [isAuthenticated]);

  const registerFcm = async () => {
    if (!firebaseApp || !messaging) {
      setFcmConfigStatus('missing_env');
      return;
    }

    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setFcmLog('Web push is not supported in this browser.');
        setFcmConfigStatus('unsupported');
        return;
      }

      setFcmConfigStatus('initializing');
      
      // Register service worker with search parameters for dynamic config
      const queryParams = new URLSearchParams(firebaseConfig).toString();
      const registration = await navigator.serviceWorker.register(
        `/firebase-messaging-sw.js?${queryParams}`,
        { scope: '/wp-content/' } // Keep in sub-scope or root
      );

      const { getToken } = require('firebase/messaging');
      
      // Get device FCM token
      const token = await getToken(messaging, {
        serviceWorkerRegistration: registration,
        // Optional VAPID key:
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      });

      if (token) {
        setFcmToken(token);
        setFcmConfigStatus('connected');
        
        // Save token to backend database
        await fetch('/api/admin/fcm-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
      } else {
        setFcmLog('Failed to retrieve FCM token. Ensure notification permission is granted.');
        setFcmConfigStatus('denied');
      }
    } catch (err) {
      console.warn('FCM Setup failed:', err);
      setFcmLog(`FCM init error: ${err.message}`);
      setFcmConfigStatus('error');
    }
  };

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        registerFcm();
      }
    }
  };

  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      // Fetch Subscribers
      const subRes = await fetch('/api/subscribers');
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscribers(subData.subscribers || []);
      }

      // Fetch Plans
      const plansRes = await fetch('/api/plans');
      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData.plans || []);
      }

      // Fetch settings
      const settingsRes = await fetch('/api/settings');
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setUpiConfig(settingsData.settings || { upiId: '', payeeName: '' });
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        fetchDashboardData();
      } else {
        setLoginError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Server authentication failed');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setPassword('');
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  // Plan modification save
  const handleUpdatePrice = async (id, price) => {
    setUpdatingPrices(true);
    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, price })
      });
      const data = await res.json();
      if (data.success) {
        alert(`${id} price updated successfully!`);
        fetchDashboardData();
      } else {
        alert(data.message || 'Failed to update plan price');
      }
    } catch (err) {
      alert('Network error saving plan price');
    } finally {
      setUpdatingPrices(false);
    }
  };

  // UPI configuration save
  const handleUpdateUpi = async (e) => {
    e.preventDefault();
    setUpdatingUpi(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          upiId: upiConfig.upiId,
          payeeName: upiConfig.payeeName
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('UPI configurations updated successfully!');
        fetchDashboardData();
      } else {
        alert(data.message || 'Failed to save settings');
      }
    } catch (err) {
      alert('Network error saving settings');
    } finally {
      setUpdatingUpi(false);
    }
  };

  // Subscriber modification: Approve
  const handleApproveSubscriber = async (id) => {
    if (!confirm('Are you sure you want to approve this subscription receipt?')) return;
    try {
      const res = await fetch('/api/subscribers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'approved' })
      });
      if (res.ok) {
        fetchDashboardData();
      } else {
        alert('Failed to approve subscription');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Subscriber modification: Delete
  const handleDeleteSubscriber = async (id) => {
    if (!confirm('Are you sure you want to delete this subscriber entry permanently?')) return;
    try {
      const res = await fetch('/api/subscribers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchDashboardData();
      } else {
        alert('Failed to delete subscriber');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Subscriber modification: Extend endDate
  const handleExtendSubscription = async (id) => {
    const selectedDate = extensionDates[id];
    if (!selectedDate) {
      alert('Please select an end date first');
      return;
    }
    try {
      const formattedDate = new Date(selectedDate).toISOString();
      const res = await fetch('/api/subscribers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, endDate: formattedDate })
      });
      if (res.ok) {
        alert('Subscription end date updated!');
        fetchDashboardData();
      } else {
        alert('Failed to update subscription end date');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Run Expiration check & notify admin
  const handleTriggerNotifyExpiring = async () => {
    setRunningAlertCheck(true);
    setFcmLog('Checking subscriptions expiring within 3 days...');
    try {
      const res = await fetch('/api/admin/notify-expiring', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        const count = data.expiringSubscribers?.length || 0;
        let summary = `Found ${count} subscriber(s) expiring within 3 days.`;
        if (count > 0) {
          summary += `\nSubscribers: ` + data.expiringSubscribers.map(s => `${s.name} (${s.daysLeft}d left)`).join(', ');
          
          // Trigger local HTML5 notification on browser if allowed as fallback
          if (typeof window !== 'undefined' && Notification.permission === 'granted') {
            data.expiringSubscribers.forEach(sub => {
              new Notification('Subscription Expiring Soon!', {
                body: `${sub.name} is ending in ${sub.daysLeft} day(s). Contact: ${sub.phone}`,
                icon: '/wp-content/uploads/sites/57/2025/05/Progym-Fav-Icon.png'
              });
            });
          }
        }
        setFcmLog(`${summary}\n\nFCM Service Status: ${data.fcmStatus}`);
      } else {
        setFcmLog(`Scan failed: ${data.error || 'Server error'}`);
      }
    } catch (err) {
      setFcmLog(`Scan error: ${err.message}`);
    } finally {
      setRunningAlertCheck(false);
    }
  };

  // Helper selectors/calculations
  const activeMembers = subscribers.filter(sub => {
    return sub.status === 'approved' && new Date(sub.endDate) > new Date();
  });

  const totalRevenue = subscribers
    .filter(sub => sub.status === 'approved')
    .reduce((sum, sub) => sum + (Number(sub.pricePaid) || 0), 0);

  const pendingApprovals = subscribers.filter(sub => sub.status === 'pending_approval');

  // Check ending within 3 days
  const endingSoonCount = subscribers.filter(sub => {
    if (sub.status !== 'approved') return false;
    const diffTime = new Date(sub.endDate) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  }).length;

  // Filter & Search subscribers
  const filteredSubscribers = subscribers.filter(sub => {
    // Search
    const searchMatch =
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.phone.includes(searchTerm) ||
      (sub.transactionId && sub.transactionId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Status filter
    let statusMatch = true;
    const isExpired = new Date(sub.endDate) < new Date() && sub.status === 'approved';
    if (statusFilter === 'pending') {
      statusMatch = sub.status === 'pending_approval';
    } else if (statusFilter === 'active') {
      statusMatch = sub.status === 'approved' && !isExpired;
    } else if (statusFilter === 'expired') {
      statusMatch = isExpired;
    }

    // Plan filter
    let planMatch = true;
    if (planFilter !== 'all') {
      planMatch = sub.planId === planFilter;
    }

    return searchMatch && statusMatch && planMatch;
  });

  if (checkingAuth) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0c0c0c',
        color: '#ffffff',
        fontFamily: "'Montserrat', sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #333333',
            borderTop: '4px solid #ff5e14',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px auto'
          }}></div>
          <div>Verifying Admin Session...</div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0c0c0c',
        color: '#ffffff',
        fontFamily: "'Montserrat', sans-serif",
        padding: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#141414',
          border: '1px solid #222222',
          borderRadius: '12px',
          padding: '40px 30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          textAlign: 'center'
        }}>
          <h2 style={{
            color: '#ff5e14',
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '10px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            SS FITNESS ADMIN
          </h2>
          <p style={{ color: '#a3a3a3', fontSize: '13px', marginBottom: '30px' }}>
            Enter your domain password to access the dashboard controls.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label htmlFor="admin-pass-input" style={{ display: 'block', fontSize: '12px', color: '#a3a3a3', marginBottom: '8px' }}>
                Admin Password
              </label>
              <input
                type="password"
                id="admin-pass-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#1b1b1b',
                  border: '1px solid #333333',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>

            {loginError && (
              <div style={{
                color: '#ff4444',
                fontSize: '13px',
                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '20px',
                borderLeft: '3px solid #ff4444'
              }}>
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="elementor-button elementor-size-sm"
              style={{
                width: '100%',
                padding: '14px',
                fontWeight: 'bold',
                backgroundColor: '#ff5e14',
                color: '#ffffff',
                border: 'none',
                textTransform: 'uppercase',
                borderRadius: '6px',
                cursor: 'pointer',
                letterSpacing: '0.5px'
              }}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#0c0c0c',
      color: '#ffffff',
      fontFamily: "'Montserrat', sans-serif",
      minHeight: '90vh',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Admin Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #222222',
          paddingBottom: '20px',
          marginBottom: '35px'
        }}>
          <div>
            <span style={{ color: '#ff5e14', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Management Console
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '5px 0 0 0', textTransform: 'uppercase' }}>
              S S Royal Fitness
            </h1>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1b1b1b',
              border: '1px solid #333333',
              borderRadius: '4px',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#ff5e14'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#1b1b1b'}
          >
            Log Out
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '35px'
        }}>
          {/* Stat 1 */}
          <div style={{
            backgroundColor: '#141414',
            border: '1px solid #222222',
            borderRadius: '8px',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '12px', color: '#a3a3a3', textTransform: 'uppercase', fontWeight: '600' }}>Total Revenue</div>
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#ff5e14', marginTop: '10px' }}>₹{totalRevenue}</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: '#ff5e14' }}></div>
          </div>
          {/* Stat 2 */}
          <div style={{
            backgroundColor: '#141414',
            border: '1px solid #222222',
            borderRadius: '8px',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '12px', color: '#a3a3a3', textTransform: 'uppercase', fontWeight: '600' }}>Active Members</div>
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#ffffff', marginTop: '10px' }}>{activeMembers.length}</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: '#a3a3a3' }}></div>
          </div>
          {/* Stat 3 */}
          <div style={{
            backgroundColor: '#141414',
            border: '1px solid #222222',
            borderRadius: '8px',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '12px', color: '#a3a3a3', textTransform: 'uppercase', fontWeight: '600' }}>Expiring Soon (3 days)</div>
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: endingSoonCount > 0 ? '#ffb700' : '#ffffff', marginTop: '10px' }}>{endingSoonCount}</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: endingSoonCount > 0 ? '#ffb700' : '#222222' }}></div>
          </div>
          {/* Stat 4 */}
          <div style={{
            backgroundColor: '#141414',
            border: '1px solid #222222',
            borderRadius: '8px',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '12px', color: '#a3a3a3', textTransform: 'uppercase', fontWeight: '600' }}>Pending Approvals</div>
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: pendingApprovals.length > 0 ? '#ff5e14' : '#ffffff', marginTop: '10px' }}>{pendingApprovals.length}</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: pendingApprovals.length > 0 ? '#ff5e14' : '#222222' }}></div>
          </div>
        </div>

        {/* Tab Controls */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid #222222',
          marginBottom: '30px',
          gap: '15px'
        }}>
          <button
            onClick={() => setActiveTab('subscribers')}
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'subscribers' ? '3px solid #ff5e14' : '3px solid transparent',
              color: activeTab === 'subscribers' ? '#ffffff' : '#a3a3a3',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            Subscribers List
          </button>
          <button
            onClick={() => setActiveTab('prices')}
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'prices' ? '3px solid #ff5e14' : '3px solid transparent',
              color: activeTab === 'prices' ? '#ffffff' : '#a3a3a3',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            Edit Prices
          </button>
          <button
            onClick={() => setActiveTab('upi')}
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'upi' ? '3px solid #ff5e14' : '3px solid transparent',
              color: activeTab === 'upi' ? '#ffffff' : '#a3a3a3',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            UPI Settings
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'notifications' ? '3px solid #ff5e14' : '3px solid transparent',
              color: activeTab === 'notifications' ? '#ffffff' : '#a3a3a3',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            FCM Notifications
          </button>
        </div>

        {/* Tab Contents: 1. Subscribers */}
        {activeTab === 'subscribers' && (
          <div>
            {/* Filters Bar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '15px',
              marginBottom: '20px',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Search by name, phone or UTR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: '2',
                  minWidth: '250px',
                  padding: '10px 15px',
                  backgroundColor: '#141414',
                  border: '1px solid #333333',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  flex: '1',
                  minWidth: '150px',
                  padding: '10px 15px',
                  backgroundColor: '#141414',
                  border: '1px solid #333333',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none'
                }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Approval</option>
                <option value="active">Active Plan</option>
                <option value="expired">Expired Plan</option>
              </select>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                style={{
                  flex: '1',
                  minWidth: '150px',
                  padding: '10px 15px',
                  backgroundColor: '#141414',
                  border: '1px solid #333333',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none'
                }}
              >
                <option value="all">All Plans</option>
                <option value="1_month">1 Month</option>
                <option value="3_months">3 Months</option>
                <option value="6_months">6 Months</option>
                <option value="1_year">1 Year</option>
              </select>
              <button
                onClick={fetchDashboardData}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#222222',
                  border: '1px solid #333333',
                  borderRadius: '4px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}
              >
                ↻ Refresh
              </button>
            </div>

            {loadingData ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Loading subscribers...</div>
            ) : filteredSubscribers.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '50px 20px',
                backgroundColor: '#141414',
                borderRadius: '8px',
                border: '1px solid #222222',
                color: '#a3a3a3'
              }}>
                No subscriber records found.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  backgroundColor: '#141414',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  fontSize: '13px',
                  textAlign: 'left'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#1d1d1d', color: '#a3a3a3', borderBottom: '1px solid #222222' }}>
                      <th style={{ padding: '15px' }}>Subscriber Info</th>
                      <th style={{ padding: '15px' }}>Plan Duration</th>
                      <th style={{ padding: '15px' }}>Price Paid</th>
                      <th style={{ padding: '15px' }}>UTR / Transaction ID</th>
                      <th style={{ padding: '15px' }}>Membership Dates</th>
                      <th style={{ padding: '15px' }}>Status</th>
                      <th style={{ padding: '15px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((sub) => {
                      const isExpired = new Date(sub.endDate) < new Date() && sub.status === 'approved';
                      const planName = plans.find(p => p.id === sub.planId)?.name || sub.planId;
                      
                      return (
                        <tr key={sub._id || sub.id} style={{ borderBottom: '1px solid #222222' }}>
                          {/* Name & Phone */}
                          <td style={{ padding: '15px' }}>
                            <div style={{ fontWeight: 'bold', color: '#ffffff' }}>{sub.name}</div>
                            <div style={{ color: '#a3a3a3', fontSize: '11px', marginTop: '2px' }}>{sub.phone}</div>
                          </td>
                          
                          {/* Plan */}
                          <td style={{ padding: '15px' }}>
                            <span style={{
                              backgroundColor: '#1d1d1d',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>
                              {planName}
                            </span>
                          </td>
                          
                          {/* Price */}
                          <td style={{ padding: '15px', fontWeight: 'bold', color: '#ff5e14' }}>
                            ₹{sub.pricePaid}
                          </td>
                          
                          {/* Transaction ID */}
                          <td style={{ padding: '15px', fontFamily: 'monospace', color: '#cccccc' }}>
                            {sub.transactionId}
                          </td>
                          
                          {/* Dates */}
                          <td style={{ padding: '15px', lineHeight: '1.4' }}>
                            <div style={{ fontSize: '11px', color: '#a3a3a3' }}>
                              Start: <span style={{ color: '#ffffff' }}>{new Date(sub.startDate).toLocaleDateString()}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#a3a3a3' }}>
                              End: <span style={{ color: isExpired ? '#ff4444' : '#ffffff', fontWeight: isExpired ? 'bold' : 'normal' }}>
                                {new Date(sub.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          
                          {/* Status */}
                          <td style={{ padding: '15px' }}>
                            {sub.status === 'pending_approval' ? (
                              <span style={{ color: '#ff5e14', backgroundColor: 'rgba(255, 94, 20, 0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                                Pending Approval
                              </span>
                            ) : isExpired ? (
                              <span style={{ color: '#ff4444', backgroundColor: 'rgba(255, 68, 68, 0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                                Expired Plan
                              </span>
                            ) : (
                              <span style={{ color: '#25d366', backgroundColor: 'rgba(37, 211, 102, 0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                                Active
                              </span>
                            )}
                          </td>
                          
                          {/* Actions */}
                          <td style={{ padding: '15px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                              
                              {/* Pending approval flow */}
                              {sub.status === 'pending_approval' && (
                                <button
                                  onClick={() => handleApproveSubscriber(sub._id)}
                                  style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#25d366',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    fontSize: '11px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Approve
                                </button>
                              )}

                              {/* Active/Expired extend dates form */}
                              {sub.status === 'approved' && (
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <input 
                                    type="date"
                                    value={extensionDates[sub._id] || ''}
                                    onChange={(e) => setExtensionDates(prev => ({ ...prev, [sub._id]: e.target.value }))}
                                    style={{
                                      padding: '4px 6px',
                                      backgroundColor: '#1b1b1b',
                                      border: '1px solid #333333',
                                      borderRadius: '4px',
                                      color: '#ffffff',
                                      fontSize: '11px'
                                    }}
                                  />
                                  <button
                                    onClick={() => handleExtendSubscription(sub._id)}
                                    style={{
                                      padding: '6px 10px',
                                      backgroundColor: '#ff5e14',
                                      color: '#ffffff',
                                      border: 'none',
                                      borderRadius: '4px',
                                      fontWeight: 'bold',
                                      fontSize: '11px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Extend
                                  </button>
                                </div>
                              )}

                              {/* Delete option */}
                              <button
                                onClick={() => handleDeleteSubscriber(sub._id)}
                                style={{
                                  padding: '6px 10px',
                                  backgroundColor: '#222222',
                                  color: '#ff4444',
                                  border: '1px solid #333333',
                                  borderRadius: '4px',
                                  fontWeight: 'bold',
                                  fontSize: '11px',
                                  cursor: 'pointer'
                                }}
                              >
                                Delete
                              </button>

                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab Contents: 2. Edit Prices */}
        {activeTab === 'prices' && (
          <div style={{
            backgroundColor: '#141414',
            border: '1px solid #222222',
            borderRadius: '8px',
            padding: '30px',
            maxWidth: '600px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>
              Modify Membership Pricing
            </h3>
            <p style={{ color: '#a3a3a3', fontSize: '13px', marginBottom: '25px', lineHeight: '1.5' }}>
              Adjust the prices below. Changes will immediately reflect dynamically on the subscription pricing grid.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {plans.map(plan => (
                <div key={plan.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '15px',
                  backgroundColor: '#1b1b1b',
                  borderRadius: '6px',
                  borderLeft: '4px solid #ff5e14'
                }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#ffffff' }}>{plan.name}</strong>
                    <div style={{ fontSize: '11px', color: '#a3a3a3', marginTop: '2px' }}>Code: {plan.id}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#a3a3a3', fontWeight: 'bold' }}>₹</span>
                    <input
                      type="number"
                      defaultValue={plan.price}
                      id={`price-input-${plan.id}`}
                      style={{
                        width: '100px',
                        padding: '8px 10px',
                        backgroundColor: '#141414',
                        border: '1px solid #333333',
                        borderRadius: '4px',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        outline: 'none'
                      }}
                    />
                    <button
                      disabled={updatingPrices}
                      onClick={() => {
                        const inputVal = document.getElementById(`price-input-${plan.id}`).value;
                        handleUpdatePrice(plan.id, inputVal);
                      }}
                      style={{
                        padding: '8px 15px',
                        backgroundColor: '#ff5e14',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Contents: 3. UPI Settings */}
        {activeTab === 'upi' && (
          <div style={{
            backgroundColor: '#141414',
            border: '1px solid #222222',
            borderRadius: '8px',
            padding: '30px',
            maxWidth: '600px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>
              Configure UPI Payment ID
            </h3>
            <p style={{ color: '#a3a3a3', fontSize: '13px', marginBottom: '25px', lineHeight: '1.5' }}>
              Change the target UPI address and display payee name. The user payment modal generates QR codes and deep links dynamically based on this config.
            </p>

            <form onSubmit={handleUpdateUpi}>
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="upi-id-input" style={{ display: 'block', fontSize: '12px', color: '#a3a3a3', marginBottom: '8px' }}>
                  UPI ID (VPA)
                </label>
                <input
                  type="text"
                  id="upi-id-input"
                  value={upiConfig.upiId}
                  onChange={(e) => setUpiConfig(prev => ({ ...prev, upiId: e.target.value }))}
                  placeholder="name@upi / phone@ybl"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1b1b1b',
                    border: '1px solid #333333',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label htmlFor="payee-name-input" style={{ display: 'block', fontSize: '12px', color: '#a3a3a3', marginBottom: '8px' }}>
                  Payee / Account Holder Name
                </label>
                <input
                  type="text"
                  id="payee-name-input"
                  value={upiConfig.payeeName}
                  onChange={(e) => setUpiConfig(prev => ({ ...prev, payeeName: e.target.value }))}
                  placeholder="e.g. KRISHNA CHOWDARY"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1b1b1b',
                    border: '1px solid #333333',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={updatingUpi}
                style={{
                  padding: '12px 25px',
                  backgroundColor: '#ff5e14',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                {updatingUpi ? 'Saving Configurations...' : 'Save UPI Config'}
              </button>
            </form>
          </div>
        )}

        {/* Tab Contents: 4. FCM Notifications */}
        {activeTab === 'notifications' && (
          <div style={{
            backgroundColor: '#141414',
            border: '1px solid #222222',
            borderRadius: '8px',
            padding: '30px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>
              Firebase Push Alerts Setup
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px'
            }}>
              
              {/* Token Registration Panel */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#ff5e14', marginBottom: '15px' }}>
                  Device Registration
                </h4>
                
                <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#a3a3a3' }}>Browser Permissions:</span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: notificationPermission === 'granted' ? 'rgba(37, 211, 102, 0.1)' : 'rgba(255, 68, 68, 0.1)',
                    color: notificationPermission === 'granted' ? '#25d366' : '#ff4444'
                  }}>
                    {notificationPermission.toUpperCase()}
                  </span>
                </div>

                {notificationPermission !== 'granted' && (
                  <button
                    onClick={requestNotificationPermission}
                    style={{
                      padding: '10px 15px',
                      backgroundColor: '#ff5e14',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      cursor: 'pointer',
                      marginBottom: '20px'
                    }}
                  >
                    Enable Push Permissions
                  </button>
                )}

                <div style={{ marginBottom: '15px' }}>
                  <span style={{ fontSize: '13px', color: '#a3a3a3', display: 'block', marginBottom: '5px' }}>
                    FCM Connection State:
                  </span>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    backgroundColor: '#1b1b1b',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #333333',
                    color: fcmConfigStatus === 'connected' ? '#25d366' : '#cccccc'
                  }}>
                    {fcmConfigStatus === 'connected' && '✓ Firebase Active: FCM Token Registered'}
                    {fcmConfigStatus === 'missing_env' && 'ℹ Simulated Mode: Server push not active (FCM Env variables missing).'}
                    {fcmConfigStatus === 'initializing' && 'Connecting to FCM services...'}
                    {fcmConfigStatus === 'uninitialized' && 'Awaiting initialization.'}
                    {fcmConfigStatus === 'error' && 'Error initializing. Browser notifications fallback enabled.'}
                  </div>
                </div>

                {fcmToken && (
                  <div style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '12px', color: '#a3a3a3', display: 'block', marginBottom: '5px' }}>
                      Device Token:
                    </span>
                    <input
                      type="text"
                      readOnly
                      value={fcmToken}
                      onClick={(e) => {
                        e.target.select();
                        navigator.clipboard.writeText(fcmToken);
                        alert('Token copied!');
                      }}
                      style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: '#1b1b1b',
                        border: '1px solid #333333',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        color: '#cccccc',
                        cursor: 'pointer'
                      }}
                    />
                    <small style={{ color: '#a3a3a3', fontSize: '10px', display: 'block', marginTop: '4px' }}>
                      Click field to copy token.
                    </small>
                  </div>
                )}
              </div>

              {/* Push Trigger Alerts */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#ff5e14', marginBottom: '15px' }}>
                  Billing Notifications Scanner
                </h4>
                <p style={{ color: '#a3a3a3', fontSize: '12px', lineHeight: '1.5', marginBottom: '20px' }}>
                  Scan the database for approved members whose subscriptions expire in 3 days. When found, push alerts are sent to the admin.
                </p>

                <button
                  disabled={runningAlertCheck}
                  onClick={handleTriggerNotifyExpiring}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#ff5e14',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    cursor: 'pointer',
                    width: '100%',
                    textTransform: 'uppercase'
                  }}
                >
                  {runningAlertCheck ? 'Scanning Subscribers...' : '⚡ Scan & Notify Admin'}
                </button>

                <div style={{ marginTop: '20px' }}>
                  <span style={{ fontSize: '12px', color: '#a3a3a3', display: 'block', marginBottom: '5px' }}>
                    Alert Engine Console Logs:
                  </span>
                  <div style={{
                    backgroundColor: '#0c0c0c',
                    border: '1px solid #333333',
                    borderRadius: '4px',
                    padding: '15px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    minHeight: '120px',
                    color: '#25d366',
                    whiteSpace: 'pre-wrap',
                    overflowY: 'auto'
                  }}>
                    {fcmLog || 'Console Idle. Ready to scan.'}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
