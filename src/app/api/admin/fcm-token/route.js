import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

function isAuthenticated(request) {
  const sessionCookie = request.cookies.get('admin_session');
  return sessionCookie && sessionCookie.value === 'authenticated';
}

export async function POST(request) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ success: false, message: 'Token is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const tokensCol = db.collection('admin_tokens');

    await tokensCol.updateOne(
      { token },
      { $set: { token, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'FCM Token saved successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
