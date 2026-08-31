export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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

    return NextResponse.json(
      { success: true, data: profile },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
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
    const existing = await prisma.personalProfile.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    let updated;
    if (existing) {
      updated = await prisma.personalProfile.update({
        where: { id: existing.id },
        data: {
          name: body.name !== undefined ? String(body.name).trim() : existing.name,
          title: body.title !== undefined ? String(body.title).trim() : existing.title,
          bio: body.bio !== undefined ? String(body.bio).trim() : existing.bio,
          avatarUrl: body.avatarUrl !== undefined ? String(body.avatarUrl).trim() : existing.avatarUrl,
          availability: body.availability !== undefined ? String(body.availability).trim() : existing.availability,
          location: body.location !== undefined ? String(body.location).trim() : existing.location,
          email: body.email !== undefined ? String(body.email).trim() : existing.email,
          resumeUrl: body.resumeUrl !== undefined ? String(body.resumeUrl).trim() : existing.resumeUrl,
          leadParagraph: body.leadParagraph !== undefined ? String(body.leadParagraph).trim() : existing.leadParagraph,
          bodyParagraph: body.bodyParagraph !== undefined ? String(body.bodyParagraph).trim() : existing.bodyParagraph,
          highlights: Array.isArray(body.highlights) ? body.highlights : existing.highlights,
          githubUrl: body.githubUrl !== undefined ? String(body.githubUrl).trim() : existing.githubUrl,
          linkedinUrl: body.linkedinUrl !== undefined ? String(body.linkedinUrl).trim() : existing.linkedinUrl,
          twitterUrl: body.twitterUrl !== undefined ? String(body.twitterUrl).trim() : existing.twitterUrl,
          figmaUrl: body.figmaUrl !== undefined ? String(body.figmaUrl).trim() : existing.figmaUrl,
        },
      });
    } else {
      updated = await prisma.personalProfile.create({
        data: {
          name: body.name ? String(body.name).trim() : PERSONAL_DATA.name,
          title: body.title ? String(body.title).trim() : PERSONAL_DATA.title,
          bio: body.bio ? String(body.bio).trim() : PERSONAL_DATA.bio,
          avatarUrl: body.avatarUrl ? String(body.avatarUrl).trim() : PERSONAL_DATA.avatarUrl,
          availability: body.availability ? String(body.availability).trim() : PERSONAL_DATA.availability,
          location: body.location ? String(body.location).trim() : PERSONAL_DATA.location,
          email: body.email ? String(body.email).trim() : PERSONAL_DATA.email,
          resumeUrl: body.resumeUrl ? String(body.resumeUrl).trim() : PERSONAL_DATA.resumeUrl,
          leadParagraph: body.leadParagraph ? String(body.leadParagraph).trim() : PERSONAL_DATA.aboutMe.leadParagraph,
          bodyParagraph: body.bodyParagraph ? String(body.bodyParagraph).trim() : PERSONAL_DATA.aboutMe.bodyParagraph,
          highlights: Array.isArray(body.highlights) ? body.highlights : PERSONAL_DATA.aboutMe.highlights,
          githubUrl: body.githubUrl ? String(body.githubUrl).trim() : PERSONAL_DATA.socials.github,
          linkedinUrl: body.linkedinUrl ? String(body.linkedinUrl).trim() : PERSONAL_DATA.socials.linkedin,
          twitterUrl: body.twitterUrl ? String(body.twitterUrl).trim() : PERSONAL_DATA.socials.twitter,
          figmaUrl: body.figmaUrl ? String(body.figmaUrl).trim() : PERSONAL_DATA.socials.figma,
        },
      });
    }

    try {
      revalidatePath('/', 'page');
      revalidatePath('/', 'layout');
      revalidatePath('/admin');
    } catch (e) {
      // Ignore cache revalidation errors if called in non-render context
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('❌ Failed to update profile:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
