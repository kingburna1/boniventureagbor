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
    let profile = await prisma.personalProfile.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (!profile) {
      profile = await prisma.personalProfile.create({
        data: {
          name: PERSONAL_DATA.name,
          title: PERSONAL_DATA.title,
          bio: PERSONAL_DATA.bio,
          avatarUrl: PERSONAL_DATA.avatarUrl,
          availability: PERSONAL_DATA.availability,
          location: PERSONAL_DATA.location,
          email: PERSONAL_DATA.email,
          resumeUrl: PERSONAL_DATA.resumeUrl,
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

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error('❌ Failed to fetch profile:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const existing = await prisma.personalProfile.findFirst();

    let updated;
    if (existing) {
      updated = await prisma.personalProfile.update({
        where: { id: existing.id },
        data: {
          name: body.name,
          title: body.title,
          bio: body.bio,
          avatarUrl: body.avatarUrl,
          availability: body.availability,
          location: body.location,
          email: body.email,
          resumeUrl: body.resumeUrl,
          leadParagraph: body.leadParagraph,
          bodyParagraph: body.bodyParagraph,
          highlights: Array.isArray(body.highlights) ? body.highlights : [],
          githubUrl: body.githubUrl,
          linkedinUrl: body.linkedinUrl,
          twitterUrl: body.twitterUrl,
          figmaUrl: body.figmaUrl,
        },
      });
    } else {
      updated = await prisma.personalProfile.create({
        data: {
          name: body.name || PERSONAL_DATA.name,
          title: body.title || PERSONAL_DATA.title,
          bio: body.bio || PERSONAL_DATA.bio,
          avatarUrl: body.avatarUrl || PERSONAL_DATA.avatarUrl,
          availability: body.availability || PERSONAL_DATA.availability,
          location: body.location || PERSONAL_DATA.location,
          email: body.email || PERSONAL_DATA.email,
          resumeUrl: body.resumeUrl || PERSONAL_DATA.resumeUrl,
          leadParagraph: body.leadParagraph || PERSONAL_DATA.aboutMe.leadParagraph,
          bodyParagraph: body.bodyParagraph || PERSONAL_DATA.aboutMe.bodyParagraph,
          highlights: Array.isArray(body.highlights) ? body.highlights : PERSONAL_DATA.aboutMe.highlights,
          githubUrl: body.githubUrl || PERSONAL_DATA.socials.github,
          linkedinUrl: body.linkedinUrl || PERSONAL_DATA.socials.linkedin,
          twitterUrl: body.twitterUrl || PERSONAL_DATA.socials.twitter,
          figmaUrl: body.figmaUrl || PERSONAL_DATA.socials.figma,
        },
      });
    }

    return NextResponse.json({ success: true, data: updated, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('❌ Failed to update profile:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
