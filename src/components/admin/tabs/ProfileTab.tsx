'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  availability: string;
  location: string;
  email: string;
  resumeUrl: string;
  leadParagraph: string;
  bodyParagraph: string;
  highlights: string[];
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  figmaUrl: string;
}

interface ProfileTabProps {
  token: string;
  onToast: (msg: string, type?: 'success' | 'error') => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ token, onToast }) => {
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    title: '',
    bio: '',
    avatarUrl: '',
    availability: '',
    location: '',
    email: '',
    resumeUrl: '',
    leadParagraph: '',
    bodyParagraph: '',
    highlights: [],
    githubUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    figmaUrl: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [newHighlight, setNewHighlight] = useState<string>('');

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setProfile({
          name: data.data.name || '',
          title: data.data.title || '',
          bio: data.data.bio || '',
          avatarUrl: data.data.avatarUrl || '',
          availability: data.data.availability || '',
          location: data.data.location || '',
          email: data.data.email || '',
          resumeUrl: data.data.resumeUrl || '',
          leadParagraph: data.data.leadParagraph || '',
          bodyParagraph: data.data.bodyParagraph || '',
          highlights: Array.isArray(data.data.highlights) ? data.data.highlights : [],
          githubUrl: data.data.githubUrl || '',
          linkedinUrl: data.data.linkedinUrl || '',
          twitterUrl: data.data.twitterUrl || '',
          figmaUrl: data.data.figmaUrl || '',
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      onToast('Failed to fetch profile data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save profile');
      }

      onToast('Personal Profile updated successfully!', 'success');
    } catch (err: any) {
      onToast(err.message || 'Error updating profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    setProfile((prev) => ({
      ...prev,
      highlights: [...prev.highlights, newHighlight.trim()],
    }));
    setNewHighlight('');
  };

  const removeHighlight = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-foreground/60 flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-accent" />
        <span>Loading personal profile...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Personal Profile & Bio</h1>
          <p className="text-xs text-foreground/60 mt-1">
            Update primary personal information, hero narratives, and social links.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={isSaving}
          icon={<Save className="w-4 h-4" />}
        >
          {isSaving ? 'Saving Changes...' : 'Save Profile'}
        </Button>
      </div>

      {/* Basic Profile Details */}
      <Card className="p-6 space-y-4">
        <h2 className="text-base font-bold text-foreground border-b border-surface-border pb-2">
          Basic Identity & Hero Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-foreground/70 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-foreground/70 mb-1">Professional Title</label>
            <input
              type="text"
              required
              value={profile.title}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-foreground/70 mb-1">Availability Status</label>
            <input
              type="text"
              value={profile.availability}
              onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
              placeholder="Available for Senior Roles & High-Impact Opportunities"
              className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-foreground/70 mb-1">Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              placeholder="Douala, Cameroon"
              className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-foreground/70 mb-1">Contact Email</label>
            <input
              type="email"
              required
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-foreground/70 mb-1">Resume File URL</label>
            <input
              type="text"
              value={profile.resumeUrl}
              onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
              placeholder="/resume.pdf"
              className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="md:col-span-2">
            <ImageUpload
              value={profile.avatarUrl}
              onChange={(url) => setProfile({ ...profile, avatarUrl: url })}
              token={token}
              label="Avatar / Profile Photo (Saved to Google Drive)"
              aspectRatio="square"
              onToast={onToast}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-foreground/70 mb-1">Hero Bio</label>
          <textarea
            rows={3}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </Card>

      {/* About Me Narrative & Highlights */}
      <Card className="p-6 space-y-4">
        <h2 className="text-base font-bold text-foreground border-b border-surface-border pb-2">
          About Me Narrative & Highlights
        </h2>

        <div>
          <label className="block text-xs font-mono text-foreground/70 mb-1">Lead Paragraph</label>
          <textarea
            rows={3}
            value={profile.leadParagraph}
            onChange={(e) => setProfile({ ...profile, leadParagraph: e.target.value })}
            className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-foreground/70 mb-1">Body Paragraph</label>
          <textarea
            rows={4}
            value={profile.bodyParagraph}
            onChange={(e) => setProfile({ ...profile, bodyParagraph: e.target.value })}
            className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Highlights List Builder */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-mono text-foreground/70">
            Bullet Point Highlights ({profile.highlights.length})
          </label>

          <div className="space-y-2">
            {profile.highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2.5 bg-surface border border-surface-border rounded-lg"
              >
                <span className="text-accent font-bold text-xs">#{index + 1}</span>
                <span className="flex-1 text-sm text-foreground">{highlight}</span>
                <button
                  type="button"
                  onClick={() => removeHighlight(index)}
                  className="p-1 text-rose-400 hover:text-rose-300 transition-colors"
                  title="Remove highlight"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addHighlight();
                }
              }}
              placeholder="Add key highlight point..."
              className="flex-1 px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={addHighlight}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Point
            </Button>
          </div>
        </div>
      </Card>

      {/* External Social Profiles */}
      <Card className="p-6 space-y-4">
        <h2 className="text-base font-bold text-foreground border-b border-surface-border pb-2">
          Social Links & Profiles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-foreground/70 mb-1">GitHub URL</label>
            <input
              type="url"
              value={profile.githubUrl}
              onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
              placeholder="https://github.com/kingburna1"
              className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-foreground/70 mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={profile.linkedinUrl}
              onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/boniventure-agbor"
              className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-foreground/70 mb-1">Twitter / X URL</label>
            <input
              type="url"
              value={profile.twitterUrl}
              onChange={(e) => setProfile({ ...profile, twitterUrl: e.target.value })}
              placeholder="https://twitter.com/boniventure"
              className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-foreground/70 mb-1">Figma URL</label>
            <input
              type="url"
              value={profile.figmaUrl}
              onChange={(e) => setProfile({ ...profile, figmaUrl: e.target.value })}
              placeholder="https://figma.com/@boniventure"
              className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </Card>
    </form>
  );
};
