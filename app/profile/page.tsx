'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Navbar } from '@/components/Navbar';

export default function ProfilePage() {
  const { address } = useAccount();
  const [userData, setUserData] = useState({ name: '', bio: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (address) {
      fetch(`/api/user?address=${address}`)
        .then(res => res.json())
        .then(data => {
          setUserData({ name: data.name || '', bio: data.bio || '' });
          setLoading(false);
        });
    }
  }, [address]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, ...userData }),
    });
    alert('Profile updated!');
  };

  if (!address) return <div className="p-8 text-white">Please connect your wallet.</div>;
  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <p className="mb-4">Wallet: {address}</p>
      <form onSubmit={handleSave} className="space-y-4">
        <input
          value={userData.name}
          onChange={e => setUserData({ ...userData, name: e.target.value })}
          placeholder="Name"
          className="w-full p-2 bg-zinc-800 rounded"
        />
        <textarea
          value={userData.bio}
          onChange={e => setUserData({ ...userData, bio: e.target.value })}
          placeholder="Bio"
          className="w-full p-2 bg-zinc-800 rounded"
        />
        <button type="submit" className="bg-indigo-600 px-4 py-2 rounded">Save Changes</button>
      </form>
    </div>
  );
}
