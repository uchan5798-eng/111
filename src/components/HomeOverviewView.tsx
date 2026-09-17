import React from "react";
import { Match, MatchPain, MatchImage, PlayerProfile, ActiveTab } from "../types";
import { BODY_PARTS_INFO, SIDE_LABELS, getPainColor } from "../data/bodyParts";
import { Calendar, Shield, AlertCircle, Plus, Sparkles, Image as ImageIcon, ArrowRight, Activity, CheckCircle2, ChevronRight, User } from "lucide-react";

interface HomeOverviewViewProps {
  playerProfile: PlayerProfile;
  matches: Match[];
  pains: MatchPain[];
  images: MatchImage[];
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenNewMatchModal: () => void;
  onOpenDetailModal: (match: Match) => void;
}

export const HomeOverviewView: React.FC<HomeOverviewViewProps> = ({
  playerProfile,
  matches,
  pains,
  images,
  onNavigateTab,
  onOpenNewMatchModal,
  onOpenDetailModal,
}) => {
  const latestMatch = matches[0];
  const latestMatchPains = latestMatch
    ? pains.filter((p) => p.matchId === latestMatch.id)
    : [];

  const painMatchesCount = matches.filter((m) => m.hasPain).length;

  return (
    <div id="home-overview-view" className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-rose-300 backdrop-blur-xs">
              <span>선수 전용 피지컬 & 통증 관리 허브</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              반갑습니다, {playerProfile.name} 선수
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              경기 후 발생한 신체 부위별 통증을 실루엣으로 정밀하게 기록하고,
              부상 예방 및 빠른 회복을 위한 AI 맞춤 가이드를 확인하세요.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenNewMatchModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>새 경기 통증 기록하기</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab("ai")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              <span>AI 회복 추천 바로가기</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Matches Recorded */}
        <div
          onClick={() => onNavigateTab("matches")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">총 기록 경기</span>
            <Calendar className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{matches.length}경기</div>
          <p className="text-[11px] text-slate-400 mt-1">최근 등록된 경기 목록 확인</p>
        </div>

        {/* Pain Incidents */}
        <div
          onClick={() => onNavigateTab("matches")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">통증 기록 경기</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">{painMatchesCount}경기</div>
          <p className="text-[11px] text-slate-400 mt-1">신체 통증 발생 경기 비율</p>
        </div>

        {/* Total Pain Points Tracked */}
        <div
          onClick={() => onNavigateTab("ai")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">누적 통증 부위</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{pains.length}곳</div>
          <p className="text-[11px] text-slate-400 mt-1">부위별 상세 강도 및 시점</p>
        </div>

        {/* Photos Attached */}
        <div
          onClick={() => onNavigateTab("images")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">통증 관련 사진</span>
            <ImageIcon className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{images.length}장</div>
          <p className="text-[11px] text-slate-400 mt-1">다운로드 및 갤러리 관리</p>
        </div>
      </div>

      {/* Latest Match Spotlight & Recent Pain Points */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Latest Match Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                <h3 className="text-base font-bold text-slate-900">최근 경기 통증 현황</h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab("matches")}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-0.5"
              >
                <span>전체 보기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {latestMatch ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block mb-0.5">
                      {latestMatch.matchDate.replace(/-/g, ".")}
                    </span>
                    <h4 className="text-xl font-black text-slate-900">
                      vs {latestMatch.opponent}
                    </h4>
                  </div>
                  {latestMatch.hasPain ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      통증 발생 ({latestMatchPains.length}곳)
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      통증 없음
                    </span>
                  )}
                </div>

                {latestMatchPains.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-semibold text-slate-500">
                      발생 통증 부위 및 통증 정도
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {latestMatchPains.map((p) => {
                        const partInfo = BODY_PARTS_INFO[p.bodyPart] || BODY_PARTS_INFO.thigh;
                        const sideLabel = p.side ? SIDE_LABELS[p.side] : "";
                        const color = getPainColor(p.painLevel);

                        return (
                          <div
                            key={p.id}
                            className={`p-3 rounded-xl border ${color.border} ${color.bg} flex items-center justify-between`}
                          >
                            <span className="text-xs font-bold text-slate-900">
                              {sideLabel} {partInfo.label}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-xs font-black rounded-md bg-white ${color.text} border ${color.border}`}
                            >
                              {p.painLevel} / 10
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {latestMatch.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {latestMatch.notes}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-8 text-center">
                등록된 경기가 없습니다.
              </p>
            )}
          </div>

          {latestMatch && (
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onOpenDetailModal(latestMatch)}
                className="text-xs font-bold text-slate-900 hover:text-rose-600 flex items-center gap-1"
              >
                <span>이 경기 상세보기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onOpenNewMatchModal}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                + 다음 경기 기록하기
              </button>
            </div>
          )}
        </div>

        {/* Quick Athlete Profile Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-700" />
                <h3 className="text-base font-bold text-slate-900">선수 개인 프로필</h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab("profile")}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-0.5"
              >
                <span>포트폴리오 보기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={playerProfile.photoUrl}
                alt={playerProfile.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900">
                    {playerProfile.name}
                  </h4>
                  <span className="text-xs font-extrabold text-rose-600">
                    #{playerProfile.number}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {playerProfile.position} · {playerProfile.affiliation}
                </p>
                <p className="text-[11px] text-slate-400">
                  {playerProfile.height}cm / {playerProfile.weight}kg · {playerProfile.dominantFoot}
                </p>
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800 block mb-1">컨디셔닝 철학</span>
              {playerProfile.trainingRoutine}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              선수 사진 및 개인 프로필 중심 포트폴리오
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab("profile")}
              className="text-xs font-bold text-slate-900 hover:text-rose-600"
            >
              프로필 관리 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
