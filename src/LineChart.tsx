import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

interface LineChartProps {
  data?: { name: string; AverageRent: number; TotalRentals: number; }[] | null;
  chartId: string;
  theme: string;
}

const LineChart: React.FC<LineChartProps> = ({chartId, data,theme}) => {
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
            label: 'Average Rent',
            data: data.map((entry) => entry.AverageRent),
            borderColor: 'rgba(0, 255, 255, 1)',
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
              color: theme === 'light' ? 'black' : 'white',
            },
            ticks: {
              color: theme === 'light' ? 'black' : 'white',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Average Rent',
              color: theme === 'light' ? 'black' : 'white',
            },
            ticks: {
              color: theme === 'light' ? 'black' : 'white',
            },
          },
          
          
        },
        plugins: {
          tooltip: {
            callbacks: {
              afterLabel: (context) => {
                const dataIndex = context.dataIndex;
                const totalRentals = data[dataIndex].TotalRentals;
                return `Total Rentals: ${totalRentals}`;
              },
            },
            
          },
          legend: {
            labels: {
              color: theme === 'light' ? 'black' : 'white',
            },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [data,theme]);

  return <canvas id={chartId} width = "800" height = "400"></canvas>;
};

export default LineChart;
