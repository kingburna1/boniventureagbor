import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/layout/Footer';
import { MouseSpotlight } from '@/components/ui/MouseSpotlight';
import { SceneCanvas } from '@/components/canvas/SceneCanvas';
import { SignaturePreloader } from '@/components/preloader/SignaturePreloader';
import { getProfileData, getProjectsData, getExperienceData, getSkillsData } from '@/lib/portfolio';

export const revalidate = 60; // Revalidate dynamic content every 60 seconds (ISR)

export default async function Home() {
  const [profile, projects, experience, skills] = await Promise.all([
    getProfileData(),
    getProjectsData(),
    getExperienceData(),
    getSkillsData(),
  ]);

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-accent/20">
      {/* Signature Light Preloader */}
      <SignaturePreloader />

      {/* Persistent WebGL Shader Background Canvas */}
      <SceneCanvas />

      {/* Minimal Cursor Indicator */}
      <MouseSpotlight />

      {/* Sticky Header & Navbar */}
      <Header resumeUrl={profile.resumeUrl} />

      {/* Main Single Page Sections */}
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ProjectsSection projects={projects} />
        <ExperienceSection items={experience} />
        <SkillsSection categories={skills} />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
