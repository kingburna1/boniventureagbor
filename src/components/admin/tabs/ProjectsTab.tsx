'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  RefreshCw,
  FolderGit2,
  Star,
  ExternalLink,
  Github,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ImageUpload } from '@/components/ui/ImageUpload';

interface DbCaseStudy {
  overview?: string;
  problem?: string;
  solution?: string;
  architecture: string[];
  keyResults: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface DbProject {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  imageUrl: string;
  impactMetric: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  caseStudy?: DbCaseStudy;
}

interface ProjectsTabProps {
  token: string;
  onToast: (msg: string, type?: 'success' | 'error') => void;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ token, onToast }) => {
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal / Form state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<'project' | 'casestudy'>('project');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Project fields
  const [title, setTitle] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [category, setCategory] = useState<string>('fullstack');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [impactMetric, setImpactMetric] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [demoUrl, setDemoUrl] = useState<string>('');
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [featured, setFeatured] = useState<boolean>(true);
  const [order, setOrder] = useState<number>(0);

  // Case study fields
  const [csOverview, setCsOverview] = useState<string>('');
  const [csProblem, setCsProblem] = useState<string>('');
  const [csSolution, setCsSolution] = useState<string>('');
  const [csArchitectureInput, setCsArchitectureInput] = useState<string>('');
  const [csResultsInput, setCsResultsInput] = useState<string>('');
  const [csTechInput, setCsTechInput] = useState<string>('');

  useEffect(() => {
    fetchProjects();

    const handleRealtimeChange = () => {
      // Only auto-refetch if not currently editing in modal
      if (!isEditing) {
        fetchProjects();
      }
    };

    window.addEventListener('ba_realtime_projects_changed', handleRealtimeChange);
    return () => {
      window.removeEventListener('ba_realtime_projects_changed', handleRealtimeChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isEditing]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      onToast('Failed to load projects', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setTagline('');
    setCategory('fullstack');
    setImageUrl('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop');
    setImpactMetric('🚀 99.9% Uptime');
    setTagsInput('Next.js, TypeScript, Tailwind CSS');
    setDemoUrl('');
    setGithubUrl('');
    setFeatured(true);
    setOrder(projects.length);

    setCsOverview('');
    setCsProblem('');
    setCsSolution('');
    setCsArchitectureInput('Event-driven microservices architecture\nReal-time PostgreSQL replication\nDistributed caching with Redis');
    setCsResultsInput('Reduced latency by 45%\nScaled to 50k+ daily requests');
    setCsTechInput('Next.js 14, TypeScript, PostgreSQL, Prisma, Tailwind CSS');

    setModalTab('project');
    setIsEditing(true);
  };

  const openEditModal = (proj: DbProject) => {
    setEditingId(proj.id);
    setTitle(proj.title);
    setTagline(proj.tagline);
    setCategory(proj.category);
    setImageUrl(proj.imageUrl);
    setImpactMetric(proj.impactMetric || '');
    setTagsInput(proj.tags.join(', '));
    setDemoUrl(proj.demoUrl || '');
    setGithubUrl(proj.githubUrl || '');
    setFeatured(proj.featured);
    setOrder(proj.order);

    const cs = proj.caseStudy;
    setCsOverview(cs?.overview || proj.tagline);
    setCsProblem(cs?.problem || '');
    setCsSolution(cs?.solution || '');
    setCsArchitectureInput(cs?.architecture?.join('\n') || '');
    setCsResultsInput(cs?.keyResults?.join('\n') || '');
    setCsTechInput(cs?.technologies?.join(', ') || proj.tags.join(', '));

    setModalTab('project');
    setIsEditing(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !tagline.trim() || !imageUrl.trim()) {
      onToast('Title, tagline, and image URL are required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const parsedArchitecture = csArchitectureInput
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

      const parsedResults = csResultsInput
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

      const parsedTech = csTechInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        id: editingId || undefined,
        title: title.trim(),
        tagline: tagline.trim(),
        category,
        imageUrl: imageUrl.trim(),
        impactMetric: impactMetric.trim(),
        tags: parsedTags,
        demoUrl: demoUrl.trim() || undefined,
        githubUrl: githubUrl.trim() || undefined,
        featured,
        order: Number(order),
        caseStudy: {
          overview: csOverview.trim() || tagline.trim(),
          problem: csProblem.trim(),
          solution: csSolution.trim(),
          architecture: parsedArchitecture,
          keyResults: parsedResults,
          technologies: parsedTech.length > 0 ? parsedTech : parsedTags,
          liveUrl: demoUrl.trim() || undefined,
          githubUrl: githubUrl.trim() || undefined,
        },
      };

      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/projects', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save project');
      }

      onToast(editingId ? 'Project updated successfully' : 'New project created', 'success');
      closeModal();
      fetchProjects();
    } catch (err: any) {
      onToast(err.message || 'Error saving project', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project and its case study?')) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete project');
      }

      onToast('Project deleted successfully', 'success');
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      onToast(err.message || 'Error deleting project', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects & Case Studies</h1>
          <p className="text-xs text-foreground/60 mt-1">
            Manage portfolio projects, case studies, architectural breakdowns, and metrics.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreateModal}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Project
        </Button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-foreground/60 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-accent" />
          <span>Loading projects...</span>
        </div>
      ) : projects.length === 0 ? (
        <Card className="p-12 text-center text-foreground/50">
          <FolderGit2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No projects found. Click &quot;Add Project&quot; to create one.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <Card key={proj.id} className="overflow-hidden flex flex-col justify-between group">
              {/* Image & Category Overlay */}
              <div className="relative aspect-video w-full bg-surface-border overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proj.imageUrl}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <Badge variant="accent" className="capitalize text-[10px]">
                    {proj.category}
                  </Badge>
                  {proj.featured && (
                    <span className="p-1 rounded-full bg-amber-500/90 text-white shadow-sm" title="Featured Project">
                      <Star className="w-3 h-3 fill-white" />
                    </span>
                  )}
                </div>
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white backdrop-blur-sm">
                  #{proj.order}
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-foreground leading-snug">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-foreground/70 line-clamp-2 leading-relaxed">
                    {proj.tagline}
                  </p>
                  <p className="text-[11px] font-mono text-emerald-400 font-medium">
                    {proj.impactMetric}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap gap-1">
                    {proj.tags.slice(0, 4).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-surface border border-surface-border text-[10px] font-mono text-foreground/70"
                      >
                        {tag}
                      </span>
                    ))}
                    {proj.tags.length > 4 && (
                      <span className="text-[10px] font-mono text-foreground/40 self-center">
                        +{proj.tags.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-surface-border">
                    <div className="flex items-center gap-2">
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-foreground/60 hover:text-accent transition-colors"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-foreground/60 hover:text-accent transition-colors"
                          title="GitHub Repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(proj)}
                        className="p-1.5 rounded-lg text-foreground/70 hover:text-foreground hover:bg-surface-border/50 transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <Card className="w-full max-w-3xl my-8 p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-border pb-3 sticky top-0 bg-surface/90 backdrop-blur-md z-10">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {editingId ? 'Edit Project & Case Study' : 'Create New Portfolio Project'}
                </h2>
                <p className="text-xs text-foreground/50">
                  Fill in high-level project card info and technical deep-dive case study.
                </p>
              </div>
              <button onClick={closeModal} className="p-1 text-foreground/50 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs switch */}
            <div className="flex border-b border-surface-border gap-4 text-xs font-mono">
              <button
                type="button"
                onClick={() => setModalTab('project')}
                className={`pb-2 font-bold transition-colors border-b-2 ${
                  modalTab === 'project'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-foreground/60 hover:text-foreground'
                }`}
              >
                1. Project Card Info
              </button>
              <button
                type="button"
                onClick={() => setModalTab('casestudy')}
                className={`pb-2 font-bold transition-colors border-b-2 ${
                  modalTab === 'casestudy'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-foreground/60 hover:text-foreground'
                }`}
              >
                2. Case Study & Architecture
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {modalTab === 'project' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-foreground/70 mb-1">Project Title *</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="ApexPay Financial Gateway"
                        className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-foreground/70 mb-1">Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <option value="fullstack">Full-Stack Engineering</option>
                        <option value="design">Product Design & UI/UX</option>
                        <option value="ai">AI Systems & Architecture</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-foreground/70 mb-1">Tagline / Short Summary *</label>
                    <input
                      type="text"
                      required
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="High-throughput payment orchestration engine..."
                      className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <ImageUpload
                      value={imageUrl}
                      onChange={setImageUrl}
                      token={token}
                      label="Project Cover Image (Cloud Storage CDN)"
                      aspectRatio="video"
                      onToast={onToast}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-foreground/70 mb-1">Impact Metric Badge</label>
                    <input
                      type="text"
                      value={impactMetric}
                      onChange={(e) => setImpactMetric(e.target.value)}
                      placeholder="🚀 99.99% Uptime &bull; $12M Processed"
                      className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-foreground/70 mb-1">
                      Tech Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Next.js 14, TypeScript, Tailwind, PostgreSQL, Stripe"
                      className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-foreground/70 mb-1">Live Demo URL</label>
                      <input
                        type="url"
                        value={demoUrl}
                        onChange={(e) => setDemoUrl(e.target.value)}
                        placeholder="https://apexpay.dev"
                        className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-foreground/70 mb-1">GitHub Repo URL</label>
                      <input
                        type="url"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/kingburna1/apexpay"
                        className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="w-4 h-4 rounded text-accent focus:ring-accent"
                      />
                      <label htmlFor="featured" className="text-xs font-medium text-foreground">
                        Featured on Hero / Main Grid
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
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-foreground/70 mb-1">
                      Problem Statement *
                    </label>
                    <textarea
                      rows={3}
                      value={csProblem}
                      onChange={(e) => setCsProblem(e.target.value)}
                      placeholder="Legacy payment gateways struggled with sub-second reconciliations and API rate limits..."
                      className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-foreground/70 mb-1">
                      Engineering Solution *
                    </label>
                    <textarea
                      rows={3}
                      value={csSolution}
                      onChange={(e) => setCsSolution(e.target.value)}
                      placeholder="Engineered an event-driven queue with Redis & PostgreSQL transaction safety..."
                      className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-foreground/70 mb-1">
                      Architecture Highlights (1 per line)
                    </label>
                    <textarea
                      rows={3}
                      value={csArchitectureInput}
                      onChange={(e) => setCsArchitectureInput(e.target.value)}
                      placeholder="Distributed microservices architecture&#10;Idempotent webhook pipeline&#10;Zero-downtime database migration"
                      className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-foreground/70 mb-1">
                      Measurable Business Results (1 per line)
                    </label>
                    <textarea
                      rows={3}
                      value={csResultsInput}
                      onChange={(e) => setCsResultsInput(e.target.value)}
                      placeholder="45% reduction in checkout drop-off&#10;Zero reconciliation data loss across 1M+ transactions"
                      className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-surface-border">
                {modalTab === 'project' ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setModalTab('casestudy')}
                  >
                    Next: Case Study &rarr;
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setModalTab('project')}
                  >
                    &larr; Back to Project Card
                  </Button>
                )}

                <div className="flex items-center gap-2">
                  <Button type="button" variant="ghost" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    icon={<Save className="w-4 h-4" />}
                  >
                    {isSubmitting ? 'Saving Project...' : 'Save Project & Case Study'}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
