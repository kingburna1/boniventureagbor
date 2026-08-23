import { NextRequest } from 'next/server';
import crypto from 'crypto';

export function verifyAdminToken(req: NextRequest): boolean {
  try {
    const authHeader = req.headers.get('authorization');
    const cookieToken = req.cookies.get('admin_token')?.value;
    const rawToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : cookieToken;

    if (!rawToken) return false;

    const decoded = Buffer.from(rawToken, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 4) return false;

    const [userId, userEmail, expiresAtStr, signature] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) return false;

    const secret = process.env.JWT_SECRET || 'boniventure-default-secret-2026';
    const tokenData = `${userId}:${userEmail}:${expiresAtStr}`;
    const expectedSignature = crypto.createHmac('sha256', secret).update(tokenData).digest('hex');

    return signature === expectedSignature;
  } catch {
    return false;
  }
}
