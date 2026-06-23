import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer itemType="https://schema.org/WPFooter" itemScope="itemScope" style={{ width: '100%' }}>
      <div data-elementor-type="wp-post" data-elementor-id="220" className="elementor elementor-220">
        <div className="elementor-element elementor-element-311386dc e-flex e-con-boxed e-con e-parent" data-settings='{"background_background":"classic"}'>
          <div className="e-con-inner">
            
            {/* Info / Logo Column */}
            <div className="elementor-element elementor-element-5f5a8d6f e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-17a6f0d elementor-widget elementor-widget-site-logo">
                <div className="elementor-widget-container">
                  <div className="rkit-image-container">
                    <Link href="/" className="rkit-image" style={{ textDecoration: 'none', borderBottom: 'none' }}>
                      <img 
                        width="300" 
                        height="150" 
                        src="/wp-content/uploads/sites/57/2025/05/logo-300x150.png" 
                        className="attachment-medium size-medium" 
                        alt="Progym logo"
                        style={{ maxWidth: '140px', height: 'auto' }}
                      />
                      <div className="site-caption"> </div>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="elementor-element elementor-element-665a9bb7 elementor-widget elementor-widget-text-editor">
                <div className="elementor-widget-container">
                  <p>Lorem ipsum dolor sit amet, consectetur ulam adipiscing elit. Ut elit tellus, corper mattis, pulvinar dapibus leo.</p>
                </div>
              </div>
              
              {/* Social Icons */}
              <div className="elementor-element elementor-element-6e8998c elementor-widget elementor-widget-rtm-social_icon">
                <div className="elementor-widget-container">
                  <div className="rkit-social-share flat">
                    <dl className="rkit-social-media__list">
                      <dt className="elementor-repeater-item-3464257">
                        <a href="#" className="rkit-social-share__link" aria-label="Facebook">
                          <svg aria-hidden="true" className="rkit-social-share__icon e-font-icon-svg e-fab-facebook-f" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
                          </svg>
                        </a>
                      </dt>
                      <dt className="elementor-repeater-item-a0a92f7">
                        <a href="#" className="rkit-social-share__link" aria-label="Twitter">
                          <svg aria-hidden="true" className="rkit-social-share__icon e-font-icon-svg e-fab-x-twitter" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
                          </svg>
                        </a>
                      </dt>
                      <dt className="elementor-repeater-item-63bdf00">
                        <a href="#" className="rkit-social-share__link" aria-label="WhatsApp">
                          <svg aria-hidden="true" className="rkit-social-share__icon e-font-icon-svg e-fab-whatsapp" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                          </svg>
                        </a>
                      </dt>
                      <dt className="elementor-repeater-item-f861628">
                        <a href="#" className="rkit-social-share__link" aria-label="Telegram">
                          <svg aria-hidden="true" className="rkit-social-share__icon e-font-icon-svg e-fab-telegram-plane" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z"></path>
                          </svg>
                        </a>
                      </dt>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="elementor-element elementor-element-269e10f3 e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-13e8010c elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h4 className="elementor-heading-title elementor-size-default">Quick Link</h4>
                </div>
              </div>
              <div className="elementor-element elementor-element-5450eeb4 elementor-widget-divider--view-line elementor-widget elementor-widget-divider">
                <div className="elementor-widget-container">
                  <div className="elementor-divider">
                    <span className="elementor-divider-separator"></span>
                  </div>
                </div>
              </div>
              <div className="elementor-element elementor-element-60fe70fa elementor-widget__width-inherit elementor-mobile-align-center elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list">
                <div className="elementor-widget-container">
                  <ul className="elementor-icon-list-items">
                    <li className="elementor-icon-list-item">
                      <Link href="/" className="elementor-icon-list-text">Home</Link>
                    </li>
                    <li className="elementor-icon-list-item">
                      <Link href="/about" className="elementor-icon-list-text">About Us</Link>
                    </li>
                    <li className="elementor-icon-list-item">
                      <Link href="/program" className="elementor-icon-list-text">Services</Link>
                    </li>
                    <li className="elementor-icon-list-item">
                      <Link href="/pricing" className="elementor-icon-list-text">Pricing Plan</Link>
                    </li>
                    <li className="elementor-icon-list-item">
                      <Link href="/contact" className="elementor-icon-list-text">Contact Us</Link>
                    </li>
                    <li className="elementor-icon-list-item">
                      <span className="elementor-icon-list-text">Privacy &amp; Policy</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Programs Column */}
            <div className="elementor-element elementor-element-19cc02d1 e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-4dd50407 elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h4 className="elementor-heading-title elementor-size-default">Programs</h4>
                </div>
              </div>
              <div className="elementor-element elementor-element-6dbd439e elementor-widget-divider--view-line elementor-widget elementor-widget-divider">
                <div className="elementor-widget-container">
                  <div className="elementor-divider">
                    <span className="elementor-divider-separator"></span>
                  </div>
                </div>
              </div>
              <div className="elementor-element elementor-element-183907db elementor-widget__width-inherit elementor-mobile-align-center elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list">
                <div className="elementor-widget-container">
                  <ul className="elementor-icon-list-items">
                    <li className="elementor-icon-list-item">
                      <span className="elementor-icon-list-text">Basic Exercise</span>
                    </li>
                    <li className="elementor-icon-list-item">
                      <span className="elementor-icon-list-text">Advanced Exercises</span>
                    </li>
                    <li className="elementor-icon-list-item">
                      <span className="elementor-icon-list-text">Bodybuilding</span>
                    </li>
                    <li className="elementor-icon-list-item">
                      <span className="elementor-icon-list-text">Regular Workout</span>
                    </li>
                    <li className="elementor-icon-list-item">
                      <span className="elementor-icon-list-text">Stretching Workout</span>
                    </li>
                    <li className="elementor-icon-list-item">
                      <span className="elementor-icon-list-text">Crossfit</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Column */}
            <div className="elementor-element elementor-element-2a47594 e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-6fe43245 elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h4 className="elementor-heading-title elementor-size-default">Contact Us</h4>
                </div>
              </div>
              <div className="elementor-element elementor-element-175047fb elementor-widget-divider--view-line elementor-widget elementor-widget-divider">
                <div className="elementor-widget-container">
                  <div className="elementor-divider">
                    <span className="elementor-divider-separator"></span>
                  </div>
                </div>
              </div>
              <div className="elementor-element elementor-element-280c00e5 elementor-position-inline-start elementor-view-default elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box">
                <div className="elementor-widget-container">
                  <div className="elementor-icon-box-wrapper">
                    <div className="elementor-icon-box-icon">
                      <span className="elementor-icon">
                        <i aria-hidden="true" className="rtmicon-thin rtmicon-pin-map-location"></i>
                      </span>
                    </div>
                    <div className="elementor-icon-box-content">
                      <h3 className="elementor-icon-box-title">
                        <span>Location</span>
                      </h3>
                      <p className="elementor-icon-box-description">
                        KLLG St, No.99, Pku City, ID 28289
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="elementor-element elementor-element-47d17698 elementor-position-inline-start elementor-view-default elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box">
                <div className="elementor-widget-container">
                  <div className="elementor-icon-box-wrapper">
                    <div className="elementor-icon-box-icon">
                      <span className="elementor-icon">
                        <i aria-hidden="true" className="rtmicon-thin rtmicon-phone-classic"></i>
                      </span>
                    </div>
                    <div className="elementor-icon-box-content">
                      <h3 className="elementor-icon-box-title">
                        <span>Phone</span>
                      </h3>
                      <p className="elementor-icon-box-description">
                        0761-8523-398
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="elementor-element elementor-element-4fdf210b elementor-position-inline-start elementor-view-default elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box">
                <div className="elementor-widget-container">
                  <div className="elementor-icon-box-wrapper">
                    <div className="elementor-icon-box-icon">
                      <span className="elementor-icon">
                        <i aria-hidden="true" className="rtmicon-thin rtmicon-envelope"></i>
                      </span>
                    </div>
                    <div className="elementor-icon-box-content">
                      <h3 className="elementor-icon-box-title">
                        <span>Email</span>
                      </h3>
                      <p className="elementor-icon-box-description">
                        hello@domainsite.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright Row */}
            <div className="elementor-element elementor-element-6a3970f5 e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-16324b86 elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h5 className="elementor-heading-title elementor-size-default">Copyright © 2026 Rometheme. All Rights Reserved.</h5>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
