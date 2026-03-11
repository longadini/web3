'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

export function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'chat'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });
    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    await addDoc(collection(db, 'chat'), { text: input, timestamp: new Date() });
    setInput('');
  };

  return (
    <div className="h-64 overflow-y-auto p-4 bg-zinc-900 rounded-lg text-white">
      {messages.map((m, i) => <p key={i}>{m.text}</p>)}
      <input value={input} onChange={e => setInput(e.target.value)} className="w-full bg-zinc-800 p-2 mt-2" />
      <button onClick={sendMessage} className="bg-indigo-600 p-2 mt-2">Send</button>
    </div>
  );
}
