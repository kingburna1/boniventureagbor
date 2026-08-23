'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, RefreshCw, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface PhilosophyItem {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface PhilosophyTabProps {
  token: string;
  onToast: (msg: string, type?: 'success' | 'error') => void;
}

export const PhilosophyTab: React.FC<PhilosophyTabProps> = ({ token, onToast }) => {
  const [items, setItems] = useState<PhilosophyItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formOrder, setFormOrder] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchPhilosophy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchPhilosophy = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/philosophy', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch philosophy:', err);
      onToast('Failed to load philosophy items', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormTitle('');
    setFormDescription('');
    setFormOrder(items.length);
    setIsEditing(true);
  };

  const openEditModal = (item: PhilosophyItem) => {
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormDescription(item.description);
    setFormOrder(item.order);
    setIsEditing(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    setIsSubmitting(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId
        ? { id: editingId, title: formTitle.trim(), description: formDescription.trim(), order: Number(formOrder) }
        : { title: formTitle.trim(), description: formDescription.trim(), order: Number(formOrder) };

      const res = await fetch('/api/admin/philosophy', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save philosophy');
      }

      onToast(editingId ? 'Philosophy updated' : 'New principle created', 'success');
      closeModal();
      fetchPhilosophy();
    } catch (err: any) {
      onToast(err.message || 'Error saving philosophy', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this principle?')) return;

    try {
      const res = await fetch(`/api/admin/philosophy?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete philosophy');
      }

      onToast('Principle deleted successfully', 'success');
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      onToast(err.message || 'Error deleting philosophy', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Engineering Philosophy</h1>
          <p className="text-xs text-foreground/60 mt-1">
            Core technical beliefs, standards, and product engineering principles.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreateModal}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Principle
        </Button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-foreground/60 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-accent" />
          <span>Loading principles...</span>
        </div>
      ) : items.length === 0 ? (
        <Card className="p-12 text-center text-foreground/50">
          <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No principles found.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-foreground">{item.title}</h3>
                  <span className="text-[10px] font-mono text-foreground/40">
                    Order #{item.order}
                  </span>
                </div>
                <p className="text-xs text-foreground/70 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-1.5 rounded-lg text-foreground/60 hover:text-foreground hover:bg-surface-border/50 transition-colors"
                  title="Edit Principle"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                  title="Delete Principle"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h2 className="text-base font-bold text-foreground">
                {editingId ? 'Edit Principle' : 'Add New Philosophy Principle'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 text-foreground/50 hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-foreground/70 mb-1">
                  Principle Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Design-Driven Architecture"
                  className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-foreground/70 mb-1">
                  Description / Thesis *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Code should look and behave like a high-performance instrument..."
                  className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-foreground/70 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  icon={<Save className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Saving...' : 'Save Principle'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
