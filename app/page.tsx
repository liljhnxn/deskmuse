"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useConnect,
} from "wagmi";
import {
  DESK_MUSE_ABI,
  DEFAULT_CONTRACT_ADDRESS,
  SetupItem,
  CATEGORIES,
} from "@/lib/contract";
import { botchain } from "@/lib/config";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FilterBar } from "@/components/FilterBar";
import { SetupCard } from "@/components/SetupCard";
import { SetupDetailsModal } from "@/components/SetupDetailsModal";
import { ShareSetupModal } from "@/components/ShareSetupModal";
import { ToastContainer, ToastMessage } from "@/components/Toast";
import {
  Sparkles,
  Inbox,
  Loader2,
  Compass,
  ArrowRight,
  Plus,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();

  // State management
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showOnlyMine, setShowOnlyMine] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"newest" | "likes">("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [activeSetupModal, setActiveSetupModal] = useState<SetupItem | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [contractAddress, setContractAddress] = useState<`0x${string}`>(DEFAULT_CONTRACT_ADDRESS);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    type: "success" | "error" | "info" | "loading",
    title: string,
    message?: string,
    txHash?: string
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message, txHash }]);
    if (type !== "loading") {
      setTimeout(() => {
        dismissToast(id);
      }, 6000);
    }
    return id;
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Wagmi Read Contracts
  const {
    data: setupsData,
    isLoading: isLoadingSetups,
    refetch: refetchSetups,
    error: setupsError,
  } = useReadContract({
    address: contractAddress,
    abi: DESK_MUSE_ABI,
    functionName: "getAllSetups",
  });

  const { data: totalLikesData, refetch: refetchLikes } = useReadContract({
    address: contractAddress,
    abi: DESK_MUSE_ABI,
    functionName: "totalLikes",
  });

  const { data: totalSetupsData, refetch: refetchTotals } = useReadContract({
    address: contractAddress,
    abi: DESK_MUSE_ABI,
    functionName: "totalSetups",
  });

  const { data: userLikedData, refetch: refetchUserLikes } = useReadContract({
    address: contractAddress,
    abi: DESK_MUSE_ABI,
    functionName: "getUserLikedSetups",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
    },
  });

  // Wagmi Write Contracts
  const {
    writeContractAsync,
    isPending: isWritePending,
    data: pendingTxHash,
  } = useWriteContract();

  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Set of setup IDs liked by the current user
  const userLikedIds = useMemo(() => {
    if (!userLikedData) return new Set<string>();
    const ids = userLikedData as readonly bigint[];
    return new Set(ids.map((id) => id.toString()));
  }, [userLikedData]);

  // Transform and normalize on-chain setups
  const rawSetups: SetupItem[] = useMemo(() => {
    if (!setupsData || !Array.isArray(setupsData)) return [];
    return setupsData as SetupItem[];
  }, [setupsData]);

  // Filter and sort setups
  const filteredSetups = useMemo(() => {
    let list = [...rawSetups];

    // Filter by category
    if (selectedCategory !== "All") {
      list = list.filter(
        (s) => s.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by author (My Setups)
    if (showOnlyMine && address) {
      list = list.filter(
        (s) => s.author.toLowerCase() === address.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.setupType.toLowerCase().includes(q) ||
          s.author.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === "likes") {
      list.sort((a, b) => Number(b.likesCount - a.likesCount));
    } else {
      list.sort((a, b) => Number(b.createdAt - a.createdAt));
    }

    return list;
  }, [rawSetups, selectedCategory, showOnlyMine, searchQuery, sortBy, address]);

  // Count of user's setups
  const mySetupsCount = useMemo(() => {
    if (!address) return 0;
    return rawSetups.filter(
      (s) => s.author.toLowerCase() === address.toLowerCase()
    ).length;
  }, [rawSetups, address]);

  const totalSetupsDisplay = totalSetupsData ? Number(totalSetupsData) : rawSetups.length;
  const totalLikesDisplay = totalLikesData ? Number(totalLikesData) : 0;

  // Refresh all contract state
  const handleRefresh = async () => {
    await Promise.all([refetchSetups(), refetchLikes(), refetchTotals(), refetchUserLikes()]);
    addToast("info", "Refreshed", "Workspace feed synced with Botchain Testnet");
  };

  // Handle Publish Setup
  const handlePublishSetup = async (formData: {
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    setupType: string;
  }) => {
    const loadingToastId = addToast(
      "loading",
      "Publishing Setup...",
      "Please confirm transaction in your MetaMask wallet"
    );

    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: DESK_MUSE_ABI,
        functionName: "publishSetup",
        args: [
          formData.title,
          formData.description,
          formData.imageUrl,
          formData.category,
          formData.setupType,
        ],
      });

      dismissToast(loadingToastId);
      addToast(
        "success",
        "Setup Published Successfully!",
        `Your workspace is now live on Botchain.`,
        hash
      );

      setIsShareModalOpen(false);
      // Refetch after brief block inclusion delay
      setTimeout(() => {
        handleRefresh();
      }, 2500);
    } catch (err: any) {
      dismissToast(loadingToastId);
      const errMsg = err?.shortMessage || err?.message || "Transaction was rejected or failed.";
      addToast("error", "Failed to Publish Setup", errMsg);
      throw err;
    }
  };

  // Handle Like / Unlike
  const handleLikeToggle = async (setupId: bigint, currentStatus: boolean) => {
    if (!isConnected) {
      addToast("info", "Wallet Required", "Please connect MetaMask to appreciate setups.");
      const injectedConnector = connectors.find((c) => c.id === "injected" || c.name === "MetaMask") || connectors[0];
      if (injectedConnector) connect({ connector: injectedConnector });
      return;
    }

    const action = currentStatus ? "unlikeSetup" : "likeSetup";
    const actionLabel = currentStatus ? "Removing Like..." : "Appreciating Setup...";

    const loadingToastId = addToast("loading", actionLabel, "Confirm in your wallet");

    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: DESK_MUSE_ABI,
        functionName: action,
        args: [setupId],
      });

      dismissToast(loadingToastId);
      addToast(
        "success",
        currentStatus ? "Like Removed" : "Setup Appreciated!",
        undefined,
        hash
      );

      setTimeout(() => {
        handleRefresh();
      }, 2000);
    } catch (err: any) {
      dismissToast(loadingToastId);
      const errMsg = err?.shortMessage || err?.message || "Action failed.";
      addToast("error", "Transaction Failed", errMsg);
    }
  };

  // Handle Remove Setup
  const handleRemoveSetup = async (setupId: bigint) => {
    const loadingToastId = addToast(
      "loading",
      "Removing Setup...",
      "Submitting removal transaction on Botchain"
    );

    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: DESK_MUSE_ABI,
        functionName: "removeSetup",
        args: [setupId],
      });

      dismissToast(loadingToastId);
      addToast(
        "success",
        "Setup Removed",
        "Your setup has been permanently removed from the contract.",
        hash
      );

      setActiveSetupModal(null);
      setTimeout(() => {
        handleRefresh();
      }, 2000);
    } catch (err: any) {
      dismissToast(loadingToastId);
      const errMsg = err?.shortMessage || err?.message || "Failed to remove setup.";
      addToast("error", "Removal Failed", errMsg);
    }
  };

  const handleConnect = () => {
    const injectedConnector = connectors.find((c) => c.id === "injected" || c.name === "MetaMask") || connectors[0];
    if (injectedConnector) connect({ connector: injectedConnector });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-accent selection:text-background">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Header & Navigation */}
      <Navbar
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onMySetupsClick={() => {
          setShowOnlyMine(true);
          setSelectedCategory("All");
          const el = document.getElementById("gallery-section");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
        totalSetupsCount={rawSetups.length}
      />

      {/* Hero Section */}
      <Hero
        totalSetups={totalSetupsDisplay}
        totalLikes={totalLikesDisplay}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onExploreClick={() => {
          const el = document.getElementById("gallery-section");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Main Explore Section */}
      <main id="gallery-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-accent text-xs font-mono uppercase tracking-widest font-semibold">
              <Compass className="w-4 h-4" />
              <span>Explore Workspaces</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-1 font-sans">
              {showOnlyMine ? "My Published Setups" : "Community Setup Gallery"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-card-border hover:border-accent/40 text-text-secondary hover:text-text-primary text-xs font-medium transition-all"
              title="Refresh on-chain data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSetups ? "animate-spin text-accent" : ""}`} />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          showOnlyMine={showOnlyMine}
          onToggleMine={setShowOnlyMine}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isConnected={isConnected}
          mySetupsCount={mySetupsCount}
        />

        {/* Setup Gallery Grid */}
        {isLoadingSetups ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
            <p className="text-text-primary font-semibold text-lg">Querying Botchain Testnet...</p>
            <p className="text-text-secondary text-xs mt-1">Retrieving workspace setups from smart contract</p>
          </div>
        ) : filteredSetups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSetups.map((setup) => {
              const idStr = setup.id.toString();
              const hasLiked = userLikedIds.has(idStr);
              const isOwner = Boolean(
                address && setup.author.toLowerCase() === address.toLowerCase()
              );

              return (
                <SetupCard
                  key={idStr}
                  setup={setup}
                  hasLiked={hasLiked}
                  isOwner={isOwner}
                  onLikeToggle={handleLikeToggle}
                  onSelect={(item) => setActiveSetupModal(item)}
                  isLiking={isWritePending}
                />
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 px-4 rounded-3xl bg-card/60 border border-card-border text-center max-w-xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-surface-primary border border-surface-tertiary flex items-center justify-center mx-auto text-accent mb-4 shadow-sm">
              <Inbox className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-bold text-text-primary font-sans">
              {showOnlyMine
                ? "You haven't published any setups yet"
                : "No setups found in this view"}
            </h3>
            <p className="text-sm text-text-secondary mt-2 max-w-sm mx-auto leading-relaxed">
              {showOnlyMine
                ? "Share your workspace setup with the community and earn on-chain appreciations."
                : searchQuery
                ? "Try adjusting your search keywords or clear your category filter."
                : "Be the pioneer creator to publish the first desk setup on Botchain Testnet!"}
            </p>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-background font-bold text-sm shadow-accent hover:bg-accent-hover transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Share Your Setup</span>
            </button>
          </div>
        )}
      </main>

      {/* Share Setup Modal */}
      <ShareSetupModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onSubmit={handlePublishSetup}
        isSubmitting={isWritePending}
        isConnected={isConnected}
        onConnectWallet={handleConnect}
      />

      {/* Setup Details Modal */}
      <SetupDetailsModal
        setup={activeSetupModal}
        onClose={() => setActiveSetupModal(null)}
        hasLiked={activeSetupModal ? userLikedIds.has(activeSetupModal.id.toString()) : false}
        isOwner={
          Boolean(
            address &&
              activeSetupModal &&
              activeSetupModal.author.toLowerCase() === address.toLowerCase()
          )
        }
        onLikeToggle={handleLikeToggle}
        onRemoveSetup={handleRemoveSetup}
        isLiking={isWritePending}
        isRemoving={isWritePending}
      />

      {/* Footer */}
      <footer className="mt-20 border-t border-surface-tertiary/60 bg-surface-primary/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-lg font-bold text-text-primary font-sans">
              Desk<span className="text-accent">Muse</span>
            </span>
            <p className="text-xs text-text-secondary mt-1">
              "Show Your Setup. Inspire Others." &bull; Decentralized Workspace Platform
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-text-secondary">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Botchain Testnet (968)</span>
            </span>
            <span>&bull;</span>
            <a
              href="https://scan.bohr.life"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent transition-colors"
            >
              BohrScan Explorer
            </a>
            <span>&bull;</span>
            <a
              href="https://rpc.bohr.life"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent transition-colors"
            >
              RPC Endpoint
            </a>
          </div>

          <div className="text-xs text-text-muted">
            100% On-Chain &bull; Single-Contract Architecture
          </div>
        </div>
      </footer>
    </div>
  );
}

