"use client";

import React, { useState } from "react";
import { SetupItem } from "@/lib/contract";
import { Heart, Calendar, User, ExternalLink, Maximize2, Tag } from "lucide-react";

interface SetupCardProps {
  setup: SetupItem;
  hasLiked: boolean;
  isOwner: boolean;
  onLikeToggle: (setupId: bigint, currentStatus: boolean) => void;
  onSelect: (setup: SetupItem) => void;
  isLiking?: boolean;
}

export function SetupCard({
  setup,
  hasLiked,
  isOwner,
  onLikeToggle,
  onSelect,
  isLiking = false,
}: SetupCardProps) {
  const [imageError, setImageError] = useState(false);

  const formattedDate = new Date(Number(setup.createdAt) * 1000).toLocaleDateString(
    undefined,
    { month: "short", day: "numeric", year: "numeric" }
  );

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLikeToggle(setup.id, hasLiked);
  };

  return (
    <div
      onClick={() => onSelect(setup)}
      className="group relative rounded-2xl bg-card border border-card-border hover:border-accent/40 shadow-card hover:shadow-accent transition-all duration-300 flex flex-col overflow-hidden cursor-pointer hover:-translate-y-1.5"
    >
      {/* Photography Preview */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-primary">
        {!imageError ? (
          <img
            src={setup.imageUrl}
            alt={setup.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-surface-primary text-text-muted">
            <span className="text-xs">Setup photo unavailable</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-surface-primary/80 backdrop-blur-md border border-accent/20 text-accent font-mono text-[11px] font-semibold tracking-wide">
            {setup.category}
          </span>

          {setup.setupType && (
            <span className="px-2.5 py-1 rounded-full bg-card/85 backdrop-blur-md border border-surface-tertiary text-text-primary text-[11px] font-medium truncate max-w-[150px]">
              {setup.setupType}
            </span>
          )}
        </div>

        {/* Floating Quick Expand Icon */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="p-2 rounded-xl bg-surface-primary/80 backdrop-blur-md border border-surface-tertiary text-accent">
            <Maximize2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-1 font-sans">
            {setup.title}
          </h3>

          {/* Description snippet */}
          {setup.description && (
            <p className="mt-2 text-xs text-text-secondary line-clamp-2 leading-relaxed">
              {setup.description}
            </p>
          )}
        </div>

        {/* Card Footer Details */}
        <div className="mt-4 pt-4 border-t border-surface-tertiary/60 flex items-center justify-between text-xs text-text-secondary">
          {/* Author */}
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-accent/70" />
            <span className="hover:text-text-primary">
              {isOwner ? "You" : truncateAddress(setup.author)}
            </span>
          </div>

          {/* Likes & Date */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px] text-text-muted">
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
            </div>

            {/* Like Button */}
            <button
              onClick={handleLikeClick}
              disabled={isLiking}
              title={hasLiked ? "Unlike setup" : "Like setup"}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                hasLiked
                  ? "bg-red-500/15 border-red-500/40 text-red-400 font-semibold"
                  : "bg-surface-primary border-surface-tertiary text-text-secondary hover:text-red-400 hover:border-red-400/40"
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  hasLiked ? "fill-red-400 text-red-400 scale-110" : ""
                }`}
              />
              <span className="font-mono text-xs font-bold">{setup.likesCount.toString()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

