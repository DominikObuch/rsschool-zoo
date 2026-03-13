const AUTH_TOKEN_KEY = 'authToken';

export const authTokenStorage = {
  get(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  set(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  clear(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },
};

export { AUTH_TOKEN_KEY };
