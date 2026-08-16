import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { signIn, type AuthState } from '../lib/auth';

interface Props {
  onUnlock: () => void;
}

export default function StudioLock({ onUnlock }: Props) {
  const [password, setPassword] = useState('');
  const [state, setState] = useState<AuthState>('locked');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setMessage('');
    const result = await signIn(password);
    setBusy(false);
    setState(result.state);
    setMessage(result.message);
    if (result.state === 'unlocked') onUnlock();
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#0a0a0a] px-5 text-white">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2.5">
          <svg width="22" height="22" viewBox="0 0 256 256" fill="#e8702a" aria-hidden="true">
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="font-playfair text-xl italic">Moving Stone</span>
        </div>

        <h1 className="text-3xl font-semibold" style={{ letterSpacing: '-0.04em' }}>
          Portfolio studio
        </h1>
        <p className="mt-2 text-sm text-white/50">Sign in to edit the portfolio.</p>

        <form onSubmit={submit} className="mt-7">
          <label
            htmlFor="studio-password"
            className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-white/45"
          >
            Password
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
            />
            <input
              id="studio-password"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/12 bg-[#151515] py-3 pl-10 pr-3 text-sm text-white focus:border-[#e8702a] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={busy || !password}
            className="mt-4 w-full rounded-lg bg-[#e8702a] py-3 text-sm font-medium text-white transition-colors hover:bg-[#d2611f] disabled:opacity-40"
          >
            {busy ? 'Checking…' : 'Sign in'}
          </button>
        </form>

        {message ? (
          <p
            className={`mt-4 text-sm ${
              state === 'unconfigured' ? 'text-amber-400' : 'text-red-400'
            }`}
            role="alert"
          >
            {message}
          </p>
        ) : null}

        {state === 'unconfigured' ? (
          <div className="mt-4 rounded-lg border border-white/12 p-4 text-xs leading-relaxed text-white/55">
            <p className="m-0">
              In the Vercel dashboard, open this project → Settings → Environment Variables, add{' '}
              <code className="text-white/80">ADMIN_PASSWORD</code>, then redeploy.
            </p>
          </div>
        ) : null}

        <Link to="/" className="mt-8 inline-block text-xs text-white/35 hover:text-white">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
