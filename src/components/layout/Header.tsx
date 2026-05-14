import React from 'react';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className="site-header">
      <Link href="/" className="logo">
        <img src="/images/logo.png" alt="Moving Stone" style={{ height: '64px', width: 'auto' }} />
      </Link>
      
      <nav className="nav-links hidden md:flex">
        <Link href="#">Store</Link>
        <Link href="#">Studio</Link>
        <Link href="#">Journal</Link>
        <Link href="#">Account</Link>
        <Link href="#">About</Link>
      </nav>

      <div className="nav-icons">
        <button aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </button>
        <button aria-label="Cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
        </button>
      </div>
    </header>
  );
};
