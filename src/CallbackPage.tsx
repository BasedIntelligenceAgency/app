import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadarController,
  RadialLinearScale,
  Tooltip
} from 'chart.js';
import React, { useEffect, useState } from "react";


// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  RadarController
);


type Credentials = {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

const STORAGE_KEY = "twitter-oauth-token";

export const CallbackPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');

      if (code && state) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_SERVER_URL}/oauth/callback?code=${code}&state=${state}`,
            { credentials: 'include' }
          );
          const data = await response.json();

          if (data.access_token && data.refresh_token) {
            const credentials: Credentials = {
              userId: data.userId || 'default_user',
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              expiresAt: Date.now() + data.expires_in * 1000,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
            
            // Redirect with a flag indicating fresh authentication
            window.location.href = '/?fresh_auth=true';
          } else {
            throw new Error('No access token or refresh token received');
          }
        } catch (error) {
          console.error('Authentication error:', error);
          setError('Authentication failed. Please try again.');
        }
      } else {
        setError('Invalid callback parameters. Please try logging in again.');
      }
    };

    fetchAccessToken();
  }, []);
  
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <a 
            href="/"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            Go back to the main page
          </a>
        </div>
      );
    }
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Authenticating...</h1>
      </div>
    );
  };