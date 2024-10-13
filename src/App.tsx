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

interface ApiResponse {
  tribal_affiliation: string;
  justification_for_basedness: string;
  contrarian_beliefs: Array<{
    belief: string;
    justification: string;
    confidence: number;
    importance: number;
  }>;
  mainstream_beliefs: Array<{
    belief: string;
    justification: string;
    confidence: number;
    importance: number;
  }>;
  based_score: number;
  sincerity_score: number;
  truthfulness_score: number;
  conspiracy_score: number;
}

export default function App() {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

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
      options: {
        redirectTo: "http://localhost:5173",
      },
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

      setLoading(true);

      try {
        const res = await fetch(import.meta.env.VITE_SERVER_URL + "process", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: credentials!.userId,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to process data.");
        }

        const data: ApiResponse = await res.json();
        console.log(data);
        setApiData(data);

        return data;
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [credentials]
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold m-4 mx-auto text-center">Based or Biased</h1>
      <h2 className="text-lg mb-4 mx-auto text-center">Are you a free thinker or an NPC? Log in to find out.</h2>
      <div className="mx-auto p-4 w-full flex flex-col items-center justify-center">
        {credentials && (
          <button
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? "Loading..." : apiData ? "Fetch Again" : "Fetch Data"}
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
        {apiData && (
          <div className="mt-4 space-y-4 flex flex-col items-center text-center">
            <div>
              <h2 className="text-xl font-bold">Tribal Affiliation</h2>
              <p>{apiData.tribal_affiliation}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold">Justification for Basedness</h2>
              <p>{apiData.justification_for_basedness}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold">Contrarian Beliefs</h2>
              {apiData.contrarian_beliefs.map((belief, index) => (
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
              {apiData.mainstream_beliefs.map((belief, index) => (
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
                <strong>Based Score:</strong> {apiData.based_score}
              </p>
              <p>
                <strong>Sincerity Score:</strong> {apiData.sincerity_score}
              </p>
              <p>
                <strong>Truthfulness Score:</strong> {apiData.truthfulness_score}
              </p>
              <p>
                <strong>Conspiracy Score:</strong> {apiData.conspiracy_score}
              </p>
            </div>
          </div>
        )}
      </div>
      {/* <CanvasComponent /> */}
    </div>
  );
}