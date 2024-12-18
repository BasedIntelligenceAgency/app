import { TwitterOAuthCredentials } from '../types';

const STORAGE_KEY = 'twitter-oauth-token';

export const getStoredCredentials = (): TwitterOAuthCredentials | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  try {
    const credentials = JSON.parse(stored) as TwitterOAuthCredentials;
    if (Date.now() >= credentials.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return credentials;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const storeCredentials = (credentials: TwitterOAuthCredentials): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
};

export const clearCredentials = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const refreshAccessToken = async (refreshToken: string): Promise<TwitterOAuthCredentials> => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/oauth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  const data = await response.json();
  const credentials: TwitterOAuthCredentials = {
    userId: data.user_id,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  storeCredentials(credentials);
  return credentials;
}; 