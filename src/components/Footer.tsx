import { memo } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT, NAV_LINKS, SERVICES } from '../data/content';

function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/15">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 md:px-14 py-16 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 256 256" fill="#e8702a" aria-hidden="true">
              <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
            <span className="text-white text-xl font-playfair italic">Moving Stone</span>
          </div>
          <p className="mt-4 text-sm text-white/50 font-light max-w-[26ch] leading-relaxed">
            A design studio for categories that stopped moving.
          </p>
        </div>

        <div>
          <h2 className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-medium">
            Services
          </h2>
          <ul className="mt-4 space-y-2 list-none p-0">
            {SERVICES.map((s) => (
              <li key={s.num}>
                <Link
                  to="/#services"
                  className="text-sm text-white/70 hover:text-[#e8702a] transition-colors"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-medium">
            Studio
          </h2>
          <ul className="mt-4 space-y-2 list-none p-0">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.href}
                  className="text-sm text-white/70 hover:text-[#e8702a] transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-medium">
            Contact
          </h2>
          <address className="mt-4 not-italic space-y-2 text-sm text-white/70 font-light">
            <p className="m-0">
              <a href={`mailto:${CONTACT.email}`} className="hover:text-[#e8702a] transition-colors">
                {CONTACT.email}
              </a>
            </p>
            <p className="m-0">{CONTACT.phone}</p>
            <p className="m-0 leading-relaxed">{CONTACT.address}</p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 md:px-14 py-6 flex flex-wrap gap-3 justify-between text-[11px] uppercase tracking-[0.14em] text-white/35">
          <span>© 2026 Moving Stone Ltd · Company 11842096</span>
          <span>Privacy · Terms · Cookies</span>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
