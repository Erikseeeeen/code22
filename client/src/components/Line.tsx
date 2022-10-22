import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { Line } from 'react-chartjs-2';
import { RgbColor, Plot } from '../types';

export function LinePlot({ plots }: { plots: Plot[] }) {
  if (plots.length == 0) return <div></div>;
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '',
      },
    },
    scales: {
      x: {
        ticks: {
          callback: (value: number, index: number, _ticks: number[]) => {
            return index % 10 == 0
              ? new Date(value * 1000).toLocaleTimeString()
              : '';
          },
        },
      },
    },
  };

  const colors: RgbColor[] = [
    { r: 255, g: 99, b: 132 },
    { r: 99, g: 132, b: 255 },
    { r: 132, g: 255, b: 99 },
  ];

  const data = {
    labels: plots[0].x,
    datasets: plots.map((plot, i) => {
      const color: RgbColor = colors[i % colors.length];
      return {
        label: plot.headers['1'],
        data: plot.y,
        borderColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
        backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`,
      };
    }),
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <b></b>
      {/* @ts-ignore */}
      <Line style={{ maxHeight: '100%' }} options={options} data={data} />
    </div>
  );
}
