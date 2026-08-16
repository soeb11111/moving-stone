const SESSION_KEY = 'moving-stone:studio-session';

export type AuthState = 'locked' | 'unlocked' | 'unconfigured';

export interface SignInResult {
  state: AuthState;
  message: string;
}

/** Verifies against the server. The password is never compared in the browser. */
export async function signIn(password: string): Promise<SignInResult> {
  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      try {
        sessionStorage.setItem(SESSION_KEY, password);
      } catch {
        /* session will just not persist across reloads */
      }
      return { state: 'unlocked', message: '' };
    }

    if (res.status === 401) return { state: 'locked', message: 'Incorrect password.' };
    if (res.status === 501)
      return {
        state: 'unconfigured',
        message: 'ADMIN_PASSWORD is not set on this deployment yet. See CMS.md.',
      };

    return { state: 'locked', message: `Sign-in failed (${res.status}).` };
  } catch {
    return {
      state: 'unconfigured',
      message: 'No backend reachable — the studio needs a deployed API. See CMS.md.',
    };
  }
}

/** Returns the password from this tab's session, if the user already signed in. */
export function currentSession(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function signOut(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* nothing to clear */
  }
}
