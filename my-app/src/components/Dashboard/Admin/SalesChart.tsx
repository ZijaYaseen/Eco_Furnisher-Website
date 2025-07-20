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
  ChartData,
  ChartOptions,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Types from dashboard/orders API
interface Order {
  _id: string;
  createdAt: string;
  orderStatus: string;
  trackingStatus: string;
  trackingNumber: string;
  orderTotal?: number;
  // Add more fields if needed
}

export default function SalesChart() {
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch('/api/dashboard/orders');
        const data = await res.json();
        const orders: Order[] = data.orders || [];
        // Group sales by date (YYYY-MM-DD)
        const salesByDate: Record<string, number> = {};
        orders.forEach((order) => {
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
              borderColor: '#222',
              backgroundColor: 'rgba(100,100,100,0.05)',
              tension: 0.4,
              fill: true,
            },
          ],
        });
      } catch (e) {
        console.error(e)
        setChartData(null);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="shadow-lg border border-gray-200 bg-white my-8 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="font-bold text-xl text-gray-900 tracking-wide">Sales Overview</div>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="h-24 flex items-center justify-center text-gray-400 animate-pulse">Loading chart...</div>
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
                y: { grid: { color: '#e5e7eb' }, beginAtZero: true },
              },
            }}
          />
        ) : (
          <div className="h-24 flex items-center justify-center text-gray-400">No data</div>
        )}
      </div>
    </div>
  );
} 