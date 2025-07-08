import { useEffect, useState } from 'react';
// If you don't have 'react-chartjs-2' and 'chart.js', install them: npm i react-chartjs-2 chart.js
import { Line } from 'react-chartjs-2';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function SalesChart() {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch('/api/dashboard/orders');
        const data = await res.json();
        const orders = data.orders || [];
        // Group sales by date (YYYY-MM-DD)
        const salesByDate: Record<string, number> = {};
        orders.forEach((order: any) => {
          const date = order.createdAt?.slice(0, 10);
          if (!date) return;
          salesByDate[date] = (salesByDate[date] || 0) + (order.orderTotal || 0);
        });
        const labels = Object.keys(salesByDate).sort();
        const sales = labels.map((date) => salesByDate[date]);
        setChartData({
          labels,
          datasets: [
            {
              label: 'Sales',
              data: sales,
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99,102,241,0.1)',
              tension: 0.4,
              fill: true,
            },
          ],
        });
      } catch (e) {
        setChartData(null);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-100 my-8">
      <div className="font-bold text-lg mb-4 text-black">Sales Over Time</div>
      {loading ? (
        <div className="h-40 flex items-center justify-center text-gray-400 animate-pulse">Loading chart...</div>
      ) : chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: false },
            },
            scales: {
              x: { grid: { display: false } },
              y: { grid: { color: '#f3f4f6' }, beginAtZero: true },
            },
          }}
        />
      ) : (
        <div className="h-40 flex items-center justify-center text-gray-400">No data</div>
      )}
    </div>
  );
} 