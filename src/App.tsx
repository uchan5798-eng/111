import React, { useState, useEffect } from "react";
import { Match, MatchPain, MatchImage, PlayerProfile, ActiveTab } from "./types";
import {
  INITIAL_MATCHES,
  INITIAL_PAINS,
  INITIAL_IMAGES,
  INITIAL_PLAYER_PROFILE,
} from "./data/initialData";
import { HomeOverviewView } from "./components/HomeOverviewView";
import { PlayerProfileView } from "./components/PlayerProfileView";
import { MatchListView } from "./components/MatchListView";
import { ImageGalleryView } from "./components/ImageGalleryView";
import { AiRecommendationView } from "./components/AiRecommendationView";
import { MatchFormModal } from "./components/MatchFormModal";
import { MatchDetailModal } from "./components/MatchDetailModal";
import {
  Home,
  User,
  Activity,
  Download,
  Sparkles,
  Plus,
  Shield,
  Menu,
  X,
} from "lucide-react";

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Persistent State
  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem("athlete_matches_v2");
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [pains, setPains] = useState<MatchPain[]>(() => {
    const saved = localStorage.getItem("athlete_pains_v2");
    return saved ? JSON.parse(saved) : INITIAL_PAINS;
  });

  const [images, setImages] = useState<MatchImage[]>(() => {
    const saved = localStorage.getItem("athlete_images_v2");
    return saved ? JSON.parse(saved) : INITIAL_IMAGES;
  });

  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(() => {
    const saved = localStorage.getItem("athlete_profile_v2");
    return saved ? JSON.parse(saved) : INITIAL_PLAYER_PROFILE;
  });

  // Modals
  const [isMatchFormOpen, setIsMatchFormOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<Match | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("athlete_matches_v2", JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem("athlete_pains_v2", JSON.stringify(pains));
  }, [pains]);

  useEffect(() => {
    localStorage.setItem("athlete_images_v2", JSON.stringify(images));
  }, [images]);

  useEffect(() => {
    localStorage.setItem("athlete_profile_v2", JSON.stringify(playerProfile));
  }, [playerProfile]);

  // Match Save Handler
  const handleSaveMatch = (
    savedMatch: Match,
    savedPains: MatchPain[],
    savedImages: MatchImage[]
  ) => {
    // 1. Update Match
    setMatches((prev) => {
      const exists = prev.some((m) => m.id === savedMatch.id);
      if (exists) {
        return prev.map((m) => (m.id === savedMatch.id ? savedMatch : m));
      }
      return [savedMatch, ...prev];
    });

    // 2. Update Pains (replace all pains for this match)
    setPains((prev) => {
      const filtered = prev.filter((p) => p.matchId !== savedMatch.id);
      return [...savedPains, ...filtered];
    });

    // 3. Update Images (append new ones)
    setImages((prev) => {
      const otherImages = prev.filter((img) => img.matchId !== savedMatch.id);
      return [...savedImages, ...otherImages];
    });

    setEditingMatch(null);
    setIsMatchFormOpen(false);

    // If detail modal was open for this match, refresh it
    if (selectedMatchForDetail?.id === savedMatch.id) {
      setSelectedMatchForDetail(savedMatch);
    }
  };

  // Match Delete Handler
  const handleDeleteMatch = (matchId: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== matchId));
    setPains((prev) => prev.filter((p) => p.matchId !== matchId));
    setImages((prev) => prev.filter((img) => img.matchId !== matchId));
    if (selectedMatchForDetail?.id === matchId) {
      setIsDetailModalOpen(false);
      setSelectedMatchForDetail(null);
    }
  };

  // Image Delete Handler
  const handleDeleteImage = (imgId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imgId));
  };

  // Image Direct Upload Handler
  const handleUploadSingleImage = (newImg: MatchImage) => {
    setImages((prev) => [newImg, ...prev]);
  };

  const navItems = [
    { id: "home", label: "홈", icon: Home },
    { id: "profile", label: "개인 프로필", icon: User },
    { id: "matches", label: "경기 기록", icon: Activity },
    { id: "images", label: "이미지 다운로드", icon: Download },
    { id: "ai", label: "AI 추천", icon: Sparkles },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-rose-500 selection:text-white">
      {/* Top Global Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div
              onClick={() => setActiveTab("home")}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-xs">
                <span>ATH</span>
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-none">
                  경기별 통증 기록
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {playerProfile.name} 선수 · {playerProfile.affiliation}
                </span>
              </div>
            </div>

            {/* Desktop Navigation Tabs (홈 / 개인 프로필 / 경기 기록 / 이미지 다운로드 / AI 추천) */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-white text-slate-950 shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isActive ? "text-rose-600" : "text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Quick Action Button */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingMatch(null);
                  setIsMatchFormOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>경기 기록 등록</span>
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? "bg-rose-50 text-rose-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setEditingMatch(null);
                  setIsMatchFormOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl"
              >
                <Plus className="w-4 h-4" />
                <span>새 경기 통증 기록</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === "home" && (
          <HomeOverviewView
            playerProfile={playerProfile}
            matches={matches}
            pains={pains}
            images={images}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenNewMatchModal={() => {
              setEditingMatch(null);
              setIsMatchFormOpen(true);
            }}
            onOpenDetailModal={(m) => {
              setSelectedMatchForDetail(m);
              setIsDetailModalOpen(true);
            }}
          />
        )}

        {activeTab === "profile" && (
          <PlayerProfileView
            profile={playerProfile}
            onUpdateProfile={(updated) => setPlayerProfile(updated)}
          />
        )}

        {activeTab === "matches" && (
          <MatchListView
            matches={matches}
            pains={pains}
            images={images}
            onOpenNewMatchModal={() => {
              setEditingMatch(null);
              setIsMatchFormOpen(true);
            }}
            onOpenDetailModal={(m) => {
              setSelectedMatchForDetail(m);
              setIsDetailModalOpen(true);
            }}
          />
        )}

        {activeTab === "images" && (
          <ImageGalleryView
            images={images}
            matches={matches}
            pains={pains}
            onDeleteImage={handleDeleteImage}
            onUploadImage={handleUploadSingleImage}
          />
        )}

        {activeTab === "ai" && (
          <AiRecommendationView
            matches={matches}
            pains={pains}
            playerProfile={playerProfile}
          />
        )}
      </main>

      {/* Global Modals */}
      {/* 1. Match Form Modal (Studio Silhouette Flow inside Match Registration) */}
      <MatchFormModal
        isOpen={isMatchFormOpen}
        onClose={() => {
          setIsMatchFormOpen(false);
          setEditingMatch(null);
        }}
        onSave={handleSaveMatch}
        initialMatch={editingMatch}
        initialPains={
          editingMatch ? pains.filter((p) => p.matchId === editingMatch.id) : []
        }
        initialImages={
          editingMatch ? images.filter((img) => img.matchId === editingMatch.id) : []
        }
      />

      {/* 2. Match Detail Modal */}
      <MatchDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedMatchForDetail(null);
        }}
        match={selectedMatchForDetail}
        pains={
          selectedMatchForDetail
            ? pains.filter((p) => p.matchId === selectedMatchForDetail.id)
            : []
        }
        images={
          selectedMatchForDetail
            ? images.filter((img) => img.matchId === selectedMatchForDetail.id)
            : []
        }
        onEdit={(m) => {
          setIsDetailModalOpen(false);
          setEditingMatch(m);
          setIsMatchFormOpen(true);
        }}
        onDelete={handleDeleteMatch}
        onDeleteImage={handleDeleteImage}
      />

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white/70 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>경기별 통증 부위 기록 및 선수 프로필 관리 시스템</span>
          <span className="text-[11px] text-slate-400">
            의료적 판단이 필요한 경우 반드시 전문 의료진 상담을 권장합니다.
          </span>
        </div>
      </footer>
    </div>
  );
}
