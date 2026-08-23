'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, RefreshCw, Briefcase, MapPin, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ExperienceRecord {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  skills: string[];
  isCurrent: boolean;
  order: number;
}

interface ExperienceTabProps {
  token: string;
  onToast: (msg: string, type?: 'success' | 'error') => void;
}

export const ExperienceTab: React.FC<ExperienceTabProps> = ({ token, onToast }) => {
  const [items, setItems] = useState<ExperienceRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal / Form state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [company, setCompany] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [period, setPeriod] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [highlightsInput, setHighlightsInput] = useState<string>('');
  const [skillsInput, setSkillsInput] = useState<string>('');
  const [isCurrent, setIsCurrent] = useState<boolean>(false);
  const [order, setOrder] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchExperience();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchExperience = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/experience', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch experience:', err);
      onToast('Failed to load career experience', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setCompany('');
    setRole('');
    setPeriod('');
    setLocation('Remote');
    setDescription('');
    setHighlightsInput('');
    setSkillsInput('');
    setIsCurrent(false);
    setOrder(items.length);
    setIsEditing(true);
  };

  const openEditModal = (item: ExperienceRecord) => {
    setEditingId(item.id);
    setCompany(item.company);
    setRole(item.role);
    setPeriod(item.period);
    setLocation(item.location);
    setDescription(item.description);
    setHighlightsInput(item.highlights.join('\n'));
    setSkillsInput(item.skills.join(', '));
    setIsCurrent(item.isCurrent);
    setOrder(item.order);
    setIsEditing(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim() || !period.trim() || !description.trim()) {
      onToast('Company, role, period, and description are required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedHighlights = highlightsInput
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean);

      const parsedSkills = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        id: editingId || undefined,
        company: company.trim(),
        role: role.trim(),
        period: period.trim(),
        location: location.trim(),
        description: description.trim(),
        highlights: parsedHighlights,
        skills: parsedSkills,
        isCurrent,
        order: Number(order),
      };

      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/experience', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save experience');
      }

      onToast(editingId ? 'Experience updated successfully' : 'New role added', 'success');
      closeModal();
      fetchExperience();
    } catch (err: any) {
      onToast(err.message || 'Error saving experience', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience record?')) return;

    try {
      const res = await fetch(`/api/admin/experience?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete experience');
      }

      onToast('Experience deleted successfully', 'success');
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      onToast(err.message || 'Error deleting experience', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Career Experience</h1>
          <p className="text-xs text-foreground/60 mt-1">
            Timeline roles, company leadership, highlights, and technology milestones.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreateModal}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Role
        </Button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-foreground/60 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-accent" />
          <span>Loading career experience...</span>
        </div>
      ) : items.length === 0 ? (
        <Card className="p-12 text-center text-foreground/50">
          <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No career experience records found.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-foreground">{item.role}</h3>
                    {item.isCurrent && (
                      <Badge variant="accent" className="text-[10px]">
                        Present Role
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-accent">{item.company}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs font-mono text-foreground/60">
                    <p className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {item.period}
                    </p>
                    {item.location && (
                      <p className="flex items-center gap-1 justify-end mt-0.5">
                        <MapPin className="w-3.5 h-3.5" /> {item.location}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 pl-2 border-l border-surface-border">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg text-foreground/70 hover:text-foreground hover:bg-surface-border/50 transition-colors"
                      title="Edit Experience"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                      title="Delete Experience"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-foreground/80 leading-relaxed">
                {item.description}
              </p>

              {item.highlights.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-mono text-foreground/50 uppercase">
                    Key Highlights
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-xs text-foreground/70">
                    {item.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {item.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.skills.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-surface border border-surface-border text-[11px] font-mono text-foreground/70"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <Card className="w-full max-w-2xl my-8 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h2 className="text-base font-bold text-foreground">
                {editingId ? 'Edit Career Role' : 'Add New Career Role'}
              </h2>
              <button onClick={closeModal} className="p-1 text-foreground/50 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-foreground/70 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="TechCorp Global"
                    className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-foreground/70 mb-1">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Lead Full-Stack Engineer"
                    className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-foreground/70 mb-1">Period (e.g. 2023 — Present) *</label>
                  <input
                    type="text"
                    required
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="2023 — Present"
                    className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-foreground/70 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Remote / Douala"
                    className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-foreground/70 mb-1">Role Narrative *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Architected cloud-native distributed microservices..."
                  className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-foreground/70 mb-1">
                  Highlights (1 per line)
                </label>
                <textarea
                  rows={3}
                  value={highlightsInput}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  placeholder="Scaled platform from 10k to 500k monthly active users&#10;Decreased build and deploy times by 65%"
                  className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-foreground/70 mb-1">
                  Skills & Tools (comma-separated)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="Next.js, TypeScript, PostgreSQL, Docker, AWS"
                  className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isCurrent"
                    checked={isCurrent}
                    onChange={(e) => setIsCurrent(e.target.checked)}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <label htmlFor="isCurrent" className="text-xs font-medium text-foreground">
                    Current active position
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-mono text-foreground/70 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-4 py-1.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-surface-border">
                <Button type="button" variant="ghost" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  icon={<Save className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Saving...' : 'Save Role'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
