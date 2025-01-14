import { Credentials } from "./App";
import { Shareable } from "./Shareable";


export function BasedView({
  loading, data, credentials, fetchData, disconnect,
}: {
  loading: boolean;
  data: Record<string, any> | undefined;
  credentials: Credentials;
  fetchData: (event: { preventDefault: () => void; }) => Promise<any>;
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

      {data && (
        <div className="space-y-8">
          {/* Radar Chart */}
          <div className="border-2 border-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Political Compass
            </h2>
            <Shareable data={data} credentials={credentials} />
          </div>

          {/* Data Display */}
          <div className="border-2 border-white p-6 rounded-lg">
            <div>
              <h2 className="text-xl font-bold">Tribal Affiliation</h2>
              <p className="mt-2">{data.tribal_affiliation}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Justification for Basedness
              </h2>
              <p className="mt-2">{data.justification_for_basedness}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold">Contrarian Beliefs</h2>
              <div className="space-y-4 mt-2">
                {data.contrarian_beliefs.map((belief: any, index: number) => (
                  <div key={index}>
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
            </div>

            <div>
              <h2 className="text-xl font-bold">Mainstream Beliefs</h2>
              <div className="space-y-4 mt-2">
                {data.mainstream_beliefs.map((belief: any, index: number) => (
                  <div key={index}>
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
            </div>

            <div>
              <h2 className="text-xl font-bold">Scores</h2>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <p>
                  <strong>Based Score:</strong> {data.based_score}
                </p>
                <p>
                  <strong>Sincerity Score:</strong> {data.sincerity_score}
                </p>
                <p>
                  <strong>Truthfulness Score:</strong>{" "}
                  {data.truthfulness_score}
                </p>
                <p>
                  <strong>Conspiracy Score:</strong> {data.conspiracy_score}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
