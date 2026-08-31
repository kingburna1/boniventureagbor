export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const categories = await prisma.skillCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        skills: {
          orderBy: { order: 'asc' },
        },
      },
    });
    return NextResponse.json(
      { success: true, data: categories },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('❌ Failed to fetch skills:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type } = body;

    if (type === 'category') {
      const { title, description, order } = body;
      if (!title || !description) {
        return NextResponse.json({ success: false, error: 'Title and description are required.' }, { status: 400 });
      }

      const id = body.id ? slugify(body.id) : slugify(title);
      const category = await prisma.skillCategory.create({
        data: {
          id,
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

      return NextResponse.json({ success: true, data: category, message: 'Skill category created successfully' }, { status: 201 });
    }

    // Creating a Skill inside a Category
    const { categoryId, name, level, order } = body;
    if (!categoryId || !name) {
      return NextResponse.json({ success: false, error: 'Category ID and skill name are required.' }, { status: 400 });
    }

    const skill = await prisma.skill.create({
      data: {
        categoryId,
        name: name.trim(),
        level: level || 'Hands-on',
        order: typeof order === 'number' ? order : 0,
      },
    });

    try {
      revalidatePath('/', 'page');
      revalidatePath('/', 'layout');
      revalidatePath('/admin');
    } catch (e) {}

    return NextResponse.json({ success: true, data: skill, message: 'Skill added successfully' }, { status: 201 });
  } catch (error) {
    console.error('❌ Failed to create skill/category:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type } = body;

    if (type === 'category') {
      const { id, title, description, order } = body;
      if (!id || !title || !description) {
        return NextResponse.json({ success: false, error: 'ID, title, and description are required.' }, { status: 400 });
      }

      const updatedCategory = await prisma.skillCategory.update({
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

      return NextResponse.json({ success: true, data: updatedCategory, message: 'Skill category updated successfully' });
    }

    // Updating a Skill
    const { id, name, level, categoryId, order } = body;
    if (!id || !name) {
      return NextResponse.json({ success: false, error: 'ID and skill name are required.' }, { status: 400 });
    }

    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: {
        name: name.trim(),
        level: level || 'Hands-on',
        categoryId: categoryId || undefined,
        order: typeof order === 'number' ? order : 0,
      },
    });

    try {
      revalidatePath('/', 'page');
      revalidatePath('/', 'layout');
      revalidatePath('/admin');
    } catch (e) {}

    return NextResponse.json({ success: true, data: updatedSkill, message: 'Skill updated successfully' });
  } catch (error) {
    console.error('❌ Failed to update skill/category:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'skill';
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required.' }, { status: 400 });
    }

    if (type === 'category') {
      await prisma.skillCategory.delete({
        where: { id },
      });

      try {
        revalidatePath('/', 'page');
        revalidatePath('/', 'layout');
        revalidatePath('/admin');
      } catch (e) {}

      return NextResponse.json({ success: true, message: 'Category and its skills deleted successfully' });
    }

    await prisma.skill.delete({
      where: { id },
    });

    try {
      revalidatePath('/', 'page');
      revalidatePath('/', 'layout');
      revalidatePath('/admin');
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('❌ Failed to delete skill/category:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
