import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface Belief {
  belief: string;
  confidence: number;
  importance: number;
}

interface RadarChartProps {
  contrarian_beliefs: Belief[];
  mainstream_beliefs: Belief[];
}

export const RadarChart = ({
  contrarian_beliefs,
  mainstream_beliefs,
}: RadarChartProps) => {
  const data = {
    // Each label represents a data point on the radar
    labels: [
      "Confidence",
      "Importance",
      "Number of Beliefs",
      "Average Score",
      "Conviction Level",
    ],
    datasets: [
      {
        label: "Contrarian Beliefs",
        // Each value corresponds to a label above
        data: [
          // Average confidence
          contrarian_beliefs.reduce(
            (acc, belief) => acc + belief.confidence,
            0
          ) / contrarian_beliefs.length,
          // Average importance (converted to 0-100 scale)
          contrarian_beliefs.reduce(
            (acc, belief) => acc + Number(belief.importance) * 100,
            0
          ) / contrarian_beliefs.length,
          // Number of beliefs (normalized to 0-100)
          (contrarian_beliefs.length / 10) * 100,
          // Average of confidence and importance
          contrarian_beliefs.reduce(
            (acc, belief) =>
              acc + (belief.confidence + Number(belief.importance) * 100) / 2,
            0
          ) / contrarian_beliefs.length,
          // Conviction level (using confidence as proxy)
          contrarian_beliefs.reduce(
            (acc, belief) => acc + belief.confidence,
            0
          ) / contrarian_beliefs.length,
        ],
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 99, 132, 1)",
      },
      {
        label: "Mainstream Beliefs",
        data: [
          mainstream_beliefs.reduce(
            (acc, belief) => acc + belief.confidence,
            0
          ) / mainstream_beliefs.length,
          mainstream_beliefs.reduce(
            (acc, belief) => acc + Number(belief.importance) * 100,
            0
          ) / mainstream_beliefs.length,
          (mainstream_beliefs.length / 10) * 100,
          mainstream_beliefs.reduce(
            (acc, belief) =>
              acc + (belief.confidence + Number(belief.importance) * 100) / 2,
            0
          ) / mainstream_beliefs.length,
          mainstream_beliefs.reduce(
            (acc, belief) => acc + belief.confidence,
            0
          ) / mainstream_beliefs.length,
        ],
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-xl font-bold text-center mb-4">Belief Analysis</h2>
      <Radar
        data={data}
        options={{
          responsive: true,
          scales: {
            r: {
              min: 0,
              max: 100,
              beginAtZero: true,
              ticks: {
                stepSize: 20,
              },
            },
          },
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Contrarian vs Mainstream Beliefs",
            },
          },
        }}
      />
    </div>
  );
};
