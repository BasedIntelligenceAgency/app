/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";

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
          const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/oauth/callback?code=${code}&state=${state}`,
            {
              credentials: 'include', // Add this line to include credentials in the request
            }
          );
          const data = await response.json();

          if (data.access_token && data.refresh_token) {
            // Store the credentials securely
            const credentials: Credentials = {
              userId: 'shawmakesmagic', // Set the appropriate user ID
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
    } else {
      // localStorage.removeItem(STORAGE_KEY);
      // setCredentialsData(undefined);
    }
  }, []);

  const disconnect = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    setCredentials(undefined);
    setData(undefined);
  }, [setCredentials]);

  const fetchData = useCallback(
    async (event: { preventDefault: () => void }) => {
      if(loading) {
        return;
      }
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
            Authorization: `Bearer ${credentials.accessToken}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: credentials.userId || 'shawmakesmagic',
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch data.");
        }

        const data = await res.json();
        setData(data);

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

  console.log("*** credentials", credentials);
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
      </div>
      {data && (
          <div className="mt-4 space-y-4 flex flex-col items-center text-center">
            <div>
              <h2 className="text-xl font-bold">Tribal Affiliation</h2>
              <p>{data.tribal_affiliation}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold">Justification for Basedness</h2>
              <p>{data.justification_for_basedness}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold">Contrarian Beliefs</h2>
              {data.contrarian_beliefs.map((belief: { belief: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; justification: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; confidence: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; importance: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                <div key={index} className="mt-2">
                  <p>
                    <strong>Belief:</strong> {belief.belief}
                  </p>
                  <p>
                    <strong>Justification:</strong> {belief.justification}
                  </p>
                  <p>
                    <strong>Confidence:</strong> {belief.confidence}
                  </p>
                  <p>
                    <strong>Importance:</strong> {belief.importance}
                  </p>
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-xl font-bold">Mainstream Beliefs</h2>
              {data.mainstream_beliefs.map((belief: { belief: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; justification: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; confidence: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; importance: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                <div key={index} className="mt-2">
                  <p>
                    <strong>Belief:</strong> {belief.belief}
                  </p>
                  <p>
                    <strong>Justification:</strong> {belief.justification}
                  </p>
                  <p>
                    <strong>Confidence:</strong> {belief.confidence}
                  </p>
                  <p>
                    <strong>Importance:</strong> {belief.importance}
                  </p>
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-xl font-bold">Scores</h2>
              <p>
                <strong>Based Score:</strong> {data.based_score}
              </p>
              <p>
                <strong>Sincerity Score:</strong> {data.sincerity_score}
              </p>
              <p>
                <strong>Truthfulness Score:</strong> {data.truthfulness_score}
              </p>
              <p>
                <strong>Conspiracy Score:</strong> {data.conspiracy_score}
              </p>
            </div>
          </div>
        )}
    </div>
  );
}