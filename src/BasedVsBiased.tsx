import { Tweet } from "react-tweet";

export default function BasedVsBiased() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-[60px] text-[#00FF04] mb-8">Based vs Biased</h1>
      <div className="flex flex-row items-center justify-center gap-4">
        <TweetCard tweet="1878894390581805335" theme="based" />
        <TweetCard tweet="1878997650638541286" theme="biased" />
      </div>
    </div>
  );
}

const TweetCard = (props: { tweet: string; theme: "biased" | "based" }) => (
  <div className="flex flex-col items-center justify-center">
    <div
      className={`max-w-[500px] flex flex-col items-center justify-center gap-1 ${
        props.theme === "based"
          ? "bg-gradient-to-b from-[#092F0E] to-black"
          : "bg-[#171717]"
      } rounded-lg p-4`}
    >
      <div className="flex flex-row items-center justify-between gap-4 w-full font-bold text-[1.25em]">
        <h2>Your Most {props.theme === "based" ? "Based" : "Biased"} Tweet</h2>
        <img
          src="/images/random-dots.svg"
          alt="Random dots"
          className={`w-[119px] h-4`}
          style={{
            filter:
              props.theme === "biased"
                ? "invert(37%) sepia(0%) saturate(0%) hue-rotate(152deg) brightness(97%) contrast(92%)"
                : "",
          }}
        />
      </div>
      <div className="light">
        <Tweet id={props.tweet} />
      </div>
      <div
        className={`w-full select-none overflow-hidden text-[20px] ${
          props.theme === "based" ? "text-[#00FF04]" : "text-[#606060]"
        }`}
      >
        ///////////////////////////////////////////////////////////////////////////////////////////////////
      </div>
    </div>
  </div>
);
