import {
    Chart as ChartJS, Filler,
    Legend,
    LineElement,
    PointElement,
    RadarController,
    RadialLinearScale,
    Tooltip, type ChartData, type ChartOptions
} from "chart.js";
import React, { useEffect, useRef, useState } from "react";
import { ComposeDialog } from "./Compose";
import { Credentials } from "./types";
  
  // Register Chart.js components
  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    RadarController
  );

interface ShareableProps {
  data: any;
  credentials: Credentials;
}

export const Shareable: React.FC<ShareableProps> = ({ data, credentials }) => {
  const [isSharing, setIsSharing] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [uploadedMediaId, setUploadedMediaId] = useState<string>();

  useEffect(() => {
    if (!chartRef.current || !data) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d")!;

    const chartData: ChartData<"radar"> = {
      labels: [
        "Based Score",
        "Sincerity Score",
        "Truthfulness Score",
        "Conspiracy Score",
      ],
      datasets: [
        {
          label: "Your Scores",
          data: [
            data.based_score,
            data.sincerity_score,
            data.truthfulness_score,
            data.conspiracy_score,
          ],
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(54, 162, 235, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(54, 162, 235, 1)",
        },
      ],
    };

    const options: ChartOptions<"radar"> = {
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        tooltip: {
          enabled: true,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };

    chartInstance.current = new ChartJS(ctx, {
      type: "radar",
      data: chartData,
      options: options,
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  const defaultTweet = `My Political Compass Analysis:
  
  Based Score: ${data.based_score}%
  Sincerity Score: ${data.sincerity_score}%
  Truthfulness Score: ${data.truthfulness_score}%
  Conspiracy Score: ${data.conspiracy_score}%
  
  Tribal Affiliation: ${data.tribal_affiliation}
  
  #BasedOrBiased`;

  const handleShare = async () => {
    if (!chartRef.current || isSharing) return;

    try {
      setIsSharing(true);

      // 1. Upload image
      const blob = await new Promise<Blob>((resolve) => {
        chartRef.current!.toBlob((b) => resolve(b!), "image/png", 1.0);
      });

      const formData = new FormData();
      formData.append("media", blob, "political-compass.png");

      const uploadResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/tweet`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${credentials.accessToken}`,
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload media");
      }

      const { mediaId } = await uploadResponse.json();
      console.log("Media uploaded successfully:", mediaId);

      // 2. Show compose dialog
      setUploadedMediaId(mediaId);
      setShowComposeDialog(true);
    } catch (error) {
      console.error("Error preparing share:", error);
      alert("Failed to prepare share. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleTweet = async (text: string) => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/tweet`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        mediaId: uploadedMediaId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to post tweet");
    }

    const data = await response.json();
    console.log("Tweet posted:", data);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-96 h-96 relative">
        <canvas ref={chartRef} />
      </div>
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded
            ${isSharing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isSharing ? "Preparing..." : "Share on Twitter"}
      </button>

      <ComposeDialog
        isOpen={showComposeDialog}
        onClose={() => setShowComposeDialog(false)}
        mediaId={uploadedMediaId}
        defaultText={defaultTweet}
        onTweet={handleTweet}
      />
    </div>
  );
};
