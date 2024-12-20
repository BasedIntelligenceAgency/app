import { TweetAnalysis } from '../types';

const API_BASE = import.meta.env.VITE_SERVER_URL;
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, options: RequestInit, retryCount = 0): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '5');
      const waitTime = retryAfter * 1000 || BASE_DELAY * Math.pow(2, retryCount);
      
      console.warn('Rate limit hit, waiting to retry:', {
        retryCount,
        waitTime,
        retryAfter
      });

      if (retryCount < MAX_RETRIES) {
        await sleep(waitTime);
        return fetchWithRetry(url, options, retryCount + 1);
      }
    }
    
    return response;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      const waitTime = BASE_DELAY * Math.pow(2, retryCount);
      console.warn('Request failed, retrying:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        retryCount,
        waitTime
      });
      await sleep(waitTime);
      return fetchWithRetry(url, options, retryCount + 1);
    }
    throw error;
  }
}

export async function startOAuth(): Promise<string> {
  console.log('Starting OAuth process...');
  
  const response = await fetchWithRetry(`${API_BASE}/oauth/init`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    console.error('OAuth init failed:', {
      status: response.status,
      statusText: response.statusText
    });
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new Error(`Please wait ${retryAfter || '30'} seconds before trying again`);
    }
    
    const error = await response.text();
    throw new Error(error || 'Failed to start authentication');
  }

  const data = await response.json();
  console.log('OAuth init response:', {
    hasUrl: !!data.url,
    hasState: !!data.state
  });

  if (!data.url || !data.state) {
    throw new Error('Invalid response from server');
  }

  // Store state and expiration in sessionStorage instead of localStorage
  // This ensures the state persists across page loads but only for this session
  const stateData = {
    state: data.state,
    expiresAt: Date.now() + 600000 // 10 minutes expiration
  };
  console.log('Storing OAuth state:', stateData);
  sessionStorage.setItem('oauth-state', JSON.stringify(stateData));

  return data.url;
}

export async function handleOAuthCallback(code: string, state: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user_id: string;
  username: string;
}> {
  console.log('Handling OAuth callback:', { code, state });
  
  const storedState = localStorage.getItem('oauth-state');
  console.log('Stored OAuth state:', storedState);

  const response = await fetchWithRetry(`${API_BASE}/oauth/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ code, state })
  });

  if (!response.ok) {
    console.error('OAuth callback failed:', {
      status: response.status,
      statusText: response.statusText
    });

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

  const result = await response.json();
  console.log('OAuth callback success:', {
    hasAccessToken: !!result.access_token,
    hasRefreshToken: !!result.refresh_token,
    hasUserId: !!result.user_id,
    hasUsername: !!result.username
  });

  return result;
}

export async function analyzeTweets(accessToken: string): Promise<TweetAnalysis> {
  console.log('Making analysis request to:', `${API_BASE}/process`);
  
  const response = await fetchWithRetry(`${API_BASE}/process`, {
    method: 'POST',
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
  