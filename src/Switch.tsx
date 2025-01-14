import React from "react";
import { useMediaQuery } from "react-responsive";

interface SwitchProps {
  state: number;
  setState: (state: number) => void;
}

export default function Switch(props: SwitchProps) {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const states = [0, 1, 2, 3, 4];

  const handleNext = () => {
    if (props.state === 4) return;
    props.setState((props.state + 1) % 5);
  };

  const handlePrev = () => {
    if (props.state === 0) return;
    props.setState((props.state - 1 + 5) % 5);
  };

  return (
    <>
      <div className="relative flex items-center justify-center w-full">
        <div className="flex gap-2 py-10 items-center">
          {isDesktop && (
            <button
              onClick={handlePrev}
              disabled={props.state === 0}
              className={props.state === 0 ? "opacity-50" : ""}
            >
              <img
                src="/images/arrow-left.svg"
                alt="Previous"
                className={`w-6 h-6 ${
                  props.state === 0 ? "stroke-[#606060]" : ""
                }`}
              />
            </button>
          )}
          {states.map((index) => (
            <div
              key={index}
              className={`w-[36px] h-[6px] rounded-md transition-colors ${
                props.state === index ? "bg-[#00FF04]" : "bg-[#606060]"
              }`}
            />
          ))}
          {isDesktop && (
            <button
              onClick={handleNext}
              disabled={props.state === states.length - 1}
              className={props.state === states.length - 1 ? "opacity-50" : ""}
            >
              <img
                src="/images/arrow-left.svg"
                alt="Previous"
                className={`w-6 h-6 rotate-180 ${
                  props.state === 0 ? "stroke-[#606060]" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>
      {!isDesktop && (
        <>
          <div
            className="absolute left-0 w-1/2 h-full z-10 cursor-pointer"
            onClick={handlePrev}
          />
          <div
            className="absolute right-0 w-1/2 h-full z-10 cursor-pointer"
            onClick={handleNext}
          />
        </>
      )}
    </>
  );
}
