import { NextResponse } from 'next/server';
import { usersDB } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');
  
  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  const normalizedAddress = address.toLowerCase();
  const user = usersDB.get(normalizedAddress) || {
    address: normalizedAddress,
    name: '',
    bio: '',
    joinedAt: Date.now(),
    updatedAt: Date.now(),
  };

  return NextResponse.json(user);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, name, bio } = body;

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const normalizedAddress = address.toLowerCase();
    const existingUser = usersDB.get(normalizedAddress);

    const updatedUser = {
      address: normalizedAddress,
      name: name || '',
      bio: bio || '',
      joinedAt: existingUser ? existingUser.joinedAt : Date.now(),
      updatedAt: Date.now(),
    };

    usersDB.set(normalizedAddress, updatedUser);

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
