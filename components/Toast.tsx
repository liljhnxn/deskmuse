"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Loader2, X, ExternalLink } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "loading";
  title: string;
  message?: string;
  txHash?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border border-surface-tertiary bg-card/95 backdrop-blur-xl shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-5 duration-300"
          style={{
            borderLeftWidth: "4px",
            borderLeftColor:
              toast.type === "success"
                ? "#10B981"
                : toast.type === "error"
                ? "#EF4444"
                : toast.type === "loading"
                ? "#E0A458"
                : "#60A5FA",
          }}
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            {toast.type === "loading" && (
              <Loader2 className="w-5 h-5 text-accent animate-spin" />
            )}
            {toast.type === "info" && (
              <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                i
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-text-primary tracking-wide">
              {toast.title}
            </h4>
            {toast.message && (
              <p className="text-xs text-text-secondary mt-0.5 leading-relaxed break-words">
                {toast.message}
              </p>
            )}
            {toast.txHash && (
              <a
                href={`https://scan.bohr.life/tx/${toast.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover mt-1 font-mono hover:underline"
              >
                <span>View on BohrScan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

