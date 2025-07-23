import Image from 'next/image';
import { useEffect, useState } from 'react';

// Define all types at the top for clarity
export interface ShippingDetails {
  firstName?: string;
  lastName?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  email?: string;
}

export interface Order {
  _id: string;
  createdAt: string;
  orderStatus: string;
  trackingStatus: string;
  trackingNumber?: string;
  orderTotal: number;
  shippingCost: number;
  taxAmount: number;
  paymentMethod: string;
  orderItems: Array<{
    product: { _id: string; productNameEn: string; productImageSet: string[] };
    variants: Array<{ vid: string; quantity: number; subtotal: number; variantImage?: string }>;
    Total: number;
  }>;
  user?: { _id: string; fullName: string; email: string; image?: string };
  paymentDetails?: { transactionId?: string };
  shippingDetails?: ShippingDetails;
}

const TABS = [
  { label: 'Paid Orders', value: 'paid' },
  { label: 'Pending Orders', value: 'pending' },
];

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [tracking, setTracking] = useState('');
  const [activeTab, setActiveTab] = useState<'paid' | 'pending'>('paid');

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const res = await fetch('/api/dashboard/orders');
        const data = await res.json();
        setOrders(data.orders || []);
      } catch {
        setError('Failed to fetch orders');
      }
      setLoading(false);
    }
    fetchOrders();
  }, [editId, success]);

  async function handleUpdate(order: Order) {
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/dashboard/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: order._id,
          orderStatus: order.orderStatus, // don't update orderStatus here
          trackingStatus: status !== '' ? status : order.trackingStatus,
          trackingNumber: tracking !== '' ? tracking : order.trackingNumber,
        }),
      });
      if (!res.ok) throw new Error('Failed to update order');
      setEditId(null);
      setStatus('');
      setTracking('');
      setSuccess('Order updated successfully!');
    } catch (e) {
      console.error(e)
      setError('Failed to update order');
    }
  }

  // Filter orders by tab
  const filteredOrders = orders.filter(o =>
    activeTab === 'paid' ? o.orderStatus?.toLowerCase() === 'paid' : o.orderStatus?.toLowerCase() === 'pending'
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 overflow-x-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="font-bold text-xl text-gray-900">Orders</div>
        <div className="flex gap-2">
          {TABS.map(tab => (
            <button
              key={tab.value}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border
                ${activeTab === tab.value
                  ? 'bg-gray-900 text-white border-gray-900 shadow'
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}
              onClick={() => setActiveTab(tab.value as 'paid' | 'pending')}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {loading ? (
        <div className="text-gray-400 animate-pulse">Loading...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-gray-500 text-center py-10">No {activeTab === 'paid' ? 'paid' : 'pending'} orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-4 font-semibold min-w-[120px] w-[140px]">Order ID{/* last 6 chars of Sanity _id */}</th>
                <th className="py-3 px-4 font-semibold min-w-[120px] w-[140px]">Date</th>
                <th className="py-3 px-4 font-semibold min-w-[180px] w-[220px]">User</th>
                <th className="py-3 px-4 font-semibold min-w-[320px] w-[400px]">Products</th>
                <th className="py-3 px-4 font-semibold min-w-[120px] w-[140px]">Total</th>
                <th className="py-3 px-4 font-semibold min-w-[120px] w-[140px]">Status</th>
                <th className="py-3 px-4 font-semibold min-w-[140px] w-[180px]">Tracking #</th>
                <th className="py-3 px-4 font-semibold min-w-[140px] w-[180px]">Tracking Status</th>
                <th className="py-3 px-4 font-semibold min-w-[120px] w-[140px]">Payment</th>
                <th className="py-3 px-4 font-semibold min-w-[180px] w-[220px]">Transaction ID</th>
                <th className="py-3 px-4 font-semibold min-w-[260px] w-[340px]">Shipping Details</th>
                <th className="py-3 px-4 font-semibold min-w-[120px] w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o, idx) => {
                const isLast = idx === filteredOrders.length - 1;
                const borderClass = isLast ? '' : 'border-b border-gray-200';
                return (
                  <tr key={o._id} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className={`py-3 px-4 font-mono text-xs text-gray-900 align-top min-w-[120px] w-[140px] ${borderClass}`}>{o._id}</td>
                    <td className={`py-3 px-4 text-gray-700 align-top min-w-[120px] w-[140px] ${borderClass}`}>{o.createdAt?.slice(0, 10)}</td>
                    <td className={`py-3 px-4 align-top min-w-[180px] w-[220px] ${borderClass}`}>
                      <div className="flex items-center gap-3">
                        {o.user?.image ? (
                          <Image width={300} height={300} src={o.user.image} alt={o.user.fullName} className="w-10 h-10 object-cover border border-gray-200" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-base">
                            {o.user?.fullName ? o.user.fullName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : '?'}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{o.user?.fullName || '-'}</div>
                          <div className="text-xs text-gray-500">{o.user?.email || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className={`py-3 px-4 align-top min-w-[320px] w-[400px] ${borderClass}`}>
                      <div className="flex flex-col gap-3">
                        {o.orderItems?.map((item, idx2) => (
                          <div key={idx2} className="flex items-center gap-3 p-3 bg-white border border-gray-100 w-full">
                            {item.product?.productImageSet?.[0] && (
                              <Image width={300} height={300} src={item.product.productImageSet[0]} alt={item.product.productNameEn} className="w-12 h-12 object-cover border border-gray-200" />
                            )}
                            <div>
                              <div className="text-gray-900 font-semibold text-base">{item.product?.productNameEn}</div>
                              <div className="text-xs text-gray-500">Qty: {item.variants?.[0]?.quantity || 1}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className={`py-3 px-4 text-gray-900 font-semibold align-top min-w-[120px] w-[140px] ${borderClass}`}>{typeof o.orderTotal === 'number' ? `$${o.orderTotal.toFixed(2)}` : '-'}</td>
                    <td className={`py-3 px-4 align-top min-w-[120px] w-[140px] ${borderClass}`}>
                      <span className={`capitalize font-semibold px-2 py-1 rounded inline-block text-xs
                        ${o.orderStatus.toLowerCase() === 'paid' ? 'bg-gray-900 text-white' : 'bg-gray-300 text-gray-700'}`}
                      >
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-gray-700 align-top min-w-[140px] w-[180px] ${borderClass}`}>
                      {editId === o._id ? (
                        <input value={tracking !== '' ? tracking : o.trackingNumber || ''} onChange={e => setTracking(e.target.value)} className="border rounded px-2 py-1" />
                      ) : (
                        <span>{o.trackingNumber || '-'}</span>
                      )}
                    </td>
                    <td className={`py-3 px-4 align-top min-w-[140px] w-[180px] ${borderClass}`}>
                      {editId === o._id ? (
                        <select
                          value={status !== '' ? status : o.trackingStatus || 'Pending'}
                          onChange={e => setStatus(e.target.value)}
                          className="border rounded px-2 py-1 capitalize"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span className={`capitalize font-semibold px-2 py-1 rounded inline-block text-xs
                          ${o.trackingStatus?.toLowerCase() === 'delivered' ? 'bg-gray-900 text-white' : o.trackingStatus?.toLowerCase() === 'shipped' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                        >
                          {o.trackingStatus || '-'}
                        </span>
                      )}
                    </td>
                    <td className={`py-3 px-4 text-gray-700 align-top min-w-[120px] w-[140px] ${borderClass}`}>{o.paymentMethod}</td>
                    <td className={`py-3 px-4 text-gray-700 align-top min-w-[180px] w-[220px] ${borderClass}`}>{o.paymentDetails?.transactionId || '-'}</td>
                    <td className={`py-3 px-4 text-gray-700 align-top min-w-[260px] w-[340px] ${borderClass}`}>
                      {o.shippingDetails ? (
                        <div className="text-xs space-y-1">
                          <div><span className="font-semibold">Name:</span> {o.shippingDetails.firstName || '-'} {o.shippingDetails.lastName || ''}</div>
                          <div><span className="font-semibold">Phone:</span> {o.shippingDetails.phone || '-'}</div>
                          <div><span className="font-semibold">Email:</span> {o.shippingDetails.email || '-'}</div>
                          <div><span className="font-semibold">Street:</span> {o.shippingDetails.streetAddress || '-'}</div>
                          <div><span className="font-semibold">City:</span> {o.shippingDetails.city || '-'}</div>
                          <div><span className="font-semibold">State:</span> {o.shippingDetails.state || '-'}</div>
                          <div><span className="font-semibold">ZIP:</span> {o.shippingDetails.zip || '-'}</div>
                          <div><span className="font-semibold">Country:</span> {o.shippingDetails.country || '-'}</div>
                        </div>
                      ) : '-'}
                    </td>
                    <td className={`py-3 px-4 align-top min-w-[120px] w-[140px] ${borderClass}`}>
                      {editId === o._id ? (
                        <>
                          <button className="bg-gray-900 text-white px-3 py-1 rounded mr-2 hover:bg-gray-700" onClick={() => handleUpdate(o)}>Save</button>
                          <button className="bg-gray-200 px-3 py-1 rounded" onClick={() => { setEditId(null); setStatus(''); setTracking(''); }}>Cancel</button>
                        </>
                      ) : (
                        <button className="bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-700" onClick={() => { setEditId(o._id); setStatus(o.trackingStatus || ''); setTracking(o.trackingNumber || ''); }}>Edit</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 