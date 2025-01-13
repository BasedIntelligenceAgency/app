import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Belief {
  belief: string;
  confidence: number;
  importance: number;
}

interface ComboChartProps {
  contrarian_beliefs: Belief[];
  mainstream_beliefs: Belief[];
}

export const ComboChart = ({
  contrarian_beliefs,
  mainstream_beliefs,
}: ComboChartProps) => {
  const labels = contrarian_beliefs.map((_, index) => `Belief ${index + 1}`);

  const data = {
    labels,
    datasets: [
      {
        type: "bar" as const,
        label: "Contrarian Beliefs Confidence",
        data: contrarian_beliefs.map((belief) => belief.confidence),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        type: "line" as const,
        label: "Mainstream Beliefs Confidence",
        data: mainstream_beliefs
          .slice(0, labels.length)
          .map((belief) => belief.confidence),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-xl font-bold text-center mb-4">
        Belief Confidence Comparison
      </h2>
      <Chart
        type="bar"
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Contrarian vs Mainstream Belief Confidence",
            },
          },
        }}
      />
    </div>
  );
};
