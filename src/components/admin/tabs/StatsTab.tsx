'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, RefreshCw, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface StatItem {
  id: string;
  label: string;
  value: string;
  order: number;
}

interface StatsTabProps {
  token: string;
  onToast: (msg: string, type?: 'success' | 'error') => void;
}

export const StatsTab: React.FC<StatsTabProps> = ({ token, onToast }) => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal / Form state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLabel, setFormLabel] = useState<string>('');
  const [formValue, setFormValue] = useState<string>('');
  const [formOrder, setFormOrder] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      onToast('Failed to load stats', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormLabel('');
    setFormValue('');
    setFormOrder(stats.length);
    setIsEditing(true);
  };

  const openEditModal = (stat: StatItem) => {
    setEditingId(stat.id);
    setFormLabel(stat.label);
    setFormValue(stat.value);
    setFormOrder(stat.order);
    setIsEditing(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabel.trim() || !formValue.trim()) return;

    setIsSubmitting(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId
        ? { id: editingId, label: formLabel.trim(), value: formValue.trim(), order: Number(formOrder) }
        : { label: formLabel.trim(), value: formValue.trim(), order: Number(formOrder) };

      const res = await fetch('/api/admin/stats', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save stat');
      }

      onToast(editingId ? 'Stat updated successfully' : 'New stat created', 'success');
      closeModal();
      fetchStats();
    } catch (err: any) {
      onToast(err.message || 'Error saving stat', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stat?')) return;

    try {
      const res = await fetch(`/api/admin/stats?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete stat');
      }

      onToast('Stat deleted successfully', 'success');
      setStats((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      onToast(err.message || 'Error deleting stat', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hero Stats & Metrics</h1>
          <p className="text-xs text-foreground/60 mt-1">
            Numerical counters and impact metrics displayed on the hero section.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreateModal}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Stat
        </Button>
      </div>

      {/* Stats List */}
      {isLoading ? (
        <div className="p-12 text-center text-foreground/60 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-accent" />
          <span>Loading stats...</span>
        </div>
      ) : stats.length === 0 ? (
        <Card className="p-12 text-center text-foreground/50">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No stats found. Click &quot;Add Stat&quot; to create one.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.id} className="p-5 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-wider">
                  Order #{stat.order}
                </span>
                <p className="text-3xl font-extrabold font-mono text-accent mt-1">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-foreground mt-0.5">{stat.label}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  onClick={() => openEditModal(stat)}
                  className="p-1.5 rounded-lg text-foreground/60 hover:text-foreground hover:bg-surface-border/50 transition-colors"
                  title="Edit Stat"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(stat.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                  title="Delete Stat"
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
          <Card className="w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h2 className="text-base font-bold text-foreground">
                {editingId ? 'Edit Hero Stat' : 'Add New Hero Stat'}
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
                  Display Value (e.g. &quot;2+&quot;, &quot;15+&quot;, &quot;99.9%&quot;) *
                </label>
                <input
                  type="text"
                  required
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  placeholder="2+"
                  className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-foreground/70 mb-1">
                  Stat Label (e.g. &quot;Years Experience&quot;) *
                </label>
                <input
                  type="text"
                  required
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  placeholder="Years Experience"
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
                  {isSubmitting ? 'Saving...' : 'Save Stat'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
