import { useEffect, useState } from 'react';

type Order = { orderTotal?: number };

export default function StatsCards() {
  const [stats, setStats] = useState([
    { label: 'Total Sales', value: '-' },
    { label: 'Orders', value: '-' },
    { label: 'Users', value: '-' },
    { label: 'Products', value: '-' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          fetch('/api/dashboard/order'),
          fetch('/api/dashboard/user'),
          fetch('/api/dashboard/product'),
        ]);
        const ordersData = await ordersRes.json();
        const usersData = await usersRes.json();
        const productsData = await productsRes.json();
        // Calculate total sales
        const totalSales = ordersData.orders?.reduce((sum: number, o: Order) => sum + (o.orderTotal || 0), 0) || 0;
        setStats([
          { label: 'Total Sales', value: `$${totalSales.toLocaleString()}` },
          { label: 'Orders', value: ordersData.orders?.length || 0 },
          { label: 'Users', value: usersData.users?.length || 0 },
          { label: 'Products', value: productsData.products?.length || 0 },
        ]);
      } catch (e) {
        setStats([
          { label: 'Total Sales', value: '-' },
          { label: 'Orders', value: '-' },
          { label: 'Users', value: '-' },
          { label: 'Products', value: '-' },
        ]);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 my-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center border border-gray-100">
          <div className="text-3xl font-bold text-black mb-2">{loading ? <span className="animate-pulse">...</span> : stat.value}</div>
          <div className="text-gray-500 font-medium text-base">{stat.label}</div>
        </div>
      ))}
    </div>
  );
} 