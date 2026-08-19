import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../data/content';

const FADE_DISTANCE = 240;

function Nav() {
  const [open, setOpen] = useState(false);
  const [logoOpacity, setLogoOpacity] = useState(1);
  const [logoHovered, setLogoHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = 1 - Math.min(window.scrollY / FADE_DISTANCE, 1) * 0.75;
      setLogoOpacity(next);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
      <Link
        to="/"
        className="flex items-center"
        aria-label="Moving Stone, home"
        onMouseEnter={() => setLogoHovered(true)}
        onMouseLeave={() => setLogoHovered(false)}
      >
        <img
          src="/logo.png"
          alt="Moving Stone"
          className="h-20 sm:h-24 w-auto transition-opacity duration-200 ease-out"
          style={{ opacity: logoHovered ? 1 : logoOpacity }}
        />
      </Link>

      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            to={link.href}
            className="text-white/80 hover:bg-white/20 hover:text-white transition-colors px-4 py-1.5 rounded-full text-sm font-medium"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <Link
        to="/#contact"
        className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors"
      >
        Start a project
      </Link>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden text-white p-2 -mr-2"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open ? (
        <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-black/85 backdrop-blur-xl border border-white/15 rounded-3xl p-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setOpen(false)}
              className="text-white/85 hover:text-white text-base font-medium px-4 py-3 rounded-2xl hover:bg-white/10 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/#contact"
            onClick={() => setOpen(false)}
            className="mt-2 bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full text-center transition-colors"
          >
            Start a project
          </Link>
        </div>
      ) : null}
    </nav>
  );
}

export default memo(Nav);
