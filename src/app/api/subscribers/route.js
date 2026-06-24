import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

function isAuthenticated(request) {
  const sessionCookie = request.cookies.get('admin_session');
  return sessionCookie && sessionCookie.value === 'authenticated';
}

function calculateEndDate(startDateStr, planId) {
  const start = new Date(startDateStr);
  let days = 30;
  if (planId === '3_months') days = 90;
  else if (planId === '6_months') days = 180;
  else if (planId === '1_year') days = 365;

  start.setDate(start.getDate() + days);
  return start.toISOString();
}

export async function GET(request) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const subCol = db.collection('subscribers');

    const subscribers = await subCol.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, subscribers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const subCol = db.collection('subscribers');

    const body = await request.json();
    const { name, phone, planId, pricePaid, transactionId } = body;

    if (!name || !phone || !planId || !pricePaid) {
      return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
    }

    const startDate = new Date().toISOString();
    const endDate = calculateEndDate(startDate, planId);

    const newSubscriber = {
      name,
      phone,
      planId,
      pricePaid: Number(pricePaid),
      transactionId: transactionId || 'UPI_INTENT_PAY',
      startDate,
      endDate,
      status: 'pending_approval',
      createdAt: new Date().toISOString()
    };

    const result = await subCol.insertOne(newSubscriber);

    return NextResponse.json({
      success: true,
      message: 'Subscription request submitted successfully',
      subscriberId: result.insertedId
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const subCol = db.collection('subscribers');

    const { id, status, endDate } = await request.json();
    if (!id || (!status && !endDate)) {
      return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (endDate) updateFields.endDate = endDate;

    await subCol.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    return NextResponse.json({ success: true, message: 'Subscriber updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const subCol = db.collection('subscribers');

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 });
    }

    await subCol.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, message: 'Subscriber deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
