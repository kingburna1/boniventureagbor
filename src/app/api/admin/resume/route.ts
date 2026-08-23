export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';
import { PERSONAL_DATA } from '@/data/personalData';

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profile = await prisma.personalProfile.findFirst({
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        resumeUrl: true,
        name: true,
        title: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        resumeUrl: profile?.resumeUrl || PERSONAL_DATA.resumeUrl,
        lastUpdated: profile?.updatedAt,
        name: profile?.name || PERSONAL_DATA.name,
      },
    });
  } catch (error) {
    console.error('❌ Failed to fetch resume:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { resumeUrl } = body;

    if (!resumeUrl || typeof resumeUrl !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid resumeUrl is required' }, { status: 400 });
    }

    const existing = await prisma.personalProfile.findFirst();
    let updated;

    if (existing) {
      updated = await prisma.personalProfile.update({
        where: { id: existing.id },
        data: { resumeUrl: resumeUrl.trim() },
      });
    } else {
      updated = await prisma.personalProfile.create({
        data: {
          name: PERSONAL_DATA.name,
          title: PERSONAL_DATA.title,
          bio: PERSONAL_DATA.bio,
          avatarUrl: PERSONAL_DATA.avatarUrl,
          availability: PERSONAL_DATA.availability,
          location: PERSONAL_DATA.location,
          email: PERSONAL_DATA.email,
          resumeUrl: resumeUrl.trim(),
          leadParagraph: PERSONAL_DATA.aboutMe.leadParagraph,
          bodyParagraph: PERSONAL_DATA.aboutMe.bodyParagraph,
          highlights: PERSONAL_DATA.aboutMe.highlights,
          githubUrl: PERSONAL_DATA.socials.github,
          linkedinUrl: PERSONAL_DATA.socials.linkedin,
          twitterUrl: PERSONAL_DATA.socials.twitter,
          figmaUrl: PERSONAL_DATA.socials.figma,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Resume updated successfully!',
    });
  } catch (error) {
    console.error('❌ Failed to update resume:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existing = await prisma.personalProfile.findFirst();
    if (existing) {
      await prisma.personalProfile.update({
        where: { id: existing.id },
        data: { resumeUrl: '#' },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Resume link removed successfully',
    });
  } catch (error) {
    console.error('❌ Failed to delete resume link:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
