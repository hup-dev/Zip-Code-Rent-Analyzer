import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

interface LineChartProps {
  data?: { name: string; AverageRent: number; TotalRentals: number; }[] | null;
  chartId: string;
}

const LineChart: React.FC<LineChartProps> = ({ chartId, data }) => {
  useEffect(() => {
    if (!data) {
      return;
    }

    const ctx = document.getElementById(chartId) as HTMLCanvasElement;
    const chartContext = ctx.getContext('2d');

    if (!chartContext) {
      return;
    }
    const chart = new Chart(chartContext, {
      type: 'line',
      data: {
        labels: data.map((entry) => entry.name),
        datasets: [
          {
            yAxisID: 'y1',
            label: 'Average Rent',
            data: data.map((entry) => entry.AverageRent),
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
          },
          {
            yAxisID: 'y2',
            label: 'Total Rentals',
            data: data.map((entry) => entry.TotalRentals),
            borderColor: 'rgba(255, 0, 0, 1)',
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Month',
            },
          },
          y1: {
            position: 'left',
            title: {
              display: true,
              text: 'Average Rent',
            },
          },
          y2: {
            position: 'right',
            title: {
              display: true,
              text: 'Total Rentals',
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [data]);

  return <canvas id={chartId} width = "800" height = "400"></canvas>;
};

export default LineChart;
