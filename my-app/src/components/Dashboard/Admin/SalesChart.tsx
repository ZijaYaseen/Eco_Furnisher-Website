"use client";

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Define chart data type
type ChartDataType = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    fill: boolean;
  }[];
};

// Register Chart.js only on client-side
if (typeof window !== 'undefined') {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
}

interface Order {
  _id: string;
  createdAt: string;
  orderStatus: string;
  trackingStatus: string;
  trackingNumber: string;
  orderTotal?: number;
}

export default function SalesChart() {
  const [chartData, setChartData] = useState<ChartDataType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch('/api/dashboard/orders');
        const data = await res.json();
        const orders: Order[] = data.orders || [];
        
        // Group sales by date with proper typing
        const salesByDate: Record<string, number> = orders.reduce(
          (acc: Record<string, number>, order) => {
            if (!order.createdAt || !order.orderTotal) return acc;
            
            const date = order.createdAt.slice(0, 10);
            acc[date] = (acc[date] || 0) + order.orderTotal;
            return acc;
          }, 
          {} as Record<string, number> // Type assertion here
        );

        // Sort dates and prepare chart data
        const sortedDates = Object.keys(salesByDate).sort();
        const salesData = sortedDates.map(date => salesByDate[date]);
        
        setChartData({
          labels: sortedDates,
          datasets: [
            {
              label: 'Sales',
              data: salesData,
              borderColor: '#222',
              backgroundColor: 'rgba(100,100,100,0.05)',
              tension: 0.4,
              fill: true,
            },
          ],
        });
      } catch (e) {
        console.error('Failed to fetch sales data:', e);
        setChartData(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <div className="shadow-lg border border-gray-200 bg-white my-8 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="font-bold text-xl text-gray-900 tracking-wide">
          Sales Overview
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="h-24 flex items-center justify-center text-gray-400 animate-pulse">
            Loading chart...
          </div>
        ) : chartData ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: { display: false },
              },
              scales: {
                x: { 
                  grid: { display: false },
                  ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 }
                },
                y: { 
                  grid: { color: '#e5e7eb' }, 
                  beginAtZero: true,
                  ticks: { callback: value => `$${value}` }
                },
              },
            }}
            height={300}
          />
        ) : (
          <div className="h-24 flex items-center justify-center text-gray-400">
            No sales data available
          </div>
        )}
      </div>
    </div>
  );
}