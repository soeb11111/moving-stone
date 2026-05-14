import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer style={{ background: '#272828', borderTop: '1px solid #333' }}>
      <div className="footer-top" style={{ flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ flex: 1, minWidth: '300px', textAlign: 'center' }}>
          <p className="text-xs uppercase mb-2">Designed and Built</p>
          <p className="text-xs text-muted">an entire collection of items that fit into your life.<br/>Keeping your lifestyle clean and elegant.</p>
        </div>
        <div style={{ flex: 1, minWidth: '300px', textAlign: 'center' }}>
          <p className="text-xs uppercase mb-2">The Bézier Standard</p>
          <p className="text-xs text-muted">an entire collection of items that fit into your life.<br/>Keeping your lifestyle clean and elegant.</p>
        </div>
      </div>
      
      <div className="footer-bottom" style={{ alignItems: 'flex-end' }}>
        <div>
          <h4 className="text-xs uppercase mb-4 text-white">Join Our Newsletter</h4>
          <form className="flex gap-2 mb-8">
            <input type="email" placeholder="Email Address" style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', padding: '0.5rem 0', color: '#fff', outline: 'none', width: '200px', fontSize: '0.75rem' }} />
            <button className="text-xs uppercase" style={{ borderBottom: '1px solid #333', padding: '0.5rem 0' }}>Submit</button>
          </form>
          <div className="flex gap-4">
            <Link href="#" className="text-xs text-muted">Twitter</Link>
            <Link href="#" className="text-xs text-muted">Instagram</Link>
          </div>
        </div>

        <div className="flex gap-12 text-right">
          <div className="flex flex-col gap-2">
            <Link href="#" className="text-xs text-muted uppercase">Home</Link>
            <Link href="#" className="text-xs text-muted uppercase">Store</Link>
            <Link href="#" className="text-xs text-muted uppercase">Studio</Link>
            <Link href="#" className="text-xs text-muted uppercase">Journal</Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="#" className="text-xs text-muted uppercase">Account</Link>
            <Link href="#" className="text-xs text-muted uppercase">Returns</Link>
            <Link href="#" className="text-xs text-muted uppercase">Privacy Policy</Link>
            <Link href="#" className="text-xs text-muted uppercase">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
