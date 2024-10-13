/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CanvasComponent from "./CanvasComponent";

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
    window.location.href = 'http://localhost:8787/oauth/request_token';
  };

  return (
    <div>
      <h1>Login with Twitter</h1>
      <button onClick={handleLogin}>Log in</button>
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
          const response = await fetch(`http://localhost:8787/oauth/callback?code=${code}&state=${state}`,
            {
              credentials: 'include', // Add this line to include credentials in the request
            }
          );
          const data = await response.json();

          if (data.access_token && data.refresh_token) {
            // Store the credentials securely
            const credentials: Credentials = {
              userId: '', // Set the appropriate user ID
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              expiresAt: Date.now() + data.expires_in * 1000,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
            console.log("*** credentials", credentials);

            // Redirect the user back to the main page
            window.location.href = '/';
          } else {
            throw new Error('No access token or refresh token received');
          }
        } catch (error) {
          console.error('Authentication error:', error);
          setError('Authentication failed. Please try again.');
        }
      } else {
        console.error('Missing code or state');
        setError('Invalid callback parameters. Please try logging in again.');
      }
    };

    fetchAccessToken();
  }, []);

  if (error) {
    return (
      <div>
        <h1>Authentication Error</h1>
        <p>{error}</p>
        <a href="/">Go back to the main page</a>
      </div>
    );
  }

  return (
    <div>
      <h1>Authenticating...</h1>
    </div>
  );
};

const TwitterShare: React.FC<{ accessToken: string }> = ({ accessToken }) => {
  const [imageData, setImageData] = useState<string | null>(null);

  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (canvas) {
      const dataURL = canvas.toDataURL();
      setImageData(dataURL);
    }
  }, []);

  const shareOnTwitter = async () => {
    if (!imageData) {
      alert("No image to share!");
      return;
    }

    try {
      // Upload the image to Twitter
      const mediaResponse = await axios.post(
        "https://upload.twitter.com/1.1/media/upload.json",
        {
          media_data: imageData.split(",")[1],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const mediaId = mediaResponse.data.media_id_string;

      // Share the tweet with the uploaded image
      await axios.post(
        "https://api.twitter.com/2/tweets",
        {
          text: "Check out this image!",
          media: {
            media_ids: [mediaId],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Tweet shared successfully!");
    } catch (error) {
      console.error("Error sharing tweet:", error);
    }
  };

  return (
    <div>
      <button onClick={shareOnTwitter}>Share on Twitter</button>
    </div>
  );
};

export default function App() {
  const [data, setData] = useState<Record<string, { name: string; text: string }>>();
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);

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
    } else {
      // localStorage.removeItem(STORAGE_KEY);
      // setCredentialsData(undefined);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setCredentials(undefined);
  }, [setCredentials]);

  const fetchData = useCallback(
    async (event: { preventDefault: () => void }) => {
      event.preventDefault();

      if (!credentials) {
        throw new Error("User not authenticated");
      }

      setLoading(true);

      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}process`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${credentials.accessToken}`,
          },
          body: JSON.stringify({
            userId: credentials.userId,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch data.");
        }

        const data = await res.json();
        setData(data.data);
        setScore(data.score);

        return data;
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [credentials]
  );

  if (window.location.pathname.includes("/callback")) {
    return <CallbackPage />;
  }

  if (!credentials) {
    return (
      <div>
        <LoginPage />
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-sm w-full px-4">
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
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-4"
          onClick={disconnect}
        >
          Disconnect Twitter
        </button>
        {score !== null && (
          <div className="mt-4">
            <p>Your score is: {score}</p>
          </div>
        )}
        {data && (
          <div className="mt-4 w-full h-48 overflow-y-auto">
            {Object.entries(data).map(([key, value]) => (
              <div key={key}>
                {value.name} - {value.text}
              </div>
            ))}
          </div>
        )}
      </div>
      <CanvasComponent />
      <TwitterShare accessToken={credentials.accessToken} />
    </div>
  );
}