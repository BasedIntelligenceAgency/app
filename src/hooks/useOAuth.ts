import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { startOAuth, handleOAuthCallback } from '../lib/api';

export function useOAuth() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const startLogin = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting OAuth process...');
      const authUrl = await startOAuth();
      
      // Add a small delay to ensure state is stored
      await new Promise(resolve => setTimeout(resolve, 500));
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to start OAuth:', error);
      setError(error instanceof Error ? error.message : 'Failed to start login');
      setIsLoading(false);
    }
  }, []);

  const handleCallback = useCallback(async (code: string, state: string) => {
    if (!code || !state) {
      setError('Missing login parameters');
      navigate('/');
      return;
    }

    // Validate stored state
    const storedStateData = localStorage.getItem('oauth-state');
    if (!storedStateData) {
      setError('Login session not found. Please try again.');
      navigate('/');
      return;
    }

    const { state: expectedState, expiresAt } = JSON.parse(storedStateData);
    if (state !== expectedState) {
      setError('Invalid login session. Please try again.');
      navigate('/');
      return;
    }

    if (Date.now() > expiresAt) {
      setError('Login session expired. Please try again.');
      navigate('/');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Handling OAuth callback...');
      const result = await handleOAuthCallback(code, state);
      
      // Store the access token
      localStorage.setItem('twitter_token', result.access_token);
      localStorage.setItem('twitter_username', result.username);

      // Clean up state
      localStorage.removeItem('oauth-state');

      // Navigate to analysis page
      navigate('/analyzing');
    } catch (error) {
      console.error('OAuth callback failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to complete login');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  return {
    startLogin,
    handleCallback,
    error,
    isLoading
  };
} 