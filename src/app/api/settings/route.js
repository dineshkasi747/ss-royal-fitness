import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

function isAuthenticated(request) {
  const sessionCookie = request.cookies.get('admin_session');
  return sessionCookie && sessionCookie.value === 'authenticated';
}

const defaultUpi = {
  id: 'upi_config',
  upiId: '8309514957@ybl',
  payeeName: 'krishna chowdary'
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const settingsCol = db.collection('settings');

    let config = await settingsCol.findOne({ id: 'upi_config' });
    if (!config) {
      const seedConfig = { ...defaultUpi };
      await settingsCol.insertOne(seedConfig);
      config = seedConfig;
    }

    return NextResponse.json({ success: true, settings: config });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const settingsCol = db.collection('settings');

    const { upiId, payeeName } = await request.json();
    if (!upiId || !payeeName) {
      return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
    }

    await settingsCol.updateOne(
      { id: 'upi_config' },
      { $set: { upiId, payeeName } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'UPI settings updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
