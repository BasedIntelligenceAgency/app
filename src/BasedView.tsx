import { useState } from "react";
import { Credentials } from "./App";
import OverviewElement from "./OverviewElement";
import { Shareable } from "./Shareable";
import Switch from "./Switch";

export function BasedView({
  loading,
  data,
  credentials,
  fetchData,
  disconnect,
}: {
  loading: boolean;
  data: Record<string, any> | undefined;
  credentials: Credentials;
  fetchData: (event: { preventDefault: () => void }) => Promise<any>;
  disconnect: () => void;
}) {
  const [menu, setMenu] = useState(0);

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 flex-col">
      <div className="fixed bottom-4 right-4">
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          onClick={disconnect}
        >
          Disconnect Twitter
        </button>
      </div>
      <Switch state={menu} setState={setMenu} />
      <OverviewElement />
    </div>
  );
}
