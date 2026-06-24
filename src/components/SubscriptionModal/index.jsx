'use client';

import React, { useState } from 'react';

export default function SubscriptionModal({ isOpen, onClose, plan, upiConfig }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    transactionId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please fill out all fields');
      return;
    }
    setStep(2);
  };


  const upiId = upiConfig?.upiId || '8247312751@ibl';
  const payeeName = upiConfig?.payeeName || 'krishna chowdary';
  
  // Full URL containing details, optimized for QR scanning
  const upiQrUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${plan.price}&cu=INR&tn=SS_FITNESS_${plan.id.toUpperCase()}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiQrUrl)}`;

  // Mobile App Intent URIs (Standard and Clean P2P fallbacks)
  const upiIntentFull = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${plan.price}&cu=INR&tn=SS_FITNESS_${plan.id.toUpperCase()}`;
  const upiIntentClean = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&cu=INR`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.transactionId) {
      alert('Please enter your payment Transaction ID / Reference Number');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          planId: plan.id,
          pricePaid: plan.price,
          transactionId: formData.transactionId
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
      } else {
        alert(data.message || 'Error submitting registration');
      }
    } catch (err) {
      console.error(err);
      alert('Network error submitting payment verification');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#141414',
        border: '1px solid #222222',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '480px',
        padding: '30px',
        position: 'relative',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        fontFamily: "'Montserrat', sans-serif",
        color: '#ffffff'
      }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#a3a3a3',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '5px'
          }}
          aria-label="Close modal"
        >
          &times;
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(37, 211, 102, 0.1)', 
              color: '#25d366', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '32px', 
              margin: '0 auto 20px auto',
              fontWeight: 'bold'
            }}>
              ✓
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Submitted!</h3>
            <p style={{ color: '#a3a3a3', fontSize: '14px', lineHeight: '1.6', margin: '0 0 25px 0' }}>
              Your payment verification has been submitted successfully. The admin will verify and activate your plan.
            </p>
            <button 
              onClick={onClose}
              className="elementor-button elementor-size-sm"
              style={{
                width: '100%',
                padding: '12px',
                fontWeight: 'bold',
                backgroundColor: '#ff5e14',
                color: '#ffffff',
                border: 'none',
                textTransform: 'uppercase',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#ff5e14', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>SS Fitness Plan</span>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '5px 0 0 0' }}>{plan.name}</h3>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff5e14', marginTop: '5px' }}>₹{plan.price}</div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
              <div style={{ flex: 1, height: '4px', backgroundColor: '#ff5e14', borderRadius: '2px' }}></div>
              <div style={{ flex: 1, height: '4px', backgroundColor: step === 2 ? '#ff5e14' : '#333333', borderRadius: '2px' }}></div>
            </div>

            {step === 1 ? (
              <form onSubmit={handleNextStep}>
                <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '15px' }}>Step 1: Contact Details</h4>
                <div style={{ marginBottom: '15px' }}>
                  <label htmlFor="name-input" style={{ display: 'block', fontSize: '12px', color: '#a3a3a3', marginBottom: '6px' }}>Full Name</label>
                  <input 
                    type="text" 
                    id="name-input"
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name" 
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
                  <label htmlFor="phone-input" style={{ display: 'block', fontSize: '12px', color: '#a3a3a3', marginBottom: '6px' }}>Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone-input"
                    name="phone" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number" 
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
                  className="elementor-button elementor-size-sm"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontWeight: 'bold',
                    backgroundColor: '#ff5e14',
                    color: '#ffffff',
                    border: 'none',
                    textTransform: 'uppercase',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Proceed to Payment
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '15px' }}>Step 2: Pay & Submit Transaction</h4>
                
                {/* UPI Intent Section for Mobile */}
                <div className="mobile-only-block" style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '13px', color: '#a3a3a3', marginBottom: '10px', lineHeight: '1.4' }}>
                    If you are on mobile, tap below to launch your UPI app (GPay, PhonePe, Paytm):
                  </p>
                  <a 
                    href={upiIntentFull}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#ff5e14',
                      color: '#ffffff',
                      textDecoration: 'none',
                      padding: '12px',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      textAlign: 'center',
                      boxShadow: '0 4px 10px rgba(255, 94, 20, 0.3)',
                      marginBottom: '10px'
                    }}
                  >
                    ⚡ Pay via UPI App (Auto-fill)
                  </a>
                  
                  <a 
                    href={upiIntentClean}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#222222',
                      color: '#ffffff',
                      textDecoration: 'none',
                      padding: '10px',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      textAlign: 'center',
                      border: '1px solid #333333',
                      marginBottom: '15px'
                    }}
                  >
                    ⚠️ App Error? Tap here (Manual Amount)
                  </a>
                </div>

                {/* QR Code Section for Desktop */}
                <div style={{ textAlign: 'center', marginBottom: '20px', borderTop: '1px solid #222222', paddingTop: '15px' }}>
                  <p style={{ fontSize: '13px', color: '#a3a3a3', marginBottom: '12px', lineHeight: '1.4' }}>
                    Or scan this QR code using PhonePe, Paytm, or GPay:
                  </p>
                  <div style={{
                    backgroundColor: '#ffffff',
                    padding: '10px',
                    borderRadius: '8px',
                    display: 'inline-block',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
                  }}>
                    <img 
                      src={qrCodeUrl} 
                      alt="Payment QR Code" 
                      style={{ display: 'block', width: '130px', height: '130px' }}
                    />
                  </div>
                </div>

                <div style={{ 
                  backgroundColor: 'rgba(0,0,0,0.2)', 
                  padding: '12px', 
                  borderRadius: '6px', 
                  fontSize: '12px', 
                  color: '#cccccc', 
                  marginBottom: '20px',
                  borderLeft: '3px solid #ff5e14'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span>UPI ID: <strong style={{ color: '#ffffff' }}>{upiId}</strong></span>
                    <button 
                      type="button" 
                      onClick={() => {
                        navigator.clipboard.writeText(upiId);
                        alert('UPI ID copied!');
                      }}
                      style={{
                        padding: '2px 8px',
                        backgroundColor: '#1b1b1b',
                        border: '1px solid #333333',
                        color: '#ff5e14',
                        borderRadius: '3px',
                        fontSize: '10px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span>Amount: <strong style={{ color: '#ffffff' }}>₹{plan.price}</strong></span>
                    <button 
                      type="button" 
                      onClick={() => {
                        navigator.clipboard.writeText(plan.price.toString());
                        alert('Amount copied!');
                      }}
                      style={{
                        padding: '2px 8px',
                        backgroundColor: '#1b1b1b',
                        border: '1px solid #333333',
                        color: '#ff5e14',
                        borderRadius: '3px',
                        fontSize: '10px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <div>Account: <strong style={{ color: '#ffffff' }}>{payeeName}</strong></div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="txn-input" style={{ display: 'block', fontSize: '12px', color: '#a3a3a3', marginBottom: '6px' }}>
                    Payment UTR / Transaction ID (Required)
                  </label>
                  <input 
                    type="text" 
                    id="txn-input"
                    name="transactionId" 
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    placeholder="Enter 12-digit UTR or Transaction Ref" 
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

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      fontWeight: 'bold',
                      backgroundColor: '#222222',
                      color: '#ffffff',
                      border: '1px solid #333333',
                      textTransform: 'uppercase',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="elementor-button elementor-size-sm"
                    style={{
                      flex: 2,
                      padding: '12px',
                      fontWeight: 'bold',
                      backgroundColor: '#ff5e14',
                      color: '#ffffff',
                      border: 'none',
                      textTransform: 'uppercase',
                      borderRadius: '4px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.7 : 1
                    }}
                  >
                    {isSubmitting ? 'Verifying...' : 'Submit Receipt'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
