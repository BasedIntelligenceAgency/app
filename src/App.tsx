import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadarController,
  RadialLinearScale,
  Tooltip,
  type ChartData,
  type ChartOptions
} from 'chart.js';
import React, { useCallback, useEffect, useRef, useState } from "react";

import { ComposeDialog } from './Compose';

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
const credentialCache: Record<string, Credentials> = {};

const LoginPage: React.FC = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/oauth/request_token`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Login with Twitter</h1>
      <button 
        onClick={handleLogin}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Log in
      </button>
    </div>
  );
};

interface RadarChartProps {
  data: any;
  credentials: Credentials;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, credentials }) => {
  const [isSharing, setIsSharing] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [uploadedMediaId, setUploadedMediaId] = useState<string>();
  
  useEffect(() => {
    if (!chartRef.current || !data) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d')!;

    const chartData: ChartData<'radar'> = {
      labels: ['Based Score', 'Sincerity Score', 'Truthfulness Score', 'Conspiracy Score'],
      datasets: [{
        label: 'Your Scores',
        data: [
          data.based_score,
          data.sincerity_score,
          data.truthfulness_score,
          data.conspiracy_score
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
      }]
    };

    const options: ChartOptions<'radar'> = {
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          enabled: true
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };

    chartInstance.current = new ChartJS(ctx, {
      type: 'radar',
      data: chartData,
      options: options
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  const defaultTweet = `My Political Compass Analysis:

Based Score: ${data.based_score}%
Sincerity Score: ${data.sincerity_score}%
Truthfulness Score: ${data.truthfulness_score}%
Conspiracy Score: ${data.conspiracy_score}%

Tribal Affiliation: ${data.tribal_affiliation}

#BasedOrBiased`;

  const handleShare = async () => {
    if (!chartRef.current || isSharing) return;

    try {
      setIsSharing(true);

      // 1. Upload image
      const blob = await new Promise<Blob>((resolve) => {
        chartRef.current!.toBlob((b) => resolve(b!), 'image/png', 1.0);
      });

      const formData = new FormData();
      formData.append('media', blob, 'political-compass.png');

      const uploadResponse = await fetch(`${import.meta.env.VITE_SERVER_URL}/tweet`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload media');
      }

      const { mediaId } = await uploadResponse.json();
      console.log('Media uploaded successfully:', mediaId);
      
      // 2. Show compose dialog
      setUploadedMediaId(mediaId);
      setShowComposeDialog(true);

    } catch (error) {
      console.error('Error preparing share:', error);
      alert('Failed to prepare share. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleTweet = async (text: string) => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/tweet`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        mediaId: uploadedMediaId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to post tweet');
    }

    const data = await response.json();
    console.log('Tweet posted:', data);
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-96 h-96 relative">
        <canvas ref={chartRef} />
      </div>
      <button 
        onClick={handleShare}
        disabled={isSharing}
        className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded
          ${isSharing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSharing ? 'Preparing...' : 'Share on Twitter'}
      </button>

      <ComposeDialog
        isOpen={showComposeDialog}
        onClose={() => setShowComposeDialog(false)}
        mediaId={uploadedMediaId}
        defaultText={defaultTweet}
        onTweet={handleTweet}
      />
    </div>
  );
};

const CallbackPage: React.FC = () => {
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
            window.location.href = '/';
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

export default function App() {
  const [data, setData] = useState<Record<string, any>>();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentialsData] = useState<Credentials | undefined>(() => {
    const storedCredentials = localStorage.getItem(STORAGE_KEY);
    return storedCredentials ? JSON.parse(storedCredentials) : undefined;
  });

  const setCredentials = useCallback((credentials: Credentials | undefined): void => {
    if (credentials) {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
      } else {
        credentialCache[credentials.userId] = credentials;
      }
      setCredentialsData(credentials);
    }
  }, []);

  const disconnect = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    setCredentials(undefined);
    setData(undefined);
  }, [setCredentials]);

  const fetchData = useCallback(
    async (event: { preventDefault: () => void }) => {
      if (loading) return;
      event.preventDefault();

      if (!credentials) {
        throw new Error("User not authenticated");
      }

      setLoading(true);

      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/process`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${credentials.accessToken}`
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: credentials.userId
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch data.");
        }

        const responseData = await res.json();
        setData(responseData);
        return responseData;
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [credentials, loading]
  );

  if (window.location.pathname.includes("/callback")) {
    return <CallbackPage />;
  }

  if (!credentials) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="flex justify-center space-x-4">
          <button
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? "Loading..." : data ? "Fetch Again" : "Fetch Data"}
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={disconnect}
          >
            Disconnect Twitter
          </button>
        </div>

        {data && (
          <div className="space-y-8">
            {/* Radar Chart */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-center">Political Compass</h2>
              <RadarChart data={data} credentials={credentials} />
            </div>

            {/* Data Display */}
            <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
              <div>
                <h2 className="text-xl font-bold">Tribal Affiliation</h2>
                <p className="mt-2">{data.tribal_affiliation}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold">Justification for Basedness</h2>
                <p className="mt-2">{data.justification_for_basedness}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold">Contrarian Beliefs</h2>
                <div className="space-y-4 mt-2">
                  {data.contrarian_beliefs.map((belief: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded">
                      <p><strong>Belief:</strong> {belief.belief}</p>
                      <p><strong>Justification:</strong> {belief.justification}</p>
                      <p><strong>Confidence:</strong> {belief.confidence}</p>
                      <p><strong>Importance:</strong> {belief.importance}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold">Mainstream Beliefs</h2>
                <div className="space-y-4 mt-2">
                  {data.mainstream_beliefs.map((belief: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded">
                      <p><strong>Belief:</strong> {belief.belief}</p>
                      <p><strong>Justification:</strong> {belief.justification}</p>
                      <p><strong>Confidence:</strong> {belief.confidence}</p>
                      <p><strong>Importance:</strong> {belief.importance}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold">Scores</h2>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <p><strong>Based Score:</strong> {data.based_score}</p>
                  <p><strong>Sincerity Score:</strong> {data.sincerity_score}</p>
                  <p><strong>Truthfulness Score:</strong> {data.truthfulness_score}</p>
                  <p><strong>Conspiracy Score:</strong> {data.conspiracy_score}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}