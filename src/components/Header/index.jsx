'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleDropdownClick = (index, e) => {
    // Only toggle dropdown on click if on mobile/tablet screens
    if (window.innerWidth <= 1024) {
      e.preventDefault();
      setActiveDropdown(activeDropdown === index ? null : index);
    }
  };

  const menuItems = [
    { label: 'Home', href: '/' },
    {
      label: 'About Us',
      href: '#',
      dropdown: [
        { label: 'About Us', href: '/about' },
        { label: 'Trainers', href: '/trainers' },
      ],
    },
    {
      label: 'Services',
      href: '#',
      dropdown: [
        { label: 'Program', href: '/program' },
        { label: 'Program Details', href: '/program-details' },
      ],
    },
    {
      label: 'Pages',
      href: '#',
      dropdown: [
        { label: 'Pricing Plan', href: '/pricing' },
        { label: 'FAQs', href: '/faq' },
        { label: '404', href: '/404' },
      ],
    },
    {
      label: 'Blog',
      href: '#',
      dropdown: [
        { label: 'News & Blog', href: '/blog' },
        { label: 'Single Blog', href: '/blog-details' },
      ],
    },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <header className="site-header" style={{ width: '100%', zIndex: 9999 }}>
      <div data-elementor-type="wp-post" data-elementor-id="219" className="elementor elementor-219">
        <div className="elementor-element elementor-element-0f756f5 e-flex e-con-boxed e-con e-parent" data-settings='{"background_background":"classic"}'>
          <div className="e-con-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {/* Logo */}
            <div className="elementor-element elementor-element-6fc9f63 elementor-widget__width-initial elementor-widget elementor-widget-site-logo">
              <div className="elementor-widget-container">
                <div className="rkit-image-container">
                  <Link href="/" className="rkit-image" style={{ textDecoration: 'none', borderBottom: 'none' }}>
                    <img
                      fetchPriority="high"
                      width="800"
                      height="400"
                      src="/wp-content/uploads/sites/57/2025/05/logo.png"
                      className="attachment-full size-full"
                      alt="Progym Logo"
                      style={{ maxWidth: '160px', height: 'auto' }}
                    />
                    <div className="site-caption"> </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="elementor-element elementor-element-f72a554 elementor-widget__width-initial elementor-widget elementor-widget-rtm-navmenu">
              <div className="elementor-widget-container">
                <div className="rkit-navmenu-container" data-responsive="tablet">
                  
                  {/* Hamburger Button */}
                  <div className="rkit-hamburger rkit-hamburger-tablet">
                    <button 
                      onClick={toggleMobileMenu}
                      className="rkit-btn-hamburger" 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
                      aria-label="Toggle navigation menu"
                    >
                      {!mobileMenuOpen ? (
                        <i aria-hidden="true" className="rkit-icon-open rtmicon rtmicon-bars" style={{ fontSize: '24px', color: '#fff' }}></i>
                      ) : (
                        <i aria-hidden="true" className="rkit-icon-close rtmicon rtmicon-bar-sort-right" style={{ fontSize: '24px', color: '#fff' }}></i>
                      )}
                    </button>
                  </div>

                  {/* Menu Container */}
                  <div 
                    className={`rkit-navmenu rkit-responsive-menu rkit-responsive-tablet rkit-navmenu-fullwidth ${mobileMenuOpen ? 'rkit-active' : ''}`}
                    style={mobileMenuOpen ? { display: 'block', opacity: 1, visibility: 'visible', position: 'absolute', top: '100%', left: 0, width: '100%', background: '#111', padding: '20px', zIndex: 1000 } : {}}
                  >
                    <ul className="rkit-menu-container">
                      {menuItems.map((item, idx) => {
                        const hasDropdown = !!item.dropdown;
                        const isDropdownOpen = activeDropdown === idx;

                        return (
                          <li 
                            key={idx} 
                            className={`rkit-menu-item ${hasDropdown ? 'rkit-dropdown-hover' : ''} ${pathname === item.href ? 'rkit-menu-active' : ''}`}
                            style={{ position: 'relative' }}
                          >
                            {hasDropdown ? (
                              <>
                                <a 
                                  className="rkit-nav-link" 
                                  href="#"
                                  onClick={(e) => handleDropdownClick(idx, e)}
                                  style={{ display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
                                >
                                  {item.label}
                                  <i aria-hidden="true" className="rkit-submenu-icon rtmicon rtmicon-chevron-down"></i>
                                </a>
                                <ul 
                                  className="rkit-navmenu-dropdown"
                                  style={(mobileMenuOpen && isDropdownOpen) ? { display: 'block', opacity: 1, visibility: 'visible', position: 'static', paddingLeft: '15px' } : {}}
                                >
                                  {item.dropdown.map((subItem, sIdx) => (
                                    <li key={sIdx} className={`rkit-submenu-item ${pathname === subItem.href ? 'rkit-submenu-active' : ''}`}>
                                      <Link 
                                        href={subItem.href} 
                                        className="rkit-nav-link"
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{ whiteSpace: 'nowrap' }}
                                      >
                                        {subItem.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            ) : (
                              <Link 
                                href={item.href} 
                                className="rkit-nav-link"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{ whiteSpace: 'nowrap' }}
                              >
                                {item.label}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
