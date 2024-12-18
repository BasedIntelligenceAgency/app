import { TweetAnalysis } from '../types';

const API_BASE = import.meta.env.VITE_SERVER_URL;

export async function startOAuth(): Promise<string> {
  console.log('Making request to:', `${API_BASE}/oauth/init`);
  
  const response = await fetch(`${API_BASE}/oauth/init`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new Error(`Please wait ${retryAfter || '30'} seconds before trying again`);
    }
    const error = await response.text();
    throw new Error(error || 'Failed to start authentication');
  }

  const data = await response.json();
  if (!data.url) {
    throw new Error('No authorization URL received');
  }

  // Store state and expiration
  localStorage.setItem('oauth-state', JSON.stringify({
    state: data.state,
    expiresAt: Date.now() + (data.expires_in || 600) * 1000
  }));

  return data.url;
}

export async function handleOAuthCallback(code: string, state: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user_id: string;
  username: string;
}> {
  const response = await fetch(`${API_BASE}/oauth/callback`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ code, state })
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorDetails = '';
    
    try {
      if (contentType?.includes('application/json')) {
        const errorJson = await response.json();
        errorDetails = JSON.stringify(errorJson);
      } else {
        errorDetails = await response.text();
      }
    } catch (e) {
      errorDetails = 'Could not parse error response';
    }

    throw new Error(`Server error (${response.status}): ${errorDetails}`);
  }

  return response.json();
}

export async function analyzeTweets(accessToken: string): Promise<TweetAnalysis> {
  console.log('Making analysis request to:', `${API_BASE}/process`);
  
  const response = await fetch(`${API_BASE}/process`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ accessToken })
  });

  if (!response.ok) {
    console.error('Analysis request failed:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    let errorDetails = '';
    try {
      const errorJson = await response.json();
      errorDetails = JSON.stringify(errorJson);
    } catch {
      errorDetails = await response.text();
    }

    throw new Error(`Analysis failed (${response.status}): ${errorDetails}`);
  }

  return response.json();
}
  