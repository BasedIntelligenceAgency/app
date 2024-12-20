import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { startOAuth, handleOAuthCallback } from '../lib/api';

export function useOAuth() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const startLogin = useCallback(async () => {
    if (isLoading) return; // Prevent double clicks
    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting OAuth process...');
      const authUrl = await startOAuth();
      
      // Log state before redirect
      const storedState = sessionStorage.getItem('oauth-state');
      console.log('Stored OAuth state before redirect:', storedState);
      
      // Immediately redirect to Twitter
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to start OAuth:', error);
      setError(error instanceof Error ? error.message : 'Failed to start login');
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleCallback = useCallback(async (code: string, state: string) => {
    console.log('Handling OAuth callback:', { code, state });
    
    if (!code || !state) {
      console.error('Missing login parameters:', { code, state });
      setError('Missing login parameters');
      navigate('/');
      return;
    }

    // Validate stored state
    const storedStateData = sessionStorage.getItem('oauth-state');
    console.log('Retrieved stored state:', storedStateData);
    
    if (!storedStateData) {
      console.error('No stored state found');
      setError('Login session not found. Please try again.');
      navigate('/');
      return;
    }

    let parsedState;
    try {
      parsedState = JSON.parse(storedStateData);
      console.log('Parsed stored state:', parsedState);
    } catch (e) {
      console.error('Failed to parse stored state:', e);
      setError('Invalid login session. Please try again.');
      navigate('/');
      return;
    }

    const { state: expectedState, expiresAt } = parsedState;
    console.log('State validation:', {
      received: state,
      expected: expectedState,
      expiresAt,
      now: Date.now(),
      isExpired: Date.now() > expiresAt
    });

    if (state !== expectedState) {
      console.error('State mismatch:', { received: state, expected: expectedState });
      setError('Invalid login session. Please try again.');
      navigate('/');
      return;
    }

    if (Date.now() > expiresAt) {
      console.error('Session expired:', { expiresAt, now: Date.now() });
      setError('Login session expired. Please try again.');
      navigate('/');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Calling OAuth callback endpoint...');
      const result = await handleOAuthCallback(code, state);
      console.log('OAuth callback success:', {
        hasAccessToken: !!result.access_token,
        hasUsername: !!result.username
      });
      
      // Store the access token
      localStorage.setItem('twitter_token', result.access_token);
      localStorage.setItem('twitter_username', result.username);

      // Clean up state
      sessionStorage.removeItem('oauth-state');

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