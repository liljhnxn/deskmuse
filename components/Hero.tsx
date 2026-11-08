"use client";

import React from "react";
import { Sparkles, Heart, Compass, Plus, ShieldCheck, Flame } from "lucide-react";

interface HeroProps {
  totalSetups: number;
  totalLikes: number;
  onOpenShareModal: () => void;
  onExploreClick: () => void;
}

export function Hero({
  totalSetups,
  totalLikes,
  onOpenShareModal,
  onExploreClick,
}: HeroProps) {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-surface-tertiary/40">
      {/* Decorative ambient radial gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-accent/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Magazine Tag Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-secondary border border-accent/30 text-accent text-xs font-mono tracking-wider uppercase mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span>Decentralized Workspace Magazine &bull; Botchain Testnet</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.08] font-sans">
            Build Your Space. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-hover to-accent-light">
              Find Your Inspiration.
            </span>
          </h1>

          {/* Tagline / Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Showcase your battle station, minimalist sanctuary, or creative craft studio on-chain.
            Discover curated equipment, layout ergonomics, and peer-appreciated desk aesthetics.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenShareModal}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-background font-bold text-base shadow-accent glow-accent-hover transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Share Your Setup</span>
            </button>

            <button
              onClick={onExploreClick}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-card hover:bg-card-hover border border-card-border text-text-primary font-semibold text-base transition-all duration-300 hover:border-accent/40"
            >
              <Compass className="w-5 h-5 text-accent" />
              <span>Explore Gallery</span>
            </button>
          </div>

          {/* Live On-Chain Counter Cards */}
          <div className="mt-14 sm:mt-16 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {/* Counter 1: Total Setups */}
            <div className="glass-panel p-5 rounded-2xl text-center group hover:border-accent/40 transition-all duration-300">
              <div className="flex items-center justify-center gap-2 text-text-secondary text-xs font-mono uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4 text-accent" />
                <span>Published Setups</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-text-primary font-sans group-hover:text-accent transition-colors">
                {totalSetups}
              </div>
              <p className="text-[11px] text-text-muted mt-1">Verified on Botchain</p>
            </div>

            {/* Counter 2: Total Likes */}
            <div className="glass-panel p-5 rounded-2xl text-center group hover:border-accent/40 transition-all duration-300">
              <div className="flex items-center justify-center gap-2 text-text-secondary text-xs font-mono uppercase tracking-wider mb-1">
                <Heart className="w-4 h-4 text-red-400 fill-red-400/20" />
                <span>Total Likes</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-text-primary font-sans group-hover:text-accent transition-colors">
                {totalLikes}
              </div>
              <p className="text-[11px] text-text-muted mt-1">Community appreciations</p>
            </div>

            {/* Counter 3: Network & Immutability */}
            <div className="glass-panel p-5 rounded-2xl text-center col-span-2 md:col-span-1 group hover:border-accent/40 transition-all duration-300">
              <div className="flex items-center justify-center gap-2 text-text-secondary text-xs font-mono uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>On-Chain Storage</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-sans">
                100%
              </div>
              <p className="text-[11px] text-text-muted mt-1">No database or backend</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

