"use client";

import React, { useState } from "react";
import { SetupItem } from "@/lib/contract";
import {
  X,
  Heart,
  Calendar,
  ExternalLink,
  Trash2,
  Tag,
  Shield,
  Layers,
  Check,
  Copy,
  AlertTriangle,
} from "lucide-react";

interface SetupDetailsModalProps {
  setup: SetupItem | null;
  onClose: () => void;
  hasLiked: boolean;
  isOwner: boolean;
  onLikeToggle: (setupId: bigint, currentStatus: boolean) => void;
  onRemoveSetup: (setupId: bigint) => void;
  isLiking?: boolean;
  isRemoving?: boolean;
}

export function SetupDetailsModal({
  setup,
  onClose,
  hasLiked,
  isOwner,
  onLikeToggle,
  onRemoveSetup,
  isLiking = false,
  isRemoving = false,
}: SetupDetailsModalProps) {
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!setup) return null;

  const formattedDate = new Date(Number(setup.createdAt) * 1000).toLocaleString(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );

  const copyAddress = () => {
    navigator.clipboard.writeText(setup.author);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-card border border-card-border rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-tertiary bg-surface-primary/80">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-mono text-xs font-semibold">
              {setup.category}
            </span>
            {setup.setupType && (
              <span className="px-3 py-1 rounded-full bg-surface-tertiary text-text-primary text-xs font-medium">
                {setup.setupType}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-tertiary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-col lg:flex-row max-h-[82vh] overflow-y-auto">
          {/* Main Visual Image */}
          <div className="lg:w-3/5 bg-surface-primary flex items-center justify-center overflow-hidden relative min-h-[300px]">
            <img
              src={setup.imageUrl}
              alt={setup.title}
              className="w-full h-full object-cover max-h-[500px]"
            />
          </div>

          {/* Details & Metadata Panel */}
          <div className="lg:w-2/5 p-6 flex flex-col justify-between bg-card space-y-6">
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-text-primary font-sans leading-tight">
                  {setup.title}
                </h2>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-text-muted">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Published on {formattedDate}</span>
                </div>
              </div>

              {/* Description & Gear Specs */}
              <div>
                <h4 className="text-xs uppercase font-mono tracking-wider text-text-muted mb-2">
                  Setup &amp; Gear Description
                </h4>
                <div className="p-4 rounded-xl bg-surface-primary/90 border border-surface-tertiary text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {setup.description || "No specific gear breakdown provided."}
                </div>
              </div>

              {/* Author & Smart Contract Info */}
              <div>
                <h4 className="text-xs uppercase font-mono tracking-wider text-text-muted mb-2">
                  Verified Creator
                </h4>
                <div className="p-3.5 rounded-xl bg-surface-primary border border-surface-tertiary flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-accent-dark flex items-center justify-center text-background font-bold text-xs">
                      {setup.author.substring(2, 4).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-text-primary font-semibold truncate">
                        {setup.author}
                      </p>
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        <span>On-Chain Verified Author</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={copyAddress}
                      title="Copy Address"
                      className="p-1.5 rounded-md hover:bg-surface-tertiary text-text-muted hover:text-text-primary transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`https://scan.bohr.life/address/${setup.author}`}
                      target="_blank"
                      rel="noreferrer"
                      title="View on BohrScan"
                      className="p-1.5 rounded-md hover:bg-surface-tertiary text-text-muted hover:text-accent transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Like & Delete */}
            <div className="pt-4 border-t border-surface-tertiary space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onLikeToggle(setup.id, hasLiked)}
                  disabled={isLiking}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold text-sm transition-all border ${
                    hasLiked
                      ? "bg-red-500/15 border-red-500/40 text-red-400 shadow-sm"
                      : "bg-surface-primary border-surface-tertiary text-text-primary hover:border-red-400/40 hover:text-red-400"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${hasLiked ? "fill-red-400 text-red-400" : ""}`}
                  />
                  <span>
                    {hasLiked ? "Liked" : "Like Setup"} ({setup.likesCount.toString()})
                  </span>
                </button>

                {isOwner && !confirmDelete && (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="p-3 rounded-xl bg-surface-primary border border-surface-tertiary text-text-muted hover:text-red-400 hover:border-red-400/40 transition-colors"
                    title="Remove your setup from the smart contract"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Owner Delete Confirmation */}
              {isOwner && confirmDelete && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-red-400 font-semibold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Permanently remove this setup on-chain?</span>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="px-3 py-1.5 rounded-lg bg-surface-primary text-text-secondary hover:text-text-primary text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onRemoveSetup(setup.id);
                        onClose();
                      }}
                      disabled={isRemoving}
                      className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-xs transition-colors"
                    >
                      {isRemoving ? "Removing..." : "Confirm Removal"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

