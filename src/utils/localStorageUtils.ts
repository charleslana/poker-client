const accessTokenKey = 'accessToken';

export function saveAccessToken(token: string): void {
  localStorage.setItem(accessTokenKey, token);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(accessTokenKey);
}

export function removeAccessToken(): void {
  localStorage.removeItem(accessTokenKey);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
