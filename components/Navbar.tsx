"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { botchain } from "@/lib/config";
import {
  Monitor,
  Plus,
  Wallet,
  LogOut,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  Layers,
  Sparkles,
} from "lucide-react";

interface NavbarProps {
  onOpenShareModal: () => void;
  onMySetupsClick?: () => void;
  totalSetupsCount?: number;
}

export function Navbar({ onOpenShareModal, onMySetupsClick, totalSetupsCount }: NavbarProps) {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isWrongNetwork = isConnected && chain?.id !== botchain.id;

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnect = () => {
    const injectedConnector = connectors.find((c) => c.id === "injected" || c.name === "MetaMask") || connectors[0];
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent via-accent-hover to-accent-dark flex items-center justify-center text-background shadow-accent transition-transform duration-300 group-hover:scale-105">
                <Monitor className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-text-primary font-sans">
                    Desk<span className="text-accent">Muse</span>
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-surface-tertiary text-accent font-semibold tracking-wider border border-accent/20">
                    Web3
                  </span>
                </div>
                <span className="text-xs text-text-secondary hidden sm:inline tracking-wide">
                  Show Your Setup. Inspire Others.
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Network Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-primary border border-surface-tertiary text-xs font-medium">
              <span
                className={`w-2 h-2 rounded-full ${
                  isWrongNetwork ? "bg-red-500 animate-ping" : "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                }`}
              />
              <span className="text-text-secondary">
                {isWrongNetwork ? "Switch to Botchain" : "Botchain Testnet (968)"}
              </span>
              {isWrongNetwork && (
                <button
                  onClick={() => switchChain({ chainId: botchain.id })}
                  className="ml-1 text-accent font-semibold hover:underline"
                >
                  Switch
                </button>
              )}
            </div>

            {/* Share Setup Button */}
            <button
              onClick={onOpenShareModal}
              className="relative group overflow-hidden flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent via-accent-hover to-accent-dark text-background font-semibold text-sm shadow-accent transition-all duration-300 hover:shadow-accent-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Share Setup</span>
              <span className="sm:hidden">Share</span>
            </button>

            {/* Wallet Button / Dropdown */}
            {!isConnected ? (
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-card-border hover:border-accent/50 text-text-primary font-medium text-sm transition-all duration-300 hover:bg-card-hover"
              >
                <Wallet className="w-4 h-4 text-accent" />
                <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-card-border hover:border-accent/40 text-text-primary text-sm font-medium transition-all"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="font-mono text-xs">{truncateAddress(address!)}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-xl bg-card border border-surface-tertiary p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-surface-tertiary/60">
                      <p className="text-[11px] text-text-secondary uppercase tracking-wider font-mono">
                        Connected Wallet
                      </p>
                      <p className="font-mono text-xs text-text-primary font-medium truncate mt-1">
                        {address}
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={copyAddress}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-primary rounded-lg transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? "Address Copied!" : "Copy Address"}</span>
                        </span>
                      </button>

                      <a
                        href={`https://scan.bohr.life/address/${address}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-between px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-primary rounded-lg transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View on Explorer</span>
                        </span>
                      </a>

                      {onMySetupsClick && (
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            onMySetupsClick();
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-accent hover:bg-surface-primary rounded-lg transition-colors font-medium"
                        >
                          <span className="flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5" />
                            <span>My Desk Setups</span>
                          </span>
                        </button>
                      )}

                      <div className="my-1 border-t border-surface-tertiary/60" />

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          disconnect();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Disconnect</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

