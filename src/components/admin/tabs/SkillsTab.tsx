'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  RefreshCw,
  Wrench,
  FolderPlus,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface DbSkill {
  id: string;
  name: string;
  level: string;
  order: number;
  categoryId: string;
}

interface DbSkillCategory {
  id: string;
  title: string;
  description: string;
  order: number;
  skills: DbSkill[];
}

interface SkillsTabProps {
  token: string;
  onToast: (msg: string, type?: 'success' | 'error') => void;
}

export const SkillsTab: React.FC<SkillsTabProps> = ({ token, onToast }) => {
  const [categories, setCategories] = useState<DbSkillCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Category Modal
  const [isCatModalOpen, setIsCatModalOpen] = useState<boolean>(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catTitle, setCatTitle] = useState<string>('');
  const [catDescription, setCatDescription] = useState<string>('');
  const [catOrder, setCatOrder] = useState<number>(0);

  // Skill Modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState<boolean>(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [targetCatId, setTargetCatId] = useState<string>('');
  const [skillName, setSkillName] = useState<string>('');
  const [skillLevel, setSkillLevel] = useState<string>('Core Stack');
  const [skillOrder, setSkillOrder] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/skills', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch skills:', err);
      onToast('Failed to load skills matrix', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Category CRUD
  const openCreateCategory = () => {
    setEditingCatId(null);
    setCatTitle('');
    setCatDescription('');
    setCatOrder(categories.length);
    setIsCatModalOpen(true);
  };

  const openEditCategory = (cat: DbSkillCategory) => {
    setEditingCatId(cat.id);
    setCatTitle(cat.title);
    setCatDescription(cat.description);
    setCatOrder(cat.order);
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catTitle.trim() || !catDescription.trim()) return;

    setIsSubmitting(true);
    try {
      const method = editingCatId ? 'PUT' : 'POST';
      const body = editingCatId
        ? { type: 'category', id: editingCatId, title: catTitle.trim(), description: catDescription.trim(), order: Number(catOrder) }
        : { type: 'category', title: catTitle.trim(), description: catDescription.trim(), order: Number(catOrder) };

      const res = await fetch('/api/admin/skills', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save category');

      onToast(editingCatId ? 'Category updated' : 'Category created', 'success');
      setIsCatModalOpen(false);
      fetchSkills();
    } catch (err: any) {
      onToast(err.message || 'Error saving category', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category and all its skills?')) return;

    try {
      const res = await fetch(`/api/admin/skills?type=category&id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete category');

      onToast('Category deleted successfully', 'success');
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      onToast(err.message || 'Error deleting category', 'error');
    }
  };

  // Skill Item CRUD
  const openAddSkill = (catId: string) => {
    setEditingSkillId(null);
    setTargetCatId(catId);
    setSkillName('');
    setSkillLevel('Core Stack');
    const cat = categories.find((c) => c.id === catId);
    setSkillOrder(cat ? cat.skills.length : 0);
    setIsSkillModalOpen(true);
  };

  const openEditSkill = (skill: DbSkill) => {
    setEditingSkillId(skill.id);
    setTargetCatId(skill.categoryId);
    setSkillName(skill.name);
    setSkillLevel(skill.level);
    setSkillOrder(skill.order);
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim() || !targetCatId) return;

    setIsSubmitting(true);
    try {
      const method = editingSkillId ? 'PUT' : 'POST';
      const body = editingSkillId
        ? { type: 'skill', id: editingSkillId, name: skillName.trim(), level: skillLevel, categoryId: targetCatId, order: Number(skillOrder) }
        : { type: 'skill', name: skillName.trim(), level: skillLevel, categoryId: targetCatId, order: Number(skillOrder) };

      const res = await fetch('/api/admin/skills', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save skill');

      onToast(editingSkillId ? 'Skill updated' : 'Skill added', 'success');
      setIsSkillModalOpen(false);
      fetchSkills();
    } catch (err: any) {
      onToast(err.message || 'Error saving skill', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const res = await fetch(`/api/admin/skills?type=skill&id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete skill');

      onToast('Skill deleted successfully', 'success');
      fetchSkills();
    } catch (err: any) {
      onToast(err.message || 'Error deleting skill', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Skills Matrix & Stack</h1>
          <p className="text-xs text-foreground/60 mt-1">
            Categorized technical stack, frameworks, libraries, and proficiency levels.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreateCategory}
          icon={<FolderPlus className="w-4 h-4" />}
        >
          Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-foreground/60 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-accent" />
          <span>Loading skills matrix...</span>
        </div>
      ) : categories.length === 0 ? (
        <Card className="p-12 text-center text-foreground/50">
          <Wrench className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No skill categories found.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <Card key={cat.id} className="p-6 space-y-4">
              {/* Category Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-foreground">{cat.title}</h3>
                    <span className="text-[10px] font-mono text-foreground/40 px-2 py-0.5 rounded bg-surface border border-surface-border">
                      {cat.skills.length} skills
                    </span>
                  </div>
                  <p className="text-xs text-foreground/60 mt-0.5">{cat.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openAddSkill(cat.id)}
                    icon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Skill
                  </Button>
                  <button
                    onClick={() => openEditCategory(cat)}
                    className="p-1.5 rounded-lg text-foreground/60 hover:text-foreground hover:bg-surface-border/50 transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Skills List in Category */}
              {cat.skills.length === 0 ? (
                <p className="text-xs text-foreground/40 italic py-2">
                  No skills in this category. Click &quot;Add Skill&quot; to add one.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cat.skills.map((skill) => {
                    const isCore = skill.level.toLowerCase().includes('core');
                    const isHandsOn = skill.level.toLowerCase().includes('hands');

                    return (
                      <div
                        key={skill.id}
                        className="p-3 rounded-xl bg-surface border border-surface-border flex items-center justify-between gap-2"
                      >
                        <div className="space-y-0.5 truncate">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {skill.name}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isCore
                                  ? 'bg-accent'
                                  : isHandsOn
                                  ? 'bg-emerald-500'
                                  : 'bg-purple-500'
                              }`}
                            />
                            <span className="text-[10px] font-mono text-foreground/60">
                              {skill.level}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => openEditSkill(skill)}
                            className="p-1 rounded text-foreground/50 hover:text-foreground"
                            title="Edit Skill"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="p-1 rounded text-rose-400 hover:text-rose-300"
                            title="Delete Skill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h2 className="text-base font-bold text-foreground">
                {editingCatId ? 'Edit Skill Category' : 'Add New Category'}
              </h2>
              <button onClick={() => setIsCatModalOpen(false)} className="p-1 text-foreground/50 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-foreground/70 mb-1">Category Title *</label>
                <input
                  type="text"
                  required
                  value={catTitle}
                  onChange={(e) => setCatTitle(e.target.value)}
                  placeholder="Frontend Architecture & Web APIs"
                  className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-foreground/70 mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="Modern reactive frameworks, design system engineering..."
                  className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-foreground/70 mb-1">Display Order</label>
                <input
                  type="number"
                  value={catOrder}
                  onChange={(e) => setCatOrder(Number(e.target.value))}
                  className="w-full px-4 py-1.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCatModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  icon={<Save className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h2 className="text-base font-bold text-foreground">
                {editingSkillId ? 'Edit Skill Item' : 'Add Skill Item'}
              </h2>
              <button onClick={() => setIsSkillModalOpen(false)} className="p-1 text-foreground/50 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-foreground/70 mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="Next.js 14"
                  className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-foreground/70 mb-1">Competency Level *</label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="Core Stack">Core Stack (Daily Driver)</option>
                  <option value="Hands-on Experience">Hands-on Experience (Production Ready)</option>
                  <option value="Architecture / Explored">Architecture / Explored (Advanced / Scaled)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-foreground/70 mb-1">Display Order</label>
                <input
                  type="number"
                  value={skillOrder}
                  onChange={(e) => setSkillOrder(Number(e.target.value))}
                  className="w-full px-4 py-1.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsSkillModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  icon={<Save className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Saving...' : 'Save Skill'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
