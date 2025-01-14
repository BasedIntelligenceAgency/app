export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flip-container w-full">
        <div className="text-2xl font-bold flipper text-center">
          <div className="flip-item">Analyzing your takes...</div>
          <div className="flip-item">Finding your ideological tribe...</div>
          <div className="flip-item">Calculating your Based level...</div>
          <div className="flip-item">Reading between the tweets...</div>
        </div>
      </div>
      <style>
        {`
      .flip-container {
        perspective: 1000px;
        height: 40px;
      
      }

      .flipper {
        position: relative;
        height: 100%;
      }

      .flip-item {
        position: absolute;
        width: 100%;
        animation: flip 8s infinite;
        backface-visibility: hidden;
        opacity: 0;
   
      }

      .flip-item:nth-child(1) {
        animation-delay: 0s;
      }
      .flip-item:nth-child(2) {
        animation-delay: 2s;
      }
      .flip-item:nth-child(3) {
        animation-delay: 4s;
      }
      .flip-item:nth-child(4) {
        animation-delay: 6s;
      }

      @keyframes flip {
        0%,
        20% {
          transform: rotateX(0deg);
          opacity: 1;
        }
        25%,
        100% {
          transform: rotateX(-180deg);
          opacity: 0;
        }
      }
      `}
      </style>
    </div>
  );
}
