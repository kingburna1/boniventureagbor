export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

// Regex for standard email format verification
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // 1. Server-side validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid name (at least 2 characters).' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please provide a subject (at least 2 characters).' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please provide a message (at least 5 characters).' },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    // 2. Persist to PostgreSQL database via Prisma
    const savedMessage = await prisma.contactMessage.create({
      data: {
        senderName: cleanName,
        senderEmail: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
        status: 'UNREAD',
      },
    });

    // 3. Attempt Email Notification Dispatch (gracefully fails without blocking response)
    const adminEmail = process.env.ADMIN_EMAIL || 'agborboniventure@gmail.com';
    const appPassword = process.env.GOOGLE_APP_PASSWORD;

    if (appPassword) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: adminEmail,
            pass: appPassword,
          },
        });

        await transporter.sendMail({
          from: `"Portfolio Contact Form" <${adminEmail}>`,
          to: adminEmail,
          replyTo: cleanEmail,
          subject: `[Portfolio Inquiry] ${cleanSubject} — from ${cleanName}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <h2 style="color: #2563eb; margin-top: 0; font-size: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;">
                New Portfolio Message Received
              </h2>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 100px;"><strong>Sender:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${cleanName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 14px;"><a href="mailto:${cleanEmail}" style="color: #2563eb; text-decoration: none;">${cleanEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Subject:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${cleanSubject}</td>
                </tr>
              </table>
              <div style="margin-top: 20px; padding: 16px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${cleanMessage}</p>
              </div>
              <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; text-align: center;">
                Message ID: ${savedMessage.id} &bull; Received via Boniventure.dev Portfolio
              </p>
            </div>
          `,
        });
      } catch (mailError) {
        console.warn('⚠️ Notification email failed to send:', mailError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully! I will get back to you shortly.',
        data: { id: savedMessage.id },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while sending your message. Please try again.' },
      { status: 500 }
    );
  }
}
