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
    const stats = await prisma.stat.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(
      { success: true, data: stats },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('❌ Failed to fetch stats:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { label, value, order } = body;

    if (!label || !value) {
      return NextResponse.json({ success: false, error: 'Label and value are required.' }, { status: 400 });
    }

    const stat = await prisma.stat.create({
      data: {
        label: label.trim(),
        value: value.trim(),
        order: typeof order === 'number' ? order : 0,
      },
    });

    try {
      revalidatePath('/', 'page');
      revalidatePath('/', 'layout');
      revalidatePath('/admin');
    } catch (e) {}

    return NextResponse.json({ success: true, data: stat, message: 'Stat created successfully' }, { status: 201 });
  } catch (error) {
    console.error('❌ Failed to create stat:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, label, value, order } = body;

    if (!id || !label || !value) {
      return NextResponse.json({ success: false, error: 'ID, label, and value are required.' }, { status: 400 });
    }

    const updated = await prisma.stat.update({
      where: { id },
      data: {
        label: label.trim(),
        value: value.trim(),
        order: typeof order === 'number' ? order : 0,
      },
    });

    try {
      revalidatePath('/', 'page');
      revalidatePath('/', 'layout');
      revalidatePath('/admin');
    } catch (e) {}

    return NextResponse.json({ success: true, data: updated, message: 'Stat updated successfully' });
  } catch (error) {
    console.error('❌ Failed to update stat:', error);
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
      return NextResponse.json({ success: false, error: 'Stat ID is required.' }, { status: 400 });
    }

    await prisma.stat.delete({
      where: { id },
    });

    try {
      revalidatePath('/', 'page');
      revalidatePath('/', 'layout');
      revalidatePath('/admin');
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'Stat deleted successfully' });
  } catch (error) {
    console.error('❌ Failed to delete stat:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
