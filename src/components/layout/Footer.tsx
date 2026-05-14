import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer style={{ 
      background: '#1a1a1a', 
      padding: '6rem 0 4rem 0', 
      color: '#fff',
      fontFamily: '__PASSENGER_bea76c, __PASSENGER_Fallback_bea76c, -apple-system, BlinkMacSystemFont, "avenir next", avenir, "segoe ui", "helvetica neue", helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif',
      fontSize: '15px',
      lineHeight: '21px',
      fontWeight: 400
    }}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-12 gap-x-24 items-start">
          
          {/* Column 1: Newsletter & Social */}
          <div className="flex flex-col gap-16">
            <div>
              <p className="text-[12px] mb-6 opacity-80 uppercase tracking-widest">newsletter</p>
              <div className="flex items-center justify-between px-8 h-[100px]" style={{ background: '#222', width: '100%', maxWidth: '500px' }}>
                <input 
                  type="email" 
                  placeholder="enter your email" 
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: '#fff', 
                    outline: 'none', 
                    fontSize: '16px',
                    width: '65%'
                  }} 
                />
                <button className="text-[14px] uppercase tracking-tighter hover:opacity-70 transition-all flex items-center">
                  <span className="mr-4 text-xl">&gt;</span> sign up
                </button>
              </div>
            </div>
            
            <div>
              <p className="text-[12px] mb-6 opacity-80 uppercase tracking-widest">social</p>
              <div className="flex gap-8 opacity-90 items-center">
                <Link href="#" className="hover:opacity-100 transition-all">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </Link>
                <Link href="#" className="hover:opacity-100 transition-all">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2: Support */}
          <div>
            <p className="text-[12px] mb-4 opacity-60 uppercase tracking-widest">support</p>
            <p className="text-xs mb-6 opacity-60 leading-relaxed" style={{ maxWidth: '200px' }}>
              Our customer service is available Mon–Fri, 11 AM–7 PM (IST).
            </p>
            <div className="flex flex-col gap-2">
              <Link href="#" className="text-xs hover:opacity-100 opacity-80">Email</Link>
              <Link href="#" className="text-xs hover:opacity-100 opacity-80">Call</Link>
              <Link href="#" className="text-xs hover:opacity-100 opacity-80">Get directions</Link>
            </div>
          </div>

          {/* Column 3: Sitemap */}
          <div>
            <p className="text-[12px] mb-4 opacity-60 uppercase tracking-widest">sitemap</p>
            <div className="flex flex-col gap-2">
              <Link href="#" className="text-xs hover:opacity-100 opacity-80">Neural Search</Link>
              <Link href="#" className="text-xs hover:opacity-100 opacity-80">Predictive Ads</Link>
              <Link href="#" className="text-xs hover:opacity-100 opacity-80">Automation</Link>
              <Link href="#" className="text-xs hover:opacity-100 opacity-80">Our Company</Link>
              <Link href="#" className="text-xs hover:opacity-100 opacity-80">Terms & Conditions</Link>
              <Link href="#" className="text-xs hover:opacity-100 opacity-80">Privacy Policy</Link>
              <Link href="#" className="text-xs hover:opacity-100 opacity-80">FAQ</Link>
            </div>
          </div>

          {/* Column 4: Our Brands */}
          <div>
            <p className="text-[12px] mb-4 opacity-60 uppercase tracking-widest">our brands</p>
            <div className="flex flex-col gap-2">
              <Link href="#" className="text-xs hover:opacity-100 opacity-80">Moving Stone Neural</Link>
              <Link href="#" className="text-xs hover:opacity-100 opacity-80">Spectra AI</Link>
              <Link href="#" className="text-xs hover:opacity-100 opacity-80">Plasma Celestial</Link>
              <Link href="#" className="text-xs hover:opacity-100 opacity-80">Bézier Standard</Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
