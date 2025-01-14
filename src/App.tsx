import "./index.css";
import "./App.css";
import { useCallback, useEffect, useState } from "react";

import { CallbackPage } from "./CallbackPage";
import { LoginPage } from "./Login";
import { BasedView } from "./BasedView";
import { Credentials } from "./types";

const STORAGE_KEY = "twitter-oauth-token";
const DATA_STORAGE_KEY = "user-based-data";
const credentialCache: Record<string, Credentials> = {};

export default function App() {
  const [data, setData] = useState<Record<string, any>>(() => {
    const storedData = localStorage.getItem(DATA_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : undefined;
  });
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentialsData] = useState<Credentials | undefined>(() => {
    const storedCredentials = localStorage.getItem(STORAGE_KEY);
    return storedCredentials ? JSON.parse(storedCredentials) : undefined;
  });

  const setCredentials = useCallback(
    (credentials: Credentials | undefined): void => {
      if (credentials) {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
        } else {
          credentialCache[credentials.userId] = credentials;
        }
        setCredentialsData(credentials);
      }
    },
    []
  );

  const disconnect = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DATA_STORAGE_KEY);
    setCredentials(undefined);
    setData({});
    window.location.href = "/";
  }, [setCredentials]);

  const fetchData = useCallback(async () => {
    if (loading || !credentials) return;

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${credentials.accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          userId: credentials.userId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data.");
      }

      const responseData = await res.json();
      setData(responseData);
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(responseData));
      return responseData;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [credentials, loading]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isFreshAuth = params.get('fresh_auth') === 'true';
    
    // Only fetch if we don't have data or if it's a fresh authentication
    if (credentials && (isFreshAuth || !data)) {
      // Clean up the URL if it's a fresh auth
      if (isFreshAuth) {
        window.history.replaceState({}, '', '/');
      }
      // Fetch data automatically
      fetchData();
    }
  }, [credentials, fetchData, data]);

  if (window.location.pathname.includes("/callback")) {
    return <CallbackPage />;
  }

  if (!credentials) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <BasedView
        loading={loading}
        data={data}
        credentials={credentials}
        disconnect={disconnect}
      />
    </div>
  );
}