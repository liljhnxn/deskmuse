"use client";

import React, { useState } from "react";
import { CATEGORIES, Category } from "@/lib/contract";
import { SAMPLE_PRESETS, SamplePreset } from "@/lib/sampleData";
import {
  X,
  UploadCloud,
  Sparkles,
  Image as ImageIcon,
  Loader2,
  Check,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

interface ShareSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    setupType: string;
  }) => Promise<void>;
  isSubmitting: boolean;
  isConnected: boolean;
  onConnectWallet: () => void;
}

export function ShareSetupModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  isConnected,
  onConnectWallet,
}: ShareSetupModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState<Category>("Minimalist");
  const [setupType, setSetupType] = useState("");
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: SamplePreset) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setImageUrl(preset.imageUrl);
    setCategory(preset.category);
    setSetupType(preset.setupType);
    setImagePreviewError(false);
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!isConnected) {
      setValidationError("Please connect your wallet first to publish your setup.");
      return;
    }

    if (!title.trim()) {
      setValidationError("Please enter a title for your setup.");
      return;
    }

    if (!imageUrl.trim()) {
      setValidationError("Please provide a direct image URL for your setup photo.");
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        category,
        setupType: setupType.trim(),
      });
      // reset form
      setTitle("");
      setDescription("");
      setImageUrl("");
      setSetupType("");
    } catch (err: any) {
      // handled by parent toast
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-card border border-card-border rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-tertiary bg-surface-primary/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
              <UploadCloud className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary font-sans">
                Publish Desk Setup
              </h2>
              <p className="text-xs text-text-secondary">
                Store your workspace inspiration immutably on Botchain
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-tertiary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Quick Presets Picker */}
          <div className="p-4 rounded-xl bg-surface-primary/80 border border-surface-tertiary">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-accent flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Curated Presets (1-Click Fill)</span>
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleApplyPreset(preset)}
                  className="flex-shrink-0 text-left px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-surface-tertiary border border-surface-tertiary hover:border-accent/40 text-xs text-text-secondary hover:text-text-primary transition-all flex items-center gap-2"
                >
                  <img
                    src={preset.imageUrl}
                    alt={preset.title}
                    className="w-5 h-5 rounded-md object-cover"
                  />
                  <span className="truncate max-w-[130px]">{preset.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
              Setup Title <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Minimalist Birch Studio, Cyber Titan Station"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-primary border border-surface-tertiary focus:border-accent focus:outline-none text-text-primary text-sm placeholder:text-text-muted transition-all"
              required
            />
          </div>

          {/* Category & Setup Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                Category <span className="text-accent">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-primary border border-surface-tertiary focus:border-accent focus:outline-none text-text-primary text-sm transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-card text-text-primary">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Setup Type */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                Setup Type <span className="text-text-muted">(Optional)</span>
              </label>
              <input
                type="text"
                value={setupType}
                onChange={(e) => setSetupType(e.target.value)}
                placeholder="e.g. Dual 4K, Ultrawide, Standing Desk"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-primary border border-surface-tertiary focus:border-accent focus:outline-none text-text-primary text-sm placeholder:text-text-muted transition-all"
              />
            </div>
          </div>

          {/* Image URL & Live Preview */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
              Preview Image URL <span className="text-accent">*</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImagePreviewError(false);
              }}
              placeholder="https://images.unsplash.com/... or direct image URL"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-primary border border-surface-tertiary focus:border-accent focus:outline-none text-text-primary text-sm placeholder:text-text-muted transition-all"
              required
            />

            {/* Live Image Thumbnail Preview */}
            {imageUrl.trim() && (
              <div className="mt-3 relative rounded-xl overflow-hidden border border-surface-tertiary bg-surface-primary h-44 flex items-center justify-center">
                {!imagePreviewError ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    onError={() => setImagePreviewError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-text-muted text-xs">
                    <ImageIcon className="w-6 h-6 text-red-400" />
                    <span className="text-red-400">Unable to load image from URL</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
              Description &amp; Gear Breakdown <span className="text-text-muted">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="List your monitors, keyboard, desk specs, lighting, and audio gear..."
              className="w-full px-4 py-2.5 rounded-xl bg-surface-primary border border-surface-tertiary focus:border-accent focus:outline-none text-text-primary text-sm placeholder:text-text-muted transition-all resize-none"
            />
          </div>

          {/* Footer Submit Action */}
          <div className="pt-4 border-t border-surface-tertiary flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-surface-primary hover:bg-surface-tertiary text-text-secondary text-sm font-medium transition-colors"
            >
              Cancel
            </button>

            {!isConnected ? (
              <button
                type="button"
                onClick={onConnectWallet}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-background font-bold text-sm shadow-accent hover:bg-accent-hover transition-all"
              >
                <span>Connect Wallet to Publish</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-background font-bold text-sm shadow-accent hover:shadow-accent-lg transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing On-Chain...</span>
                  </>
                ) : (
                  <>
                    <span>Publish to Botchain</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

