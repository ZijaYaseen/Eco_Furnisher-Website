import Image from 'next/image';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  provider?: string;
  image?: string;
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [role, setRole] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await fetch('/api/dashboard/users');
        const data = await res.json();
        setUsers(data.users || []);
      } catch (_e) {
        setError('Failed to fetch users');
      }
      setLoading(false);
    }
    fetchUsers();
  }, [editId, success]);

  async function handleUpdate(user: User) {
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/dashboard/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: user._id,
          role: role || user.role,
        }),
      });
      if (!res.ok) throw new Error('Failed to update user');
      setEditId(null);
      setRole('');
      setSuccess('User role updated successfully!');
    } catch (_e) {
      setError('Failed to update user');
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
      <div className="font-bold text-lg text-gray-900 mb-4">Users</div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {loading ? (
        <div className="text-gray-400 animate-pulse">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm border-b border-gray-100">
                <th className="py-2 px-4 font-semibold">Image</th>
                <th className="py-2 px-4 font-semibold">Name</th>
                <th className="py-2 px-4 font-semibold">Email</th>
                <th className="py-2 px-4 font-semibold">Role</th>
                <th className="py-2 px-4 font-semibold">Provider</th>
                <th className="py-2 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-2 px-4">
                    {u.image ? (
                      <Image width={300} height={300} src={u.image} alt={u.fullName} className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm">
                        {u.fullName ? u.fullName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : '?'}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4 font-medium text-gray-900">{u.fullName}</td>
                  <td className="py-2 px-4 text-gray-700">{u.email}</td>
                  <td className="py-2 px-4">
                    {editId === u._id ? (
                      <select value={role || u.role} onChange={e => setRole(e.target.value)} className="border rounded px-2 py-1">
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                      </select>
                    ) : (
                      <span className="capitalize font-medium text-gray-900">{u.role}</span>
                    )}
                  </td>
                  <td className="py-2 px-4 text-gray-700">{u.provider || '-'}</td>
                  <td className="py-2 px-4">
                    {editId === u._id ? (
                      <>
                        <button className="bg-gray-900 text-white px-3 py-1 rounded mr-2 hover:bg-gray-700" onClick={() => handleUpdate(u)}>Save</button>
                        <button className="bg-gray-200 px-3 py-1 rounded" onClick={() => setEditId(null)}>Cancel</button>
                      </>
                    ) : (
                      <button className="bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-700" onClick={() => setEditId(u._id)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 