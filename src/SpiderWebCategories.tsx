import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function SpiderWebCategories() {
  const data = {
    labels: [
      "Tech Bro Cryptard",
      "MAGA Facebook Uncle",
      "Blue-Hair SJW Snowflake",
      "Climate Change Death Cultist",
      "Elon Tribe",
      "Grindset Douchebro",
      "Christian Taliban Warrior",
      "Crystal Healing Hippie",
      "Military Boot Licker",
      "Tradwife Momfluencer",
      "Conspiracy Coomer",
      "Immortality Tech Prophet",
      "Molotov-Throwing Anarchist",
      "Deportation Dan",
      "Doomsday Bunker Prepper",
      "Militant Vegan Extremist",
      "Incel Blackpiller",
      "E-Girl Discord Mod Simp",
    ],
    datasets: [
      {
        label: "Category Intensity",
        data: [
          0,
          85, // Tech Bro
          70, // MAGA
          75, // SJW
          80, // Climate Change
          90, // Elon
          1,
          0,
        ],
        backgroundColor: "rgba(0, 255, 4, 0.2)",
        borderColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: "rgba(255, 255, 255, 0.2)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
          backdropColor: "transparent",
        },
        pointLabels: {
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            size: window.innerWidth < 768 ? 10 : 14,
          },
          callback: (label: string) => {
            const maxLength = window.innerWidth < 768 ? 12 : 14;
            if (label.length <= maxLength) return label;

            const words = label.split(" ");
            let lines = [""];
            let currentLine = 0;

            words.forEach((word) => {
              if ((lines[currentLine] + " " + word).length <= maxLength) {
                lines[currentLine] +=
                  (lines[currentLine].length ? " " : "") + word;
              } else {
                currentLine++;
                lines[currentLine] = word;
              }
            });

            return lines;
          },
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            size: window.innerWidth < 768 ? 16 : 16,
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div
      style={{
        width: "100%",
        height: window.innerWidth < 768 ? "350px" : "590px",
        maxWidth: "800px",
        margin: "0 auto",
        padding: window.innerWidth < 768 ? "10px" : "20px",
        backgroundColor: "#000000",
        borderRadius: "8px",
      }}
    >
      <Radar data={data} options={options} />
    </div>
  );
}
