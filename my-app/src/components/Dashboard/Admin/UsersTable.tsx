import React from 'react';

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  provider?: string;
}

export default function UsersTable() {
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
      <div className="font-bold text-lg text-black mb-4">Users</div>
      <div className="text-gray-400">User management UI will appear here.</div>
    </div>
  );
} 