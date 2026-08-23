import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/layout/Footer';
import { MouseSpotlight } from '@/components/ui/MouseSpotlight';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-accent/20">
      {/* Mouse-Following Ambient Spotlight */}
      <MouseSpotlight />

      {/* Sticky Header & Navbar */}
      <Header />

      {/* Main Single Page Sections */}
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ExperienceSection />
        <SkillsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
