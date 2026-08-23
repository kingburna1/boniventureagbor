'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  UploadCloud,
  Download,
  ExternalLink,
  Copy,
  Check,
  Trash2,
  RefreshCw,
  Save,
  Cloud,
  FileCheck,
  AlertCircle,
  Link as LinkIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ResumeTabProps {
  token: string;
  onToast: (msg: string, type?: 'success' | 'error') => void;
}

export const ResumeTab: React.FC<ResumeTabProps> = ({ token, onToast }) => {
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSavingCustom, setIsSavingCustom] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchResume = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/resume', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResumeUrl(data.data.resumeUrl || '');
        setCustomUrl(data.data.resumeUrl || '');
        setLastUpdated(data.data.lastUpdated || null);
      }
    } catch (err) {
      console.error('Failed to fetch resume:', err);
      onToast('Failed to load resume details', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.pdf')) {
      onToast('Please upload a valid PDF or Word document (.pdf, .docx)', 'error');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      onToast('File size must be under 15MB', 'error');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload file buffer directly to Google Drive
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.success) {
        throw new Error(uploadData.error || 'Failed to upload resume to Google Drive');
      }

      const uploadedUrl = uploadData.data.url;

      // 2. Save active resume URL to profile
      const saveRes = await fetch('/api/admin/resume', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resumeUrl: uploadedUrl }),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok || !saveData.success) {
        throw new Error(saveData.error || 'Failed to update resume record');
      }

      setResumeUrl(uploadedUrl);
      setCustomUrl(uploadedUrl);
      setLastUpdated(new Date().toISOString());
      onToast('Resume uploaded to Google Drive & activated on site!', 'success');
    } catch (err: any) {
      console.error('Resume upload error:', err);
      onToast(err.message || 'Error uploading resume', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSaveCustomUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    setIsSavingCustom(true);
    try {
      const res = await fetch('/api/admin/resume', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resumeUrl: customUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update resume URL');
      }

      setResumeUrl(customUrl.trim());
      setLastUpdated(new Date().toISOString());
      onToast('Resume URL updated successfully!', 'success');
    } catch (err: any) {
      onToast(err.message || 'Error updating resume URL', 'error');
    } finally {
      setIsSavingCustom(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!confirm('Are you sure you want to remove the active resume link?')) return;

    try {
      const res = await fetch('/api/admin/resume', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to remove resume');
      }

      setResumeUrl('#');
      setCustomUrl('#');
      onToast('Resume link removed from site navigation', 'success');
    } catch (err: any) {
      onToast(err.message || 'Error removing resume', 'error');
    }
  };

  const copyToClipboard = () => {
    if (!resumeUrl || resumeUrl === '#') return;
    navigator.clipboard.writeText(resumeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    onToast('Resume link copied to clipboard!', 'success');
  };

  const isDriveHosted = resumeUrl.includes('googleusercontent.com') || resumeUrl.includes('drive.google.com');
  const hasActiveResume = resumeUrl && resumeUrl !== '#';

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Resume &amp; CV Management</h1>
          <p className="text-xs text-foreground/60 mt-1">
            Upload new PDF versions to Google Drive or connect an external document link.
          </p>
        </div>

        <button
          onClick={fetchResume}
          disabled={isLoading}
          className="p-2 rounded-lg bg-surface border border-surface-border text-foreground/70 hover:text-accent transition-colors"
          title="Refresh Status"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-foreground/60 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-accent" />
          <span>Loading resume status...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Active Resume Status & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">Active Website Resume</h2>
                    <span className="text-[11px] font-mono text-foreground/50">
                      Connected to Header &amp; Mobile Navigation
                    </span>
                  </div>
                </div>

                <Badge variant={hasActiveResume ? 'accent' : 'outline'}>
                  {hasActiveResume ? 'Active & Live' : 'Not Configured'}
                </Badge>
              </div>

              {hasActiveResume ? (
                <div className="space-y-4">
                  {/* File Metadata Box */}
                  <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/50">Hosting Provider:</span>
                      <span className="font-bold flex items-center gap-1 text-emerald-400">
                        {isDriveHosted ? (
                          <>
                            <Cloud className="w-3.5 h-3.5" /> Google Drive Cloud Storage
                          </>
                        ) : (
                          'External Web Link'
                        )}
                      </span>
                    </div>

                    {lastUpdated && (
                      <div className="flex items-center justify-between">
                        <span className="text-foreground/50">Last Synchronized:</span>
                        <span className="text-foreground/80">
                          {new Date(lastUpdated).toLocaleDateString()} {new Date(lastUpdated).toLocaleTimeString()}
                        </span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-surface-border">
                      <span className="text-foreground/50 block mb-1">Direct Target URL:</span>
                      <p className="p-2 rounded bg-surface-border/30 text-[11px] text-accent truncate select-all">
                        {resumeUrl}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white text-xs font-semibold rounded-lg hover:bg-accent-hover transition-all shadow-md shadow-accent/20"
                    >
                      <ExternalLink className="w-4 h-4" /> View in New Tab
                    </a>

                    <button
                      onClick={copyToClipboard}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-surface border border-surface-border text-foreground/80 hover:text-foreground hover:border-accent text-xs font-semibold rounded-lg transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copy Shareable Link
                        </>
                      )}
                    </button>
                  </div>

                  <div className="pt-3 border-t border-surface-border flex justify-end">
                    <button
                      onClick={handleDeleteResume}
                      className="text-xs font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove Active Resume
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-foreground/50 space-y-2">
                  <AlertCircle className="w-8 h-8 mx-auto text-foreground/40" />
                  <p className="text-xs">No active resume URL configured.</p>
                  <p className="text-[11px] font-mono">Upload a PDF on the right to activate.</p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: Upload to Google Drive / Custom Link */}
          <div className="lg:col-span-6 space-y-6">
            {/* Upload to Google Drive */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-surface-border pb-3">
                <Cloud className="w-4 h-4 text-accent" />
                <h2 className="text-base font-bold text-foreground">
                  Upload PDF to Google Drive
                </h2>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-accent bg-accent/10'
                    : 'border-surface-border bg-surface/50 hover:border-accent/50 hover:bg-surface'
                }`}
              >
                {isUploading ? (
                  <div className="space-y-2 py-4 flex flex-col items-center">
                    <RefreshCw className="w-8 h-8 text-accent animate-spin" />
                    <p className="text-xs font-mono text-accent font-semibold">
                      Uploading PDF directly to Google Drive...
                    </p>
                    <p className="text-[11px] text-foreground/50 font-mono">
                      Generating public reader CDN link and updating database
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shadow-md">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        Click to upload new resume PDF
                      </p>
                      <p className="text-xs text-foreground/50 font-mono mt-1">
                        or drag and drop .PDF file here (up to 15MB)
                      </p>
                    </div>
                    <Badge variant="accent" className="mt-2 text-[10px]">
                      ☁️ Direct Google Drive Cloud Sync
                    </Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Custom External URL Card */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-surface-border pb-3">
                <LinkIcon className="w-4 h-4 text-accent" />
                <h2 className="text-base font-bold text-foreground">
                  Or Connect External Resume Link
                </h2>
              </div>

              <form onSubmit={handleSaveCustomUrl} className="space-y-3">
                <div>
                  <label className="block text-xs font-mono text-foreground/70 mb-1">
                    Custom Document URL (Google Docs, Dropbox, Notion, etc.)
                  </label>
                  <input
                    type="url"
                    required
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://docs.google.com/document/d/... or /resume.pdf"
                    className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    disabled={isSavingCustom}
                    icon={<Save className="w-4 h-4" />}
                  >
                    {isSavingCustom ? 'Saving Link...' : 'Save Custom Link'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
