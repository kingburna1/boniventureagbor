'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, MapPin, Globe } from 'lucide-react';
import { PERSONAL_DATA } from '@/data/personalData';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { ContactForm } from '@/components/features/contact/ContactForm';
import { CopyEmailButton } from '@/components/features/contact/CopyEmailButton';
import { SocialLinks } from '@/components/layout/SocialLinks';
import { containerStagger, cardEntrance } from '@/lib/motion';
import { useTranslation } from '@/i18n/context';

import { PersonalProfileData } from '@/types/personal';

export interface ContactSectionProps {
  profile?: PersonalProfileData;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  profile = PERSONAL_DATA,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { dictionary, locale } = useTranslation();
  const isFrench = locale === 'fr';

  const email = profile?.email || PERSONAL_DATA.email;
  const location = isFrench ? dictionary.about.location : (profile?.location || dictionary.about.location);
  const availability = isFrench ? dictionary.hero.availability : (profile?.availability || dictionary.hero.availability);
  const socials = profile?.socials || PERSONAL_DATA.socials;

  return (
    <section id="contact" className="py-24 px-4 md:px-8 bg-surface/20">
      <div className="max-w-6xl mx-auto space-y-12">
        <SectionHeader
          badgeText={dictionary.contact.badge}
          title={dictionary.contact.title}
          subtitle={dictionary.contact.subtitle}
        />

        <motion.div
          variants={shouldReduceMotion ? undefined : containerStagger(0.12, 0.05)}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8"
        >
          {/* Left Column: Direct Info & Copy Button */}
          <motion.div variants={cardEntrance} className="lg:col-span-2 space-y-6">
            <Card className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">{dictionary.contact.cardTitle}</h3>
                <p className="text-sm text-foreground/70 mt-1">
                  {dictionary.contact.cardDescription}
                </p>
              </div>

              <div className="space-y-4 text-sm text-foreground/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-foreground/50">{dictionary.contact.directEmail}</p>
                    <p className="font-medium text-foreground">{email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-foreground/50">{dictionary.contact.locationLabel}</p>
                    <p className="font-medium text-foreground">{location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-foreground/50">{dictionary.contact.availabilityLabel}</p>
                    <p className="font-medium text-foreground">{availability}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-border space-y-4">
                <CopyEmailButton email={email} />
                <div className="pt-2">
                  <p className="text-xs font-mono text-foreground/50 mb-2">{dictionary.contact.connectSocials}</p>
                  <SocialLinks socials={socials} />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div variants={cardEntrance} className="lg:col-span-3">
            <Card className="h-full">
              <h3 className="text-xl font-bold text-foreground mb-6">{dictionary.contact.sendMessageTitle}</h3>
              <ContactForm />
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
