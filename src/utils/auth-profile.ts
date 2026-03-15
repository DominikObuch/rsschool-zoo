const AUTH_PROFILE_KEY = 'authProfile';

export interface AuthProfileSnapshot {
  name: string;
  email: string;
  login?: string;
}

function isProfileLike(value: unknown): value is AuthProfileSnapshot {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<AuthProfileSnapshot>;
  return typeof candidate.name === 'string' && typeof candidate.email === 'string';
}

export const authProfileStorage = {
  get(): AuthProfileSnapshot | null {
    try {
      const raw = localStorage.getItem(AUTH_PROFILE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as unknown;
      return isProfileLike(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },

  set(profile: AuthProfileSnapshot): void {
    const normalized: AuthProfileSnapshot = {
      name: profile.name.trim(),
      email: profile.email.trim(),
      login: profile.login?.trim(),
    };

    localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(normalized));
  },

  clear(): void {
    localStorage.removeItem(AUTH_PROFILE_KEY);
  },
};

export { AUTH_PROFILE_KEY };
