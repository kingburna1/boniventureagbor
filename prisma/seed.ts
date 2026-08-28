import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PERSONAL_DATA } from '../src/data/personalData';
import { PROJECTS_DATA } from '../src/data/projectsData';
import { EXPERIENCE_DATA } from '../src/data/experienceData';
import { SKILLS_DATA } from '../src/data/skillsData';

// Native .env parser
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
} catch (e) {
  console.warn('⚠️ Note: could not load .env file manually');
}

const prisma = new PrismaClient();

async function ensureTables() {
  const ddlStatements = [
    `CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT NOT NULL UNIQUE,
      "passwordHash" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "role" TEXT NOT NULL DEFAULT 'ADMIN',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "PersonalProfile" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "bio" TEXT NOT NULL,
      "avatarUrl" TEXT NOT NULL,
      "availability" TEXT NOT NULL,
      "location" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "resumeUrl" TEXT NOT NULL DEFAULT '#',
      "leadParagraph" TEXT NOT NULL,
      "bodyParagraph" TEXT NOT NULL,
      "highlights" TEXT[],
      "githubUrl" TEXT NOT NULL DEFAULT 'https://github.com',
      "linkedinUrl" TEXT NOT NULL DEFAULT 'https://linkedin.com',
      "twitterUrl" TEXT NOT NULL DEFAULT 'https://twitter.com',
      "figmaUrl" TEXT NOT NULL DEFAULT 'https://figma.com',
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "Stat" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "label" TEXT NOT NULL,
      "value" TEXT NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 0,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "Philosophy" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 0,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "Project" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "slug" TEXT NOT NULL UNIQUE,
      "title" TEXT NOT NULL,
      "tagline" TEXT NOT NULL,
      "category" TEXT NOT NULL,
      "imageUrl" TEXT NOT NULL,
      "impactMetric" TEXT NOT NULL,
      "tags" TEXT[],
      "demoUrl" TEXT,
      "githubUrl" TEXT,
      "featured" BOOLEAN NOT NULL DEFAULT true,
      "order" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "CaseStudy" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "projectId" TEXT NOT NULL UNIQUE REFERENCES "Project"("id") ON DELETE CASCADE,
      "overview" TEXT NOT NULL,
      "problem" TEXT NOT NULL,
      "solution" TEXT NOT NULL,
      "architecture" TEXT[],
      "keyResults" TEXT[],
      "technologies" TEXT[],
      "liveUrl" TEXT,
      "githubUrl" TEXT,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "Experience" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "company" TEXT NOT NULL,
      "role" TEXT NOT NULL,
      "period" TEXT NOT NULL,
      "location" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "highlights" TEXT[],
      "skills" TEXT[],
      "isCurrent" BOOLEAN NOT NULL DEFAULT false,
      "order" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "SkillCategory" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 0,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "Skill" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "categoryId" TEXT NOT NULL REFERENCES "SkillCategory"("id") ON DELETE CASCADE,
      "name" TEXT NOT NULL,
      "level" TEXT NOT NULL DEFAULT 'Hands-on',
      "order" INTEGER NOT NULL DEFAULT 0,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "ContactMessage" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "senderName" TEXT NOT NULL,
      "senderEmail" TEXT NOT NULL,
      "subject" TEXT NOT NULL,
      "message" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'UNREAD',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Project_slug_key" ON "Project"("slug")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "CaseStudy_projectId_key" ON "CaseStudy"("projectId")`,
  ];

  for (const sql of ddlStatements) {
    await prisma.$executeRawUnsafe(sql);
  }
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // Ensure tables exist in PostgreSQL
  await ensureTables();

  // 0. Clean previous data for idempotent re-seeding
  await prisma.contactMessage.deleteMany();
  await prisma.caseStudy.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.philosophy.deleteMany();
  await prisma.stat.deleteMany();
  await prisma.personalProfile.deleteMany();

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || PERSONAL_DATA.email;
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecret123!';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: PERSONAL_DATA.name },
    create: {
      email: adminEmail,
      name: PERSONAL_DATA.name,
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Seed Personal Profile
  await prisma.personalProfile.create({
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
  console.log('✅ Personal profile seeded');

  // 3. Seed Stats
  await prisma.stat.createMany({
    data: PERSONAL_DATA.stats.map((stat, i) => ({
      label: stat.label,
      value: stat.value,
      order: i,
    })),
  });
  console.log('✅ Hero stats seeded');

  // 4. Seed Philosophies
  await prisma.philosophy.createMany({
    data: PERSONAL_DATA.philosophy.map((phil, i) => ({
      title: phil.title,
      description: phil.description,
      order: i,
    })),
  });
  console.log('✅ Philosophy items seeded');

  // 5. Seed Projects & Case Studies
  for (let i = 0; i < PROJECTS_DATA.length; i++) {
    const proj = PROJECTS_DATA[i];
    const createdProject = await prisma.project.create({
      data: {
        id: proj.id,
        slug: proj.slug || proj.id,
        title: proj.title,
        tagline: proj.tagline,
        category: proj.category,
        imageUrl: proj.imageUrl,
        impactMetric: proj.impactMetric,
        tags: proj.tags,
        demoUrl: proj.demoUrl,
        githubUrl: proj.githubUrl,
        featured: proj.featured ?? true,
        order: i,
      },
    });

    if (proj.caseStudy) {
      await prisma.caseStudy.create({
        data: {
          projectId: createdProject.id,
          overview: proj.caseStudy.overview,
          problem: proj.caseStudy.problem,
          solution: proj.caseStudy.solution,
          architecture: proj.caseStudy.architecture,
          keyResults: proj.caseStudy.keyResults,
          technologies: proj.caseStudy.technologies,
          liveUrl: proj.caseStudy.liveUrl || proj.demoUrl,
          githubUrl: proj.caseStudy.githubUrl || proj.githubUrl,
        },
      });
    }
  }
  console.log('✅ Projects & Case Studies seeded');

  // 6. Seed Experience Timeline
  await prisma.experience.createMany({
    data: EXPERIENCE_DATA.map((exp, i) => ({
      company: exp.company,
      role: exp.role,
      period: exp.period,
      location: exp.location,
      description: exp.description,
      highlights: exp.highlights,
      skills: exp.skills,
      isCurrent: exp.isCurrent ?? false,
      order: i,
    })),
  });
  console.log('✅ Experience timeline seeded');

  // 7. Seed Skills Matrix
  await prisma.skillCategory.createMany({
    data: SKILLS_DATA.map((cat, i) => ({
      id: cat.id,
      title: cat.title,
      description: cat.description,
      order: i,
    })),
  });

  const allSkills = SKILLS_DATA.flatMap((cat) =>
    cat.skills.map((sk, j) => ({
      categoryId: cat.id,
      name: sk.name,
      level: sk.level || 'Hands-on',
      order: j,
    }))
  );

  await prisma.skill.createMany({
    data: allSkills,
  });
  console.log('✅ Skill Categories & Skills matrix seeded');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
