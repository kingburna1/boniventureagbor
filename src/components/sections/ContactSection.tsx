'use client';

import React from 'react';
import { Mail, MapPin, Globe } from 'lucide-react';
import { PERSONAL_DATA } from '@/data/personalData';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { ContactForm } from '@/components/features/contact/ContactForm';
import { CopyEmailButton } from '@/components/features/contact/CopyEmailButton';
import { SocialLinks } from '@/components/layout/SocialLinks';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-24 px-4 md:px-8 border-t border-surface-border bg-surface/20">
      <div className="max-w-6xl mx-auto space-y-12">
        <SectionHeader
          badgeText="Let's Connect"
          title="Start a Conversation"
          subtitle="Interested in building something exceptional together? Send a message or copy my email below."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Direct Info & Copy Button */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Contact Information</h3>
                <p className="text-sm text-foreground/70 mt-1">
                  Open for full-time senior engineering opportunities, contract architecture, and UX consulting.
                </p>
              </div>

              <div className="space-y-4 text-sm text-foreground/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-foreground/50">Direct Email</p>
                    <p className="font-medium text-foreground">{PERSONAL_DATA.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-foreground/50">Location</p>
                    <p className="font-medium text-foreground">{PERSONAL_DATA.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-foreground/50">Availability</p>
                    <p className="font-medium text-foreground">{PERSONAL_DATA.availability}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-border space-y-4">
                <CopyEmailButton email={PERSONAL_DATA.email} />
                <div className="pt-2">
                  <p className="text-xs font-mono text-foreground/50 mb-2">Connect on Socials</p>
                  <SocialLinks socials={PERSONAL_DATA.socials} />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <h3 className="text-xl font-bold text-foreground mb-6">Send Me a Message</h3>
              <ContactForm />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
