import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { Line } from 'react-chartjs-2';

export function LinePlot({
  x,
  y,
  headers,
}: {
  x: number[];
  y: number[];
  headers: string[];
}) {
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
  };

  const data = {
    labels: x,
    datasets: [
      {
        label: headers['1'],
        data: y,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return <Line style={{ maxHeight: '100%' }} options={options} data={data} />;
}
