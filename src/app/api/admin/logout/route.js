import { NextResponse } from 'next/server';

export async function POST(request) {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.set('admin_session', '', {
    path: '/',
    httpOnly: true,
    expires: new Date(0),
  });
  return response;
}
