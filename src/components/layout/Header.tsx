"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <Link href="/" className="logo" style={{ zIndex: 101 }}>
        <img src="/images/logo.png" alt="Moving Stone" style={{ height: '64px', width: 'auto' }} />
      </Link>
      
      {/* Desktop Nav */}
      <nav className="nav-links desktop-nav">
        <Link href="/work">Work</Link>
        <Link href="#">Studio</Link>
        <Link href="#">Journal</Link>
        <Link href="#">Account</Link>
        <Link href="#">About</Link>
      </nav>

      {/* Mobile Nav Overlay */}
      {menuOpen && (
        <nav className="mobile-nav-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
          background: '#111', zIndex: 100, display: 'flex', flexDirection: 'column', 
          justifyContent: 'center', alignItems: 'center', gap: '2.5rem', 
          fontFamily: '__PASSENGER_bea76c, __PASSENGER_Fallback_bea76c, -apple-system, BlinkMacSystemFont, "avenir next", avenir, "segoe ui", "helvetica neue", helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif',
          fontSize: '2rem',
          fontWeight: 400,
          color: '#fff'
        }}>
          <Link href="/work" onClick={() => setMenuOpen(false)}>Work</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>Studio</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>Journal</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>Account</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>About</Link>
        </nav>
      )}

      <div className="nav-icons" style={{ zIndex: 101 }}>
        <button aria-label="Search" className="desktop-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </button>
        <button aria-label="Cart" className="desktop-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
        </button>
        {/* Hamburger Menu Toggle */}
        <button aria-label="Menu" className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12"/>
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18"/>
            )}
          </svg>
        </button>
      </div>
    </header>
  );
};
