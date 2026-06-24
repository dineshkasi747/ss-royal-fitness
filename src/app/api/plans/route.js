import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

function isAuthenticated(request) {
  const sessionCookie = request.cookies.get('admin_session');
  return sessionCookie && sessionCookie.value === 'authenticated';
}

const defaultPlans = [
  { id: '1_month', name: '1 Month Plan', price: 800 },
  { id: '3_months', name: '3 Months Plan', price: 2100 },
  { id: '6_months', name: '6 Months Plan', price: 3500 },
  { id: '1_year', name: '1 Year Plan', price: 6000 }
];

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const plansCol = db.collection('plans');

    let plans = await plansCol.find({}).toArray();

    if (plans.length === 0) {
      // Seed default plans if collection is empty
      // Note: We use insertMany. We clone plans first to avoid mutating defaultPlans ids.
      const seedData = defaultPlans.map(p => ({ ...p }));
      await plansCol.insertMany(seedData);
      plans = seedData;
    }

    return NextResponse.json({ success: true, plans });
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
    const plansCol = db.collection('plans');

    const { id, price } = await request.json();
    if (!id || price === undefined) {
      return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
    }

    await plansCol.updateOne(
      { id },
      { $set: { price: Number(price) } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Plan price updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
