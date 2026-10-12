'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ContactFormData, ContactFormState } from '@/types/contact';
import { Button } from '@/components/ui/Button';
import { EASE_CINEMATIC } from '@/lib/motion';
import { useTranslation } from '@/i18n/context';

export const ContactForm: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { dictionary } = useTranslation();

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    const handlePrefill = (event: Event) => {
      const customEvent = event as CustomEvent<{ subject?: string; message?: string }>;
      if (customEvent.detail) {
        setFormData((prev) => ({
          ...prev,
          ...(customEvent.detail.subject ? { subject: customEvent.detail.subject } : {}),
          ...(customEvent.detail.message ? { message: customEvent.detail.message } : {}),
        }));
      }
    };

    window.addEventListener('prefill-contact', handlePrefill);
    return () => window.removeEventListener('prefill-contact', handlePrefill);
  }, []);

  const [formState, setFormState] = useState<ContactFormState>({
    status: 'idle',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({ status: 'submitting' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || dictionary.contact.form.errorMessage);
      }

      setFormState({ status: 'success' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setFormState({
        status: 'error',
        errorMessage: err.message || dictionary.contact.form.errorMessage,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs font-mono text-foreground/70 mb-1">
            {dictionary.contact.form.nameLabel}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder={dictionary.contact.form.namePlaceholder}
            className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent/40 transition-all duration-200"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-mono text-foreground/70 mb-1">
            {dictionary.contact.form.emailLabel}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder={dictionary.contact.form.emailPlaceholder}
            className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent/40 transition-all duration-200"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-xs font-mono text-foreground/70 mb-1">
          {dictionary.contact.form.subjectLabel}
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          placeholder={dictionary.contact.form.subjectPlaceholder}
          className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent/40 transition-all duration-200"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-mono text-foreground/70 mb-1">
          {dictionary.contact.form.messageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder={dictionary.contact.form.messagePlaceholder}
          className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent/40 transition-all duration-200 resize-none"
        />
      </div>

      {/* Animated Validation / Status Feedback */}
      <AnimatePresence mode="wait">
        {formState.status === 'success' && (
          <motion.div
            key="success"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE_CINEMATIC }}
            className="flex items-center gap-2.5 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{dictionary.contact.form.successMessage}</span>
          </motion.div>
        )}

        {formState.status === 'error' && (
          <motion.div
            key="error"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE_CINEMATIC }}
            className="flex items-center gap-2.5 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{formState.errorMessage || dictionary.contact.form.errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        variant="primary"
        className="w-full sm:w-auto"
        disabled={formState.status === 'submitting'}
        icon={
          formState.status === 'submitting' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )
        }
      >
        {formState.status === 'submitting' ? dictionary.contact.form.sendingButton : dictionary.contact.form.sendButton}
      </Button>
    </form>
  );
};
