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
    const philosophy = await prisma.philosophy.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(
      { success: true, data: philosophy },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('❌ Failed to fetch philosophies:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, order } = body;

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'Title and description are required.' }, { status: 400 });
    }

    const item = await prisma.philosophy.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        order: typeof order === 'number' ? order : 0,
      },
    });

    try {
      revalidatePath('/', 'page');
      revalidatePath('/', 'layout');
      revalidatePath('/admin');
    } catch (e) {}

    return NextResponse.json({ success: true, data: item, message: 'Philosophy created successfully' }, { status: 201 });
  } catch (error) {
    console.error('❌ Failed to create philosophy:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, title, description, order } = body;

    if (!id || !title || !description) {
      return NextResponse.json({ success: false, error: 'ID, title, and description are required.' }, { status: 400 });
    }

    const updated = await prisma.philosophy.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description.trim(),
        order: typeof order === 'number' ? order : 0,
      },
    });

    try {
      revalidatePath('/', 'page');
      revalidatePath('/', 'layout');
      revalidatePath('/admin');
    } catch (e) {}

    return NextResponse.json({ success: true, data: updated, message: 'Philosophy updated successfully' });
  } catch (error) {
    console.error('❌ Failed to update philosophy:', error);
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
      return NextResponse.json({ success: false, error: 'Philosophy ID is required.' }, { status: 400 });
    }

    await prisma.philosophy.delete({
      where: { id },
    });

    try {
      revalidatePath('/', 'page');
      revalidatePath('/', 'layout');
      revalidatePath('/admin');
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'Philosophy deleted successfully' });
  } catch (error) {
    console.error('❌ Failed to delete philosophy:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
