export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
      include: { caseStudy: true },
    });
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('❌ Failed to fetch projects:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      tagline,
      category,
      imageUrl,
      impactMetric,
      tags,
      demoUrl,
      githubUrl,
      featured,
      order,
      caseStudy,
    } = body;

    if (!title || !tagline || !imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Title, tagline, and image URL are required.' },
        { status: 400 }
      );
    }

    const baseSlug = body.slug ? slugify(body.slug) : slugify(title);
    const existingSlug = await prisma.project.findUnique({ where: { slug: baseSlug } });
    const finalSlug = existingSlug ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;
    const finalId = finalSlug;

    const createdProject = await prisma.project.create({
      data: {
        id: finalId,
        slug: finalSlug,
        title: title.trim(),
        tagline: tagline.trim(),
        category: category || 'fullstack',
        imageUrl: imageUrl.trim(),
        impactMetric: impactMetric?.trim() || '🚀 Production Ready',
        tags: Array.isArray(tags) ? tags : [],
        demoUrl: demoUrl?.trim() || null,
        githubUrl: githubUrl?.trim() || null,
        featured: featured !== undefined ? Boolean(featured) : true,
        order: typeof order === 'number' ? order : 0,
      },
    });

    if (caseStudy) {
      await prisma.caseStudy.create({
        data: {
          projectId: createdProject.id,
          overview: caseStudy.overview || tagline,
          problem: caseStudy.problem || '',
          solution: caseStudy.solution || '',
          architecture: Array.isArray(caseStudy.architecture) ? caseStudy.architecture : [],
          keyResults: Array.isArray(caseStudy.keyResults) ? caseStudy.keyResults : [],
          technologies: Array.isArray(caseStudy.technologies) ? caseStudy.technologies : Array.isArray(tags) ? tags : [],
          liveUrl: caseStudy.liveUrl || demoUrl || null,
          githubUrl: caseStudy.githubUrl || githubUrl || null,
        },
      });
    }

    const fullProject = await prisma.project.findUnique({
      where: { id: createdProject.id },
      include: { caseStudy: true },
    });

    return NextResponse.json({ success: true, data: fullProject, message: 'Project created successfully' }, { status: 201 });
  } catch (error) {
    console.error('❌ Failed to create project:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      id,
      title,
      tagline,
      category,
      imageUrl,
      impactMetric,
      tags,
      demoUrl,
      githubUrl,
      featured,
      order,
      caseStudy,
    } = body;

    if (!id || !title || !tagline) {
      return NextResponse.json({ success: false, error: 'ID, title, and tagline are required.' }, { status: 400 });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title: title.trim(),
        tagline: tagline.trim(),
        category: category || 'fullstack',
        imageUrl: imageUrl?.trim() || '',
        impactMetric: impactMetric?.trim() || '',
        tags: Array.isArray(tags) ? tags : [],
        demoUrl: demoUrl?.trim() || null,
        githubUrl: githubUrl?.trim() || null,
        featured: featured !== undefined ? Boolean(featured) : true,
        order: typeof order === 'number' ? order : 0,
      },
    });

    if (caseStudy) {
      await prisma.caseStudy.upsert({
        where: { projectId: id },
        update: {
          overview: caseStudy.overview || tagline,
          problem: caseStudy.problem || '',
          solution: caseStudy.solution || '',
          architecture: Array.isArray(caseStudy.architecture) ? caseStudy.architecture : [],
          keyResults: Array.isArray(caseStudy.keyResults) ? caseStudy.keyResults : [],
          technologies: Array.isArray(caseStudy.technologies) ? caseStudy.technologies : Array.isArray(tags) ? tags : [],
          liveUrl: caseStudy.liveUrl || demoUrl || null,
          githubUrl: caseStudy.githubUrl || githubUrl || null,
        },
        create: {
          projectId: id,
          overview: caseStudy.overview || tagline,
          problem: caseStudy.problem || '',
          solution: caseStudy.solution || '',
          architecture: Array.isArray(caseStudy.architecture) ? caseStudy.architecture : [],
          keyResults: Array.isArray(caseStudy.keyResults) ? caseStudy.keyResults : [],
          technologies: Array.isArray(caseStudy.technologies) ? caseStudy.technologies : Array.isArray(tags) ? tags : [],
          liveUrl: caseStudy.liveUrl || demoUrl || null,
          githubUrl: caseStudy.githubUrl || githubUrl || null,
        },
      });
    }

    const fullProject = await prisma.project.findUnique({
      where: { id },
      include: { caseStudy: true },
    });

    return NextResponse.json({ success: true, data: fullProject, message: 'Project updated successfully' });
  } catch (error) {
    console.error('❌ Failed to update project:', error);
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
      return NextResponse.json({ success: false, error: 'Project ID is required.' }, { status: 400 });
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Project and case study deleted successfully' });
  } catch (error) {
    console.error('❌ Failed to delete project:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
