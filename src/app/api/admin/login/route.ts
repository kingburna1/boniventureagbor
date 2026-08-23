export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Generate secure HMAC token with 24-hour expiry
    const secret = process.env.JWT_SECRET || 'boniventure-default-secret-2026';
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    const tokenData = `${user.id}:${user.email}:${expiresAt}`;
    const signature = crypto.createHmac('sha256', secret).update(tokenData).digest('hex');
    const token = Buffer.from(`${tokenData}:${signature}`).toString('base64');

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });

    // Set HTTP-only secure cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('❌ Admin Login Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
