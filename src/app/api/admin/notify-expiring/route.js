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

    const client = await clientPromise;
    const db = client.db();
    const subCol = db.collection('subscribers');
    const tokensCol = db.collection('admin_tokens');

    // Find active approved subscribers
    const subscribers = await subCol.find({ status: 'approved' }).toArray();
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    const expiringSubscribers = [];

    for (const sub of subscribers) {
      const endDate = new Date(sub.endDate);
      const diffTime = endDate - now;
      // Calculate ceiling days left, ensuring it fits our 3-day window
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= 3) {
        expiringSubscribers.push({
          id: sub._id.toString(),
          name: sub.name,
          phone: sub.phone,
          planId: sub.planId,
          daysLeft: diffDays,
          endDate: sub.endDate
        });
      }
    }

    if (expiringSubscribers.length === 0) {
      return NextResponse.json({ success: true, message: 'No expiring subscriptions found', expiringSubscribers: [], notificationsSent: 0 });
    }

    // Get FCM tokens
    const tokens = await tokensCol.find({}).toArray();
    const fcmTokens = tokens.map(t => t.token);

    let fcmStatus = 'FCM credentials not configured. Local browser notifications will be used.';
    let notificationsSent = 0;

    const serverKey = process.env.FCM_SERVER_KEY;
    if (serverKey && fcmTokens.length > 0) {
      try {
        for (const sub of expiringSubscribers) {
          const bodyMessage = `Subscription for ${sub.name} is ending in ${sub.daysLeft} day(s) on ${new Date(sub.endDate).toLocaleDateString()}. Contact: ${sub.phone}`;
          
          await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `key=${serverKey}`
            },
            body: JSON.stringify({
              registration_ids: fcmTokens,
              notification: {
                title: 'Subscription Expiring Soon!',
                body: bodyMessage,
                icon: '/wp-content/uploads/sites/57/2025/05/Progym-Fav-Icon.png',
                click_action: '/admin'
              }
            })
          });
          notificationsSent++;
        }
        fcmStatus = `Sent ${notificationsSent} notifications via FCM.`;
      } catch (err) {
        fcmStatus = `Failed to send FCM notifications: ${err.message}`;
      }
    }

    return NextResponse.json({
      success: true,
      expiringSubscribers,
      fcmStatus,
      notificationsSent
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
