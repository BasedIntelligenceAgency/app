import { FaXTwitter } from "react-icons/fa6";
import cubeFive from "/public/images/cube-five.svg";
import star from "/public/images/star.svg";

const WORDS_OF_WISDOM = [
  "Blue-Hair SJW Snowflake",
  "MAGA Facebook Uncle",
  "Tech Bro Cryptard",
  "Climate Change Death Cultist",
  "Elon Tribe",
  "Grindset Douchebro",
  "Christian Taliban Warrio",
];

export const LoginPage: React.FC = () => {
  const handleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_SERVER_URL
    }/oauth/request_token`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute w-full h-full object-cover z-0"
      >
        <source src="/video/HomeScreenSmall.mp4" type="video/mp4" />
      </video>

      <div className="items-center flex flex-col justify-center rounded-lg mx-auto w-full md:w-2/3 p-4 gap-6 relative z-10 bg-black/10">
        <h1 className="font-mono font-bold tracking-tighter-custom text-[48px] md:text-[72px] text-center text-[#00FF04]">
          Discover How Based You Really Are
        </h1>
        <p className="text-center text-md font-thin">
          Corem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
          vulputate libero et velit interdum, ac aliquet odio mattis.
        </p>
        <button
          onClick={handleLogin}
          className="bg-[#00FF04] hover:bg-[#00FF04]/80 ml-auto mr-auto text-black font-bold py-2 px-4 rounded flex items-center gap-2"
        >
          Authenticate <FaXTwitter />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full flex justify-center items-center pb-4 px-2 z-10">
        <img src={cubeFive} alt="Blue-Hair SJW Snowflake" className="w-8 h-8" />
        <div className="overflow-hidden relative w-full md:w-[1300px]">
          <p className="flex items-center mx-2 text-[#00FF04] text-sm whitespace-nowrap animate-scroll">
            {[...WORDS_OF_WISDOM, ...WORDS_OF_WISDOM].map((word, index) => (
              <span key={index} className="flex items-center gap-2 ml-4">
                <p>{word.toUpperCase()}</p>
                <img src={star} alt="star" className="w-4 h-4 mx-2" />
              </span>
            ))}
          </p>
        </div>
        <img src={cubeFive} alt="Blue-Hair SJW Snowflake" className="w-8 h-8" />
      </div>
    </div>
  );
};
