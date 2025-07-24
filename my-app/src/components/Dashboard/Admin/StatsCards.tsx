"use client"
import { useEffect, useState, useRef } from 'react';
import { FiUsers, FiShoppingCart, FiDollarSign, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';

export type DashboardPeriod = 'today' | 'week' | 'month' | 'year' | 'total';

export interface DashboardStatsResponse {
  users: number;
  orders: number;
  revenue: number;
  expenses: number;
  profit: number;
  percentageChange: {
    users: number;
    orders: number;
    revenue: number;
    expenses: number;
    profit: number;
  };
}

const timePeriods: { label: string; value: DashboardPeriod }[] = [
  { label: 'Total', value: 'total' },
  { label: 'This Year', value: 'year' },
  { label: 'This Month', value: 'month' },
  { label: 'This Week', value: 'week' },
  { label: 'Today', value: 'today' },
];

export default function StatsCards() {
  const [selectedPeriod, setSelectedPeriod] = useState<DashboardPeriod>('today');
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Cache: period -> stats
  const cache = useRef<Partial<Record<DashboardPeriod, DashboardStatsResponse>>>({});

  const fetchStats = async (period: DashboardPeriod, forceRefresh = false) => {
    setLoading(true);
    setError(null);
    // Use cache if available and not forceRefresh
    if (!forceRefresh && cache.current[period]) {
      setStats(cache.current[period]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/dashboard/stats?period=${period}`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data: DashboardStatsResponse = await res.json();
      setStats(data);
      cache.current[period] = data;
    } catch {
      setError('Failed to load stats. Please try again.');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(selectedPeriod);
    // Auto-refresh every 30s, force refresh (invalidate cache)
    const interval = setInterval(() => fetchStats(selectedPeriod, true), 30000);
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  return (
    <div className="space-y-6">
      {/* Time Period Tabs */}
      <div className="flex flex-wrap gap-2">
        {timePeriods.map((period) => (
          <button
            key={period.value}
            onClick={() => setSelectedPeriod(period.value)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border
              ${selectedPeriod === period.value
                ? 'bg-gray-900 text-white border-gray-900 shadow'
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Loading/Error State */}
      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading stats...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">
          {error}
          <button
            className="ml-4 px-3 py-1 bg-gray-900 text-white rounded"
            onClick={() => fetchStats(selectedPeriod, true)}
          >
            Retry
          </button>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {/* Users */}
          <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gray-900 shadow-md">
                  <FiUsers className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <div className={`text-xs font-semibold ${stats.percentageChange.users >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}>
                    <span>{stats.percentageChange.users}%</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900 tracking-tight">{stats.users.toLocaleString()}</div>
                <div className="text-sm font-medium text-gray-500">Customers</div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 opacity-60"></div>
            </div>
          </div>
          {/* Orders */}
          <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gray-900 shadow-md">
                  <FiShoppingCart className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <div className={`text-xs font-semibold ${stats.percentageChange.orders >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}>
                    <span>{stats.percentageChange.orders}%</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900 tracking-tight">{stats.orders.toLocaleString()}</div>
                <div className="text-sm font-medium text-gray-500">Orders</div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 opacity-60"></div>
            </div>
          </div>
          {/* Revenue */}
          <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gray-900 shadow-md">
                  <FiDollarSign className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <div className={`text-xs font-semibold ${stats.percentageChange.revenue >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}>
                    <span>{stats.percentageChange.revenue}%</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900 tracking-tight">${stats.revenue.toLocaleString()}</div>
                <div className="text-sm font-medium text-gray-500">Revenue</div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 opacity-60"></div>
            </div>
          </div>
          {/* Expenses */}
          <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gray-900 shadow-md">
                  <FiTrendingUp className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <div className={`text-xs font-semibold ${stats.percentageChange.expenses >= 0 ? 'text-red-500' : 'text-green-500'} flex items-center gap-1`}>
                    <span>{stats.percentageChange.expenses}%</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900 tracking-tight">${stats.expenses.toLocaleString()}</div>
                <div className="text-sm font-medium text-gray-500">Expenses</div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 opacity-60"></div>
            </div>
          </div>
          {/* Profit */}
          <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gray-900 shadow-md">
                  <FiBarChart2 className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <div className={`text-xs font-semibold ${stats.percentageChange.profit >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}>
                    <span>{stats.percentageChange.profit}%</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900 tracking-tight">${stats.profit.toLocaleString()}</div>
                <div className="text-sm font-medium text-gray-500">Profit</div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 opacity-60"></div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
} 