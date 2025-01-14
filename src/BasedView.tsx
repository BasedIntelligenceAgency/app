import { Credentials } from "./types";
import { useState } from "react";
import OverviewElement from "./OverviewElement";
import Switch from "./Switch";
import SpiderWebCategories from "./SpiderWebCategories";
import BasedVsBiased from "./BasedVsBiased";

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

  console.log("data", data);

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 flex-col">
      <div className="fixed bottom-4 right-4 z-20">
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          onClick={disconnect}
        >
          Log Out
        </button>
      </div>
      <Switch state={menu} setState={setMenu} />
      {menu === 0 && (
        <OverviewElement
          title={data?.tribal_affiliation}
          percentage={data?.based_score}
          name={"JOHNWINSTON"}
          username={"JOHNDIPPEDALOT"}
          tweets={1234}
          description={data?.justification_for_basedness}
          image="https://static.wikia.nocookie.net/prodigyroleplay/images/5/5b/Ezgif-5-30f701527f.jpg"
        />
      )}
      {menu === 1 && <SpiderWebCategories />}
      {menu === 3 && <BasedVsBiased />}
      {menu === 4 && (
        <OverviewElement
          name={"BLABLA123"}
          username={"BLABLA123"}
          tweets={1234}
          description={
            "MAGA Facebook Uncle (Progressive vs Conservative values, complete opposite social views)"
          }
          image="https://thumbs.dreamstime.com/b/grinning-man-fedora-hat-28126280.jpg"
          mode="nemsis"
        />
      )}
    </div>
  );
}
