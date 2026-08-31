export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const experience = await prisma.experience.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(
      { success: true, data: experience },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('❌ Failed to fetch experience:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { company, role, period, location, description, highlights, skills, isCurrent, order } = body;

    if (!company || !role || !period || !description) {
      return NextResponse.json(
        { success: false, error: 'Company, role, period, and description are required.' },
        { status: 400 }
      );
    }

    const item = await prisma.experience.create({
      data: {
        company: company.trim(),
        role: role.trim(),
        period: period.trim(),
        location: location?.trim() || '',
        description: description.trim(),
        highlights: Array.isArray(highlights) ? highlights : [],
        skills: Array.isArray(skills) ? skills : [],
        isCurrent: Boolean(isCurrent),
        order: typeof order === 'number' ? order : 0,
      },
    });

    try {
      revalidatePath('/', 'page');
      revalidatePath('/', 'layout');
      revalidatePath('/admin');
    } catch (e) {}

    return NextResponse.json({ success: true, data: item, message: 'Experience record created successfully' }, { status: 201 });
  } catch (error) {
    console.error('❌ Failed to create experience:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, company, role, period, location, description, highlights, skills, isCurrent, order } = body;

    if (!id || !company || !role || !period || !description) {
      return NextResponse.json(
        { success: false, error: 'ID, company, role, period, and description are required.' },
        { status: 400 }
      );
    }

    const updated = await prisma.experience.update({
      where: { id },
      data: {
        company: company.trim(),
        role: role.trim(),
        period: period.trim(),
        location: location?.trim() || '',
        description: description.trim(),
        highlights: Array.isArray(highlights) ? highlights : [],
        skills: Array.isArray(skills) ? skills : [],
        isCurrent: Boolean(isCurrent),
        order: typeof order === 'number' ? order : 0,
      },
    });

    try {
      revalidatePath('/', 'page');
      revalidatePath('/', 'layout');
      revalidatePath('/admin');
    } catch (e) {}

    return NextResponse.json({ success: true, data: updated, message: 'Experience record updated successfully' });
  } catch (error) {
    console.error('❌ Failed to update experience:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Experience ID is required.' }, { status: 400 });
    }

    await prisma.experience.delete({
      where: { id },
    });

    try {
      revalidatePath('/', 'page');
      revalidatePath('/', 'layout');
      revalidatePath('/admin');
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'Experience record deleted successfully' });
  } catch (error) {
    console.error('❌ Failed to delete experience:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
