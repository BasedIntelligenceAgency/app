import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

interface PolarAreaChartProps {
  scores: {
    based_score: number;
    sincerity_score: number;
    truthfulness_score: number;
    conspiracy_score: number;
  };
}

export const PolarAreaChart = ({ scores }: PolarAreaChartProps) => {
  const data = {
    labels: [
      "Based Score",
      "Sincerity Score",
      "Truthfulness Score",
      "Conspiracy Score",
    ],
    datasets: [
      {
        label: "User Scores",
        data: [
          scores.based_score,
          scores.sincerity_score,
          scores.truthfulness_score,
          scores.conspiracy_score,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-xl font-bold text-center mb-4">Score Distribution</h2>
      <PolarArea
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "User Scores Analysis",
            },
          },
        }}
      />
    </div>
  );
};
