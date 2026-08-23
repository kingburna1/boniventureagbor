'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Check, RefreshCw, X, Link as LinkIcon, Cloud } from 'lucide-react';
import { Button } from './Button';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  token: string;
  label?: string;
  aspectRatio?: 'video' | 'square' | 'auto';
  onToast?: (msg: string, type?: 'success' | 'error') => void;
  required?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  token,
  label = 'Image Asset',
  aspectRatio = 'video',
  onToast,
  required = false,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isUrlMode, setIsUrlMode] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onToast?.('Please select a valid image file (PNG, JPG, WEBP, SVG)', 'error');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      onToast?.('Image size must be less than 15MB', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image to Google Drive');
      }

      onChange(data.data.url);
      onToast?.('Image uploaded to Google Drive!', 'success');
    } catch (err: any) {
      console.error('Upload error:', err);
      onToast?.(err.message || 'Failed to upload image', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square max-w-[200px]'
      : aspectRatio === 'video'
      ? 'aspect-video w-full'
      : 'min-h-[160px] w-full';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono text-foreground/70">
          {label} {required && '*'}
        </label>

        <button
          type="button"
          onClick={() => setIsUrlMode(!isUrlMode)}
          className="text-[11px] font-mono text-accent hover:underline flex items-center gap-1"
        >
          {isUrlMode ? (
            <>
              <Cloud className="w-3 h-3" /> Upload file to Drive
            </>
          ) : (
            <>
              <LinkIcon className="w-3 h-3" /> Paste external URL
            </>
          )}
        </button>
      </div>

      {isUrlMode ? (
        <div className="space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/... or https://lh3.googleusercontent.com/..."
            className="w-full px-4 py-2 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {value && (
            <div className="relative rounded-lg overflow-hidden border border-surface-border max-h-48 bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Preview" className="w-full h-full object-cover max-h-48" />
            </div>
          )}
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {value ? (
            <div className="relative rounded-xl overflow-hidden border border-surface-border bg-surface group">
              <div className={`relative ${aspectClass} overflow-hidden bg-surface-border/20`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value}
                  alt="Uploaded Asset"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />

                {/* Google Drive Verified Badge */}
                {value.includes('googleusercontent.com') && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-mono flex items-center gap-1 shadow-sm">
                    <Cloud className="w-3 h-3" /> Google Drive CDN
                  </div>
                )}

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    icon={<RefreshCw className={`w-3.5 h-3.5 ${isUploading ? 'animate-spin' : ''}`} />}
                  >
                    {isUploading ? 'Uploading...' : 'Replace Image'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/20"
                    onClick={() => onChange('')}
                    icon={<X className="w-3.5 h-3.5" />}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-accent bg-accent/10'
                  : 'border-surface-border bg-surface/50 hover:border-accent/50 hover:bg-surface'
              }`}
            >
              {isUploading ? (
                <div className="space-y-2 py-4 flex flex-col items-center">
                  <RefreshCw className="w-8 h-8 text-accent animate-spin" />
                  <p className="text-xs font-mono text-accent font-semibold">
                    Uploading directly to Google Drive...
                  </p>
                  <p className="text-[11px] text-foreground/50 font-mono">
                    Generating high-speed public CDN stream
                  </p>
                </div>
              ) : (
                <div className="space-y-2 py-2 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Click to upload or drag &amp; drop
                    </p>
                    <p className="text-[11px] text-foreground/50 font-mono mt-0.5">
                      PNG, JPG, WEBP, SVG up to 15MB &bull; Saved to Google Drive
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
