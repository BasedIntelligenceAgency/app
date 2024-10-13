/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js";
import { useCallback, useMemo, useState } from "react";
import CanvasComponent from "./CanvasComponent";

export function getSupabaseClient() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  console.log("*** url", url);
  console.log("*** anonKey", anonKey);

  if (!url || !anonKey) {
    throw new Error("Missing Supabase credentials");
  }

  return createClient(url, anonKey);
}

type Credentials = {
  userId: string;
};

const STORAGE_KEY = "sb-ypswcnhnviqsfrxzvmqx-auth-token";

const credentialCache: Record<string, Credentials> = {};

export default function App() {
  const [data, setData] = useState<Record<string, { name: string; text: string }>>();
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const getCredentials = useMemo(() => {
    return (): Credentials | undefined => {
      const storedCredentials = localStorage.getItem(STORAGE_KEY);
      if (storedCredentials) {
        const parsedCredentials = JSON.parse(storedCredentials);
        if (parsedCredentials.user) {
          return {
            userId: parsedCredentials.user.user_metadata.user_name,
          };
        }
      }
      return undefined;
    };
  }, []);

  const [credentials, setCredentialsData] = useState<Credentials | undefined>(getCredentials());

  const setCredentials = useCallback((credentials: Credentials | undefined): void => {
    if (credentials) {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
      } else {
        credentialCache[credentials.userId] = credentials;
      }
      setCredentialsData(credentials);
    } else {
      // TODO: Keep this inactive or it kills our flow
      // localStorage.removeItem(STORAGE_KEY);
      // setCredentialsData(undefined);
    }
  }, []);

  const connectTwitter = useCallback(async () => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "twitter",
      options : {
        redirectTo: "http://localhost:5173"
      }
    });

    if (error) {
      console.error("Error signing in with Twitter:", error.message);
      throw error;
    }

    console.log("*** data", data);

    if ((data as any).user) {
      const userId = (data as any).user.user_metadata.user_name;

      const result = {
        userId: userId,
      };

      setCredentials(result);

      return result;
    } else {
      throw new Error("User data not available");
    }
  }, [setCredentials]);


  const [inFlight, setInFlight] = useState(false);

  const connect = useCallback(() => {
    setInFlight(true);
    connectTwitter()
      .then((credentials) => {
        setCredentials(credentials);
      })
      .finally(() => {
        setInFlight(false);
      });
  }, [connectTwitter, setCredentials]);

  const disconnect = useCallback(async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    setCredentials(undefined);
  }, [setCredentials]);

  const fetchData = useCallback(
    async (event: { preventDefault: () => void }) => {
      event.preventDefault();
  
      console.log(credentials);
  
      setLoading(true); // Set loading state to true
  
      try {
        // Post the tweet to the API.
        const res = await fetch(import.meta.env.VITE_SERVER_URL + "process", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: credentials!.userId,
          }),
        });
  
        // TODO: Handle errors
        if (!res.ok) {
          throw new Error("Failed to post process.");
        }
  
        const data = await res.json();
        console.log(data);
        setData(data.data);
        setScore(data.score); // Set the score received from the API
  
        return data;
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading state back to false
      }
    },
    [credentials]
  );
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-sm w-full px-4">
        {credentials && (
          <button
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? "Loading..." : data ? "Fetch Again" : "Fetch Data"}
          </button>
        )}
        {!credentials && (
          <button
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${
              inFlight ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={credentials ? disconnect : connect}
            disabled={inFlight}
          >
            {credentials ? "Disconnect Twitter" : "Connect Twitter"}
          </button>
        )}
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
    </div>
  );
}
