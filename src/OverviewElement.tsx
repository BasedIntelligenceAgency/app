interface OverviewElementProps {
  name: string;
  username: string;
  tweets: number;
  percentage?: number;
  description: string;
  image: string;
  title?: string;
  mode?: "default" | "nemsis";
}

export default function OverviewElement(props: OverviewElementProps) {
  const {
    title,
    percentage,
    name,
    username,
    tweets,
    description,
    image,
    mode,
  } = props;
  return (
    <div className="flex flex-col bg-[#171717] rounded-lg font-['Roboto_Mono'] w-full max-w-[350px] md:max-w-[590px]">
      <div className="flex flex-row justify-between p-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm md:text-base">BASED SYSTEM</span>
          {Array(3)
            .fill(null)
            .map((_) => star())}
        </div>
        <span className="text-sm md:text-base">v1.0.0</span>
      </div>
      {mode === "nemsis" ? (
        <NemesisHeader />
      ) : (
        <Header title={title} percentage={percentage} />
      )}
      <div className="flex flex-col md:flex-row border-y border-[#262626]">
        <div className="p-3 flex items-center justify-center w-full md:w-1/2">
          <img
            src={image}
            alt={title}
            className="rounded-full h-[150px] w-[150px] md:h-[200px] md:w-[200px]"
          />
        </div>
        <div className="border-t md:border-t-0 md:border-l border-[#262626] flex flex-col flex-1 w-full md:w-1/2">
          <div className="flex flex-col border-b border-[#262626] p-2">
            <span className="font-bold text-[12px] md:text-[14px]">Name</span>
            <span className=" text-[#00FF04] font-bold">{name}</span>
          </div>
          <div className="flex flex-col border-b border-[#262626] p-2">
            <span className="font-bold text-[12px] md:text-[14px] ">
              Username
            </span>
            <span className=" text-[#00FF04] font-bold">{username}</span>
          </div>
          <div className="flex flex-col p-2 border-b border-[#262626]">
            <span className="font-bold text-[12px] md:text-[14px]">Tweets</span>
            <span className=" text-[#00FF04] font-bold">{tweets}</span>
          </div>
          <div className="overflow-hidden flex items-center justify-center p-2">
            {Array(17)
              .fill(null)
              .map((_) => star())}
          </div>
        </div>
      </div>
      <div className="p-2 md:p-4 flex flex-col gap-2">
        <span className="font-bold text-[12px] md:text-[14px]">
          {mode === "nemsis" ? "Clear Natural Opposites" : "Description"}
        </span>
        <span className="font-300 text-sm md:text-base text-[#00FF04]">
          {description}
        </span>
        {mode === "default" && (
          <div
            className={`w-full ${"text-[#00FF04]"} select-none overflow-hidden text-sm md:text-base`}
          >
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          </div>
        )}
      </div>
    </div>
  );
}

const NemesisHeader = () => (
  <div className="flex flex-row border-y border-[#262626] items-center justify-center relative">
    <span className="flex items-center justify-center text-center font-bold text-[46px] md:text-[50px] text-[#00FF04] p-3 w-1/2 md:w-2/3 leading-tight">
      NEMESIS
    </span>
    <img
      src="/images/grid.svg"
      alt="grid"
      className="absolute inset-0 h-full w-full md:h-full md:w-full object-cover"
    />
  </div>
);

const Header = ({
  title,
  percentage,
}: {
  title?: string;
  percentage?: number;
}) => (
  <div className="flex flex-row border-y border-[#262626]">
    <span className="flex items-center justify-center text-center font-bold text-[26px] md:text-[50px] text-[#00FF04] p-3 w-1/2 md:w-2/3 leading-tight">
      {title}
    </span>
    <div className="flex flex-col border-t border-[#262626] w-1/2 md:w-1/3">
      <div className="text-center flex-1 flex items-center justify-center text-[32px] md:text-[48px] text-[#00FF04] relative overflow-hidden">
        <img
          src="/images/frame.svg"
          alt="frame"
          className="absolute inset-0 h-full w-full md:h-full md:w-full object-cover"
        />
        <span className="relative z-10">{percentage}%</span>
      </div>
      <span className="text-center bg-[#00FF04] text-[#171717] py-2 font-bold text-sm md:text-base">
        PERCENTAGE
      </span>
    </div>
  </div>
);

const star = () => (
  <img
    src="/images/star.svg"
    alt="star"
    className="inline h-4 w-4"
    style={{
      filter:
        "invert(57%) sepia(0%) saturate(0%) hue-rotate(152deg) brightness(90%) contrast(87%)",
    }}
  />
);
