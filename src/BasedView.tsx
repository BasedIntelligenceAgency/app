import LoadingMessages from "./LoadingMessages";
import { Shareable } from "./Shareable";
import { Credentials } from "./types";

export function BasedView({
  loading,
  data,
  credentials,
  disconnect,
}: {
  loading: boolean;
  data: Record<string, any> | undefined;
  credentials: Credentials;
  disconnect: () => void;
}) {
  return (
    <div className="h-full w-full space-y-8">
      <div className="flex justify-end space-x-4">
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          onClick={disconnect}
        >
          Log Out
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingMessages />
        </div>
      ) : data ? (
        <div className="min-h-screen flex flex-col justify-center items-center">
          <div className="mt-4 space-y-8 flex flex-col items-center text-center w-full max-w-4xl px-4">
            <div className="grid grid-cols-1 gap-8 w-full">
              <Shareable data={data} credentials={credentials} />
            </div>
  
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
                {data.contrarian_beliefs.map(
                  (belief: {
                    belief: string;
                    justification: string;
                    confidence: string | number;
                    importance: string | number;
                  }, index: number) => (
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
                  )
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">Mainstream Beliefs</h2>
                {data.mainstream_beliefs.map(
                  (belief: {
                    belief: string;
                    justification: string;
                    confidence: string | number;
                    importance: string | number;
                  }, index: number) => (
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
                  )
                )}
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
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingMessages />
        </div>
      )}
    </div>
  );
}