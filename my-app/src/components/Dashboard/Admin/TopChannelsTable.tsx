export default function TopChannelsTable() {
  const channels = [
    { source: 'Google', visitors: '3.5K', revenue: '$4,220.00', sales: 3456, conversion: '2.59%' },
    { source: 'X.com', visitors: '2.1K', revenue: '$2,100.00', sales: 2100, conversion: '1.95%' },
    { source: 'Github', visitors: '1.8K', revenue: '$1,800.00', sales: 1800, conversion: '2.10%' },
    { source: 'Facebook', visitors: '1.2K', revenue: '$1,200.00', sales: 1200, conversion: '1.75%' },
  ];
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-100 overflow-x-auto">
      <div className="font-bold text-lg mb-4 text-black">Top Channels</div>
      <table className="min-w-full text-left">
        <thead>
          <tr className="text-gray-500 text-sm">
            <th className="py-2 px-4">Source</th>
            <th className="py-2 px-4">Visitors</th>
            <th className="py-2 px-4">Revenue</th>
            <th className="py-2 px-4">Sales</th>
            <th className="py-2 px-4">Conversion</th>
          </tr>
        </thead>
        <tbody>
          {channels.map((ch) => (
            <tr key={ch.source} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="py-2 px-4 font-medium text-black">{ch.source}</td>
              <td className="py-2 px-4">{ch.visitors}</td>
              <td className="py-2 px-4">{ch.revenue}</td>
              <td className="py-2 px-4">{ch.sales}</td>
              <td className="py-2 px-4">{ch.conversion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 