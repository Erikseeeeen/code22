import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import { RgbColor, Plot } from "../types";
import annotationPlugin from "chartjs-plugin-annotation";
Chart.register(annotationPlugin);
Chart.register(...registerables);
export function LinePlot({ plot }: { plot: Plot | undefined }) {
  if (!plot) return <div></div>;
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "",
      },
      annotation: {
        annotations: {
          danger1: {
            borderWidth: 0,
            drawTime: "beforeDatasetsDraw",
            type: "box",
            xMin: 0,
            xMax: plot.x.length - 1,
            yMin: -Infinity,
            yMax: plot.limLow,
            backgroundColor: "rgba(255, 0, 0, 0.3)",
          },
          danger2: {
            borderWidth: 0,
            drawTime: "beforeDatasetsDraw",
            type: "box",
            xMin: 0,
            xMax: plot.x.length - 1,
            yMin: plot.limHigh,
            yMax: plot.limHigh + Math.max(...plot.y),
            backgroundColor: "rgba(255, 0, 0, 0.3)",
          },
          limit1: {
            borderWidth: 0,
            drawTime: "beforeDatasetsDraw",
            type: "box",
            xMin: 0,
            xMax: plot.x.length - 1,
            yMin: plot.limLow,
            yMax: plot.recommendedLow,
            backgroundColor: "rgba(255, 170, 0, 0.3)",
          },
          limit2: {
            borderWidth: 0,
            drawTime: "beforeDatasetsDraw",
            type: "box",
            xMin: 0,
            xMax: plot.x.length - 1,
            yMin: plot.recommendedHigh,
            yMax: plot.limHigh,
            backgroundColor: "rgba(255, 170, 0, 0.3)",
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: (value: number, index: number, _ticks: number[]) => {
            return index % 10 == 0
              ? new Date(value * 1000).toLocaleTimeString()
              : "";
          },
        },
      },
      y: {
        min:
          Math.min(
            plot.limLow - 0.5 * Math.abs(plot.recommendedLow - plot.limLow),
            ...plot.y
          ) -
          0.1 * Math.abs(Math.max(...plot.y) - Math.min(...plot.y)),
        max:
          Math.max(
            ...plot.y,
            plot.limHigh + 0.5 * Math.abs(plot.limHigh - plot.recommendedHigh)
          ) +
          0.1 * Math.abs(Math.max(...plot.y) - Math.min(...plot.y)),
      },
    },
  };
  const colors: RgbColor[] = [
    { r: 255, g: 99, b: 132 },
    { r: 99, g: 132, b: 255 },
    { r: 132, g: 255, b: 99 },
  ];
  const data = {
    labels: plot.x,
    datasets: [
      {
        label: plot.y.length > 1 ? plot.headers[1] : "Threshold",
        data: plot.y,
        borderColor: `rgb(${plot.color.r}, ${plot.color.g}, ${plot.color.b})`,
        backgroundColor: `rgba(${plot.color.r}, ${plot.color.g}, ${plot.color.b}, 0.5)`,
        pointStyle: plot.y.length > 1 ? "rectRot" : "line",
        tension: 0.0,
      },
    ],
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <b style={{ position: "absolute", margin: "1em" }}>
        {plot.x.map((value) => new Date(value * 1000).toDateString())[0]}
      </b>
      {/* @ts-ignore */}
      <Line style={{ maxHeight: "100%" }} options={options} data={data} />
    </div>
  );
}
