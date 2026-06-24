'use client';

import React, { useState, useEffect } from 'react';
import SubscriptionModal from '../SubscriptionModal';

export default function PricingSection() {
  const [plans, setPlans] = useState([
    { id: '1_month', name: '1 Month Plan', price: 800 },
    { id: '3_months', name: '3 Months Plan', price: 2100 },
    { id: '6_months', name: '6 Months Plan', price: 3500 },
    { id: '1_year', name: '1 Year Plan', price: 6000 }
  ]);
  const [upiConfig, setUpiConfig] = useState({
    upiId: '8309514957@ybl',
    payeeName: 'krishna chowdary'
  });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch dynamic plan prices from MongoDB api
    const fetchData = async () => {
      try {
        const resPlans = await fetch('/api/plans');
        const dataPlans = await resPlans.json();
        if (dataPlans.success && dataPlans.plans && dataPlans.plans.length > 0) {
          setPlans(dataPlans.plans);
        }

        const resSettings = await fetch('/api/settings');
        const dataSettings = await resSettings.json();
        if (dataSettings.success && dataSettings.settings) {
          setUpiConfig(dataSettings.settings);
        }
      } catch (err) {
        console.error('Failed to load dynamic pricing from server, using local fallbacks', err);
      }
    };
    fetchData();
  }, []);

  const openSubscribeModal = (plan, e) => {
    e.preventDefault();
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const getPlanPrice = (planId, fallbackPrice) => {
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.price : fallbackPrice;
  };

  return (
    <div className="elementor elementor-87" style={{ width: '100%' }}>
      
      {/* SECTION 1: Membership Plans */}
      <div className="elementor-element elementor-element-2717f133 e-flex e-con-boxed e-con e-parent" data-id="2717f133" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
        <div className="e-con-inner">
          
          {/* Title column */}
          <div className="elementor-element elementor-element-55afebfd e-con-full e-flex e-con e-child" data-id="55afebfd" data-element_type="container" data-e-type="container">
            <div className="elementor-element elementor-element-2b49eda8 elementor-widget__width-initial elementor-widget-divider--view-line elementor-widget elementor-widget-divider" data-id="2b49eda8" data-element_type="widget" data-e-type="widget" data-widget_type="divider.default">
              <div className="elementor-widget-container">
                <div className="elementor-divider">
                  <span className="elementor-divider-separator"></span>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-40ef4011 elementor-widget__width-initial elementor-widget elementor-widget-heading" data-id="40ef4011" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
              <div className="elementor-widget-container">
                <h2 className="elementor-heading-title elementor-size-default">Pricing Plan</h2>
              </div>
            </div>
            <div className="elementor-element elementor-element-48f1dce9 elementor-widget__width-initial elementor-widget-divider--view-line elementor-widget elementor-widget-divider" data-id="48f1dce9" data-element_type="widget" data-e-type="widget" data-widget_type="divider.default">
              <div className="elementor-widget-container">
                <div className="elementor-divider">
                  <span className="elementor-divider-separator"></span>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-327978bf elementor-widget__width-initial elementor-widget elementor-widget-rkit_advanced_heading" data-id="327978bf" data-element_type="widget" data-e-type="widget" data-widget_type="rkit_advanced_heading.default">
              <div className="elementor-widget-container">
                <div className="rkit-advanced-heading-wrapper">
                  <h3 className="rkit-advanced-heading">
                    <span className="text-container"><span className="text">Special For </span></span>
                    <span className="headline-container"><span className="headline-text">Membership.</span></span>
                  </h3>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-942aa76 elementor-widget__width-initial elementor-widget-text-editor" data-id="942aa76" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
              <div className="elementor-widget-container">
                Choose the perfect fitness plan for you at S S Fitness. Flexible durations and professional equipment.
              </div>
            </div>
          </div>

          {/* Card 1: 1 Month (Dark Card style) */}
          <div className="elementor-element elementor-element-761d0dfc e-con-full e-flex e-con e-child ss-theme-card-item" data-id="761d0dfc" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" style={{ marginBottom: '30px' }}>
            <div className="elementor-element elementor-element-704961cd elementor-widget elementor-widget-heading" data-id="704961cd" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
              <div className="elementor-widget-container">
                <h4 className="elementor-heading-title elementor-size-default">1 Month Plan</h4>
              </div>
            </div>
            <div className="elementor-element elementor-element-33c6bae7 elementor-widget__width-inherit elementor-widget elementor-widget-rkit-animated-heading" data-id="33c6bae7" data-element_type="widget" data-e-type="widget" data-widget_type="rkit-animated-heading.default">
              <div className="elementor-widget-container">
                <a>
                  <h3 className="rkit-animated-heading" data-duration="2000">
                    <span className="rkit-animated-heading-text">₹{getPlanPrice('1_month', 800)}</span>
                    <span className="rkit-animated-heading-text-wrapper rkit-highlighted" data-type="[&quot;\/Month&quot;]">
                      <p className="rkit-animated-heading__text"></p>
                    </span>
                  </h3>
                </a>
              </div>
            </div>
            <div className="elementor-element elementor-element-56c1a91 elementor-widget-divider--view-line elementor-widget elementor-widget-divider" data-id="56c1a91" data-element_type="widget" data-e-type="widget" data-widget_type="divider.default">
              <div className="elementor-widget-container">
                <div className="elementor-divider">
                  <span className="elementor-divider-separator"></span>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-a86c09e elementor-widget elementor-widget-text-editor" data-id="a86c09e" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
              <div className="elementor-widget-container">
                Get started with our standard monthly pass for general fitness training.
              </div>
            </div>
            <div className="elementor-element elementor-element-158dd7a5 elementor-widget__width-inherit elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="158dd7a5" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
              <div className="elementor-widget-container">
                <ul className="elementor-icon-list-items">
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <i aria-hidden="true" className="rtmicon rtmicon-circle-check"></i>
                    </span>
                    <span className="elementor-icon-list-text">Access to Cardio & Strength areas</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <i aria-hidden="true" className="rtmicon rtmicon-circle-check"></i>
                    </span>
                    <span className="elementor-icon-list-text">Modern Workout Equipment</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <i aria-hidden="true" className="rtmicon rtmicon-circle-check"></i>
                    </span>
                    <span className="elementor-icon-list-text">General Trainer Guidance</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <i aria-hidden="true" className="rtmicon rtmicon-circle-check"></i>
                    </span>
                    <span className="elementor-icon-list-text">Locker & Changing Room Access</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="elementor-element elementor-element-182ccaf elementor-align-justify elementor-widget elementor-widget-button" data-id="182ccaf" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
              <div className="elementor-widget-container">
                <div className="elementor-button-wrapper">
                  <a 
                    className="elementor-button elementor-button-link elementor-size-sm" 
                    href="#"
                    onClick={(e) => openSubscribeModal(plans.find(p => p.id === '1_month') || { id: '1_month', name: '1 Month Plan', price: 800 }, e)}
                  >
                    <span className="elementor-button-content-wrapper">
                      <span className="elementor-button-text">Subscribe Now</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 3 Months (Premium Card style with bg image) */}
          <div className="elementor-element elementor-element-1548e1d1 e-con-full e-flex e-con e-child ss-theme-card-item" data-id="1548e1d1" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" style={{ marginBottom: '30px' }}>
            <div className="elementor-element elementor-element-58075edd elementor-widget-tablet__width-inherit elementor-widget elementor-widget-heading" data-id="58075edd" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
              <div className="elementor-widget-container">
                <h4 className="elementor-heading-title elementor-size-default">3 Months Plan</h4>
              </div>
            </div>
            <div className="elementor-element elementor-element-577b0bab elementor-widget__width-inherit elementor-widget elementor-widget-rkit-animated-heading" data-id="577b0bab" data-element_type="widget" data-e-type="widget" data-widget_type="rkit-animated-heading.default">
              <div className="elementor-widget-container">
                <a>
                  <h3 className="rkit-animated-heading" data-duration="2000">
                    <span className="rkit-animated-heading-text" style={{ color: '#000000' }}>₹{getPlanPrice('3_months', 2100)}</span>
                    <span className="rkit-animated-heading-text-wrapper rkit-highlighted" data-type="[&quot;\/3 Months&quot;]">
                      <p className="rkit-animated-heading__text"></p>
                    </span>
                  </h3>
                </a>
              </div>
            </div>
            <div className="elementor-element elementor-element-6f5d755c elementor-widget-divider--view-line elementor-widget elementor-widget-divider" data-id="6f5d755c" data-element_type="widget" data-e-type="widget" data-widget_type="divider.default">
              <div className="elementor-widget-container">
                <div className="elementor-divider">
                  <span className="elementor-divider-separator"></span>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-6aaa02c1 elementor-widget elementor-widget-text-editor" data-id="6aaa02c1" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
              <div className="elementor-widget-container">
                Great value pack to build consistency and see real physical improvements.
              </div>
            </div>
            <div className="elementor-element elementor-element-76e52e89 elementor-widget__width-inherit elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="76e52e89" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
              <div className="elementor-widget-container">
                <ul className="elementor-icon-list-items">
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <i aria-hidden="true" className="rtmicon rtmicon-circle-check" style={{ color: '#000000' }}></i>
                    </span>
                    <span className="elementor-icon-list-text" style={{ color: '#000000' }}>All 1-Month Plan benefits</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <i aria-hidden="true" className="rtmicon rtmicon-circle-check" style={{ color: '#000000' }}></i>
                    </span>
                    <span className="elementor-icon-list-text" style={{ color: '#000000' }}>Personalized Fitness Assessment</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <i aria-hidden="true" className="rtmicon rtmicon-circle-check" style={{ color: '#000000' }}></i>
                    </span>
                    <span className="elementor-icon-list-text" style={{ color: '#000000' }}>Customized Workout Blueprint</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <i aria-hidden="true" className="rtmicon rtmicon-circle-check" style={{ color: '#000000' }}></i>
                    </span>
                    <span className="elementor-icon-list-text" style={{ color: '#000000' }}>Flexible Slot Bookings</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="elementor-element elementor-element-637d7a79 elementor-align-justify elementor-widget elementor-widget-button" data-id="637d7a79" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
              <div className="elementor-widget-container">
                <div className="elementor-button-wrapper">
                  <a 
                    className="elementor-button elementor-button-link elementor-size-sm" 
                    href="#"
                    onClick={(e) => openSubscribeModal(plans.find(p => p.id === '3_months') || { id: '3_months', name: '3 Months Plan', price: 2100 }, e)}
                  >
                    <span className="elementor-button-content-wrapper">
                      <span className="elementor-button-text">Subscribe Now</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: 6 Months (Dark Card style) */}
          <div className="elementor-element elementor-element-761d0dfc e-con-full e-flex e-con e-child ss-theme-card-item" data-id="761d0dfc" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" style={{ marginBottom: '30px' }}>
            <div className="elementor-element elementor-element-704961cd elementor-widget elementor-widget-heading" data-id="704961cd" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
              <div className="elementor-widget-container">
                <h4 className="elementor-heading-title elementor-size-default">6 Months Plan</h4>
              </div>
            </div>
            <div className="elementor-element elementor-element-33c6bae7 elementor-widget__width-inherit elementor-widget elementor-widget-rkit-animated-heading" data-id="33c6bae7" data-element_type="widget" data-e-type="widget" data-widget_type="rkit-animated-heading.default">
              <div className="elementor-widget-container">
                <a>
                  <h3 className="rkit-animated-heading" data-duration="2000">
                    <span className="rkit-animated-heading-text">₹{getPlanPrice('6_months', 3500)}</span>
                    <span className="rkit-animated-heading-text-wrapper rkit-highlighted" data-type="[&quot;\/6 Months&quot;]">
                      <p className="rkit-animated-heading__text"></p>
                    </span>
                  </h3>
                </a>
              </div>
            </div>
            <div className="elementor-element elementor-element-56c1a91 elementor-widget-divider--view-line elementor-widget elementor-widget-divider" data-id="56c1a91" data-element_type="widget" data-e-type="widget" data-widget_type="divider.default">
              <div className="elementor-widget-container">
                <div className="elementor-divider">
                  <span className="elementor-divider-separator"></span>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-a86c09e elementor-widget elementor-widget-text-editor" data-id="a86c09e" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
              <div className="elementor-widget-container">
                Saves over 25% compared to the standard monthly rate. Excellent choice.
              </div>
            </div>
            <div className="elementor-element elementor-element-158dd7a5 elementor-widget__width-inherit elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="158dd7a5" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
              <div className="elementor-widget-container">
                <ul className="elementor-icon-list-items">
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <i aria-hidden="true" className="rtmicon rtmicon-circle-check"></i>
                    </span>
                    <span className="elementor-icon-list-text">All 3-Months Plan benefits</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <i aria-hidden="true" className="rtmicon rtmicon-circle-check"></i>
                    </span>
                    <span className="elementor-icon-list-text">Monthly Body Composition Analysis</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <i aria-hidden="true" className="rtmicon rtmicon-circle-check"></i>
                    </span>
                    <span className="elementor-icon-list-text">General Diet & Nutrition Tips</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <i aria-hidden="true" className="rtmicon rtmicon-circle-check"></i>
                    </span>
                    <span className="elementor-icon-list-text">2 Free Guest Passes Monthly</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="elementor-element elementor-element-182ccaf elementor-align-justify elementor-widget elementor-widget-button" data-id="182ccaf" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
              <div className="elementor-widget-container">
                <div className="elementor-button-wrapper">
                  <a 
                    className="elementor-button elementor-button-link elementor-size-sm" 
                    href="#"
                    onClick={(e) => openSubscribeModal(plans.find(p => p.id === '6_months') || { id: '6_months', name: '6 Months Plan', price: 3500 }, e)}
                  >
                    <span className="elementor-button-content-wrapper">
                      <span className="elementor-button-text">Subscribe Now</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: 1 Year (Premium Card style with bg image) */}
          <div className="elementor-element elementor-element-1548e1d1 e-con-full e-flex e-con e-child ss-theme-card-item" data-id="1548e1d1" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" style={{ marginBottom: '30px' }}>
            <div className="elementor-element elementor-element-58075edd elementor-widget-tablet__width-inherit elementor-widget elementor-widget-heading" data-id="58075edd" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
              <div className="elementor-widget-container">
                <h4 className="elementor-heading-title elementor-size-default">1 Year Plan</h4>
              </div>
            </div>
            <div className="elementor-element elementor-element-577b0bab elementor-widget__width-inherit elementor-widget elementor-widget-rkit-animated-heading" data-id="577b0bab" data-element_type="widget" data-e-type="widget" data-widget_type="rkit-animated-heading.default">
              <div className="elementor-widget-container">
                <a>
                  <h3 className="rkit-animated-heading" data-duration="2000">
                    <span className="rkit-animated-heading-text" style={{ color: '#000000' }}>₹{getPlanPrice('1_year', 6000)}</span>
                    <span className="rkit-animated-heading-text-wrapper rkit-highlighted" data-type="[&quot;\/Year&quot;]">
                      <p className="rkit-animated-heading__text"></p>
                    </span>
                  </h3>
                </a>
              </div>
            </div>
            <div className="elementor-element elementor-element-6f5d755c elementor-widget-divider--view-line elementor-widget elementor-widget-divider" data-id="6f5d755c" data-element_type="widget" data-e-type="widget" data-widget_type="divider.default">
              <div className="elementor-widget-container">
                <div className="elementor-divider">
                  <span className="elementor-divider-separator"></span>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-6aaa02c1 elementor-widget elementor-widget-text-editor" data-id="6aaa02c1" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
              <div className="elementor-widget-container">
                Best value and long-term results. The ultimate dedication package.
              </div>
            </div>
            <div className="elementor-element elementor-element-76e52e89 elementor-widget__width-inherit elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="76e52e89" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
              <div className="elementor-widget-container">
                <ul className="elementor-icon-list-items">
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <i aria-hidden="true" className="rtmicon rtmicon-circle-check" style={{ color: '#000000' }}></i>
                    </span>
                    <span className="elementor-icon-list-text" style={{ color: '#000000' }}>All 6-Months Plan benefits</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <i aria-hidden="true" className="rtmicon rtmicon-circle-check" style={{ color: '#000000' }}></i>
                    </span>
                    <span className="elementor-icon-list-text" style={{ color: '#000000' }}>Full Premium Gym Access</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <i aria-hidden="true" className="rtmicon rtmicon-circle-check" style={{ color: '#000000' }}></i>
                    </span>
                    <span className="elementor-icon-list-text" style={{ color: '#000000' }}>General Trainer Guidance</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <i aria-hidden="true" className="rtmicon rtmicon-circle-check" style={{ color: '#000000' }}></i>
                    </span>
                    <span className="elementor-icon-list-text" style={{ color: '#000000' }}>Free Gym T-Shirt & Shaker</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="elementor-element elementor-element-637d7a79 elementor-align-justify elementor-widget elementor-widget-button" data-id="637d7a79" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
              <div className="elementor-widget-container">
                <div className="elementor-button-wrapper">
                  <a 
                    className="elementor-button elementor-button-link elementor-size-sm" 
                    href="#"
                    onClick={(e) => openSubscribeModal(plans.find(p => p.id === '1_year') || { id: '1_year', name: '1 Year Plan', price: 6000 }, e)}
                  >
                    <span className="elementor-button-content-wrapper">
                      <span className="elementor-button-text">Subscribe Now</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: Personal Training & Secure Payment */}
      <div className="elementor-element elementor-element-2717f133 e-flex e-con-boxed e-con e-parent" data-id="2717f133" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" id="payment-section" style={{ borderTop: '1px solid #222222', marginTop: '20px' }}>
        <div className="e-con-inner">
          
          {/* Card 5: Personal Training (Premium Card style) */}
          <div className="elementor-element elementor-element-1548e1d1 e-con-full e-flex e-con e-child" data-id="1548e1d1" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" style={{ marginBottom: '30px' }}>
            <div className="elementor-element elementor-element-58075edd elementor-widget-tablet__width-inherit elementor-widget elementor-widget-heading" data-id="58075edd" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
              <div className="elementor-widget-container">
                <h4 className="elementor-heading-title elementor-size-default">PERSONAL TRAINING</h4>
              </div>
            </div>
            <div className="elementor-element elementor-element-577b0bab elementor-widget__width-inherit elementor-widget elementor-widget-rkit-animated-heading" data-id="577b0bab" data-element_type="widget" data-e-type="widget" data-widget_type="rkit-animated-heading.default">
              <div className="elementor-widget-container">
                <a>
                  <h3 className="rkit-animated-heading">
                    <span className="rkit-animated-heading-text" style={{ color: '#000000' }}>LADIES & GENTS</span>
                  </h3>
                </a>
              </div>
            </div>
            <div className="elementor-element elementor-element-6f5d755c elementor-widget-divider--view-line elementor-widget elementor-widget-divider" data-id="6f5d755c" data-element_type="widget" data-e-type="widget" data-widget_type="divider.default">
              <div className="elementor-widget-container">
                <div className="elementor-divider">
                  <span className="elementor-divider-separator"></span>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-6aaa02c1 elementor-widget elementor-widget-text-editor" data-id="6aaa02c1" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
              <div className="elementor-widget-container">
                Dedicated fitness training and customized sessions for weight loss, muscle gain, and general health.
              </div>
            </div>
            
            <div className="ss-trainer-card-details" style={{ display: 'flex', alignItems: 'center', margin: '20px 0', padding: '15px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '8px', borderLeft: '3px solid #000000' }}>
              <div className="ss-trainer-icon-box" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', color: '#ffffff', fontWeight: 'bold', fontSize: '18px', flexShrink: 0 }}>
                R
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#000000', textTransform: 'uppercase', fontWeight: 'bold' }}>Coach & Trainer</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000000' }}>RAJU (8309514957)</div>
              </div>
            </div>

            <div className="ss-pt-actions-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: 'auto' }}>
              <a href="tel:8309514957" className="elementor-button elementor-button-link elementor-size-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #000000', backgroundColor: '#000000', color: '#ffffff', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '4px', textAlign: 'center' }}>
                Call Raju
              </a>
              <a href="https://wa.me/918309514957?text=Hi%20Raju,%20I'm%20interested%20in%20Personal%20Training%20at%20S%20S%20Fitness!" target="_blank" rel="noopener noreferrer" className="elementor-button elementor-button-link elementor-size-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #25d366', backgroundColor: '#25d366', color: '#ffffff', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '4px', textAlign: 'center' }}>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Card 6: Secure Payments (Dark Card style) */}
          <div className="elementor-element elementor-element-761d0dfc e-con-full e-flex e-con e-child" data-id="761d0dfc" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" style={{ marginBottom: '30px', alignItems: 'center', textAlign: 'center' }}>
            <div className="elementor-element elementor-element-704961cd elementor-widget elementor-widget-heading" data-id="704961cd" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
              <div className="elementor-widget-container">
                <h4 className="elementor-heading-title elementor-size-default" style={{ color: '#ff5e14' }}>PhonePe Accepted</h4>
              </div>
            </div>
            <div className="elementor-element elementor-element-33c6bae7 elementor-widget__width-inherit elementor-widget elementor-widget-rkit-animated-heading" data-id="33c6bae7" data-element_type="widget" data-e-type="widget" data-widget_type="rkit-animated-heading.default">
              <div className="elementor-widget-container">
                <a>
                  <h3 className="rkit-animated-heading">
                    <span className="rkit-animated-heading-text" style={{ fontSize: '28px' }}>Scan & Pay</span>
                  </h3>
                </a>
              </div>
            </div>
            <div className="elementor-element elementor-element-56c1a91 elementor-widget-divider--view-line elementor-widget elementor-widget-divider" data-id="56c1a91" data-element_type="widget" data-e-type="widget" data-widget_type="divider.default">
              <div className="elementor-widget-container">
                <div className="elementor-divider">
                  <span className="elementor-divider-separator"></span>
                </div>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', display: 'inline-block', margin: '15px 0', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
              <div style={{ border: '2px solid #5f259f', padding: '4px', borderRadius: '4px', lineHeight: 0 }}>
                <svg viewBox="0 0 100 100" width="120" height="120">
                  <rect width="100" height="100" fill="#ffffff" />
                  <path fill="#111111" d="M10,10 h20 v20 h-20 z M15,15 h10 v10 h-10 z M70,10 h20 v20 h-20 z M75,15 h10 v10 h-10 z M10,70 h20 v20 h-20 z M15,75 h10 v10 h-10 z" />
                  <path fill="#111111" d="M45,10 h10 v10 h-10 z M50,20 h10 v10 h-10 z M60,15 h5 v5 h-5 z M45,35 h20 v5 h-20 z M10,40 h15 v5 h-15 z M35,10 h5 v15 h-5 z M15,45 h20 v5 h-20 z M45,45 h10 v10 h-10 z M10,55 h10 v10 h-10 z M30,60 h15 v5 h-15 z M50,55 h15 v5 h-15 z M70,40 h20 v5 h-20 z M80,50 h10 v10 h-10 z M65,65 h10 v10 h-10 z M85,65 h5 v15 h-5 z M70,75 h10 v5 h-10 z M75,85 h20 v5 h-20 z M40,75 h25 v5 h-25 z M50,85 h10 v10 h-10 z M30,80 h15 v10 h-15 z" />
                  <rect x="40" y="40" width="20" height="20" rx="2" fill="#5f259f" />
                  <text x="50" y="54" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">₹</text>
                </svg>
              </div>
            </div>

            <div style={{ color: '#cccccc', fontSize: '13px', margin: '5px 0 15px 0' }}>
              <div>A/C Holder Name:</div>
              <strong style={{ color: '#ffffff', letterSpacing: '0.5px' }}>{upiConfig.payeeName}</strong>
            </div>

            <div style={{ fontSize: '12px', color: '#ff5e14', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', borderTop: '1px solid #222222', paddingTop: '15px' }}>
              <span>PhonePe Accepted: {upiConfig.upiId}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Subscription payment modal */}
      {selectedPlan && (
        <SubscriptionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          plan={selectedPlan} 
          upiConfig={upiConfig}
        />
      )}

    </div>
  );
}
