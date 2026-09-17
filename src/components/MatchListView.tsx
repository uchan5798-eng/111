import React, { useState } from "react";
import { Match, MatchPain, MatchImage } from "../types";
import { BODY_PARTS_INFO, SIDE_LABELS, getPainColor } from "../data/bodyParts";
import { Plus, Calendar, MapPin, Shield, Eye, AlertCircle, CheckCircle2, Image as ImageIcon, Search, Filter } from "lucide-react";

interface MatchListViewProps {
  matches: Match[];
  pains: MatchPain[];
  images: MatchImage[];
  onOpenNewMatchModal: () => void;
  onOpenDetailModal: (match: Match) => void;
}

export const MatchListView: React.FC<MatchListViewProps> = ({
  matches,
  pains,
  images,
  onOpenNewMatchModal,
  onOpenDetailModal,
}) => {
  const [filterType, setFilterType] = useState<"all" | "pain" | "no-pain">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMatches = matches
    .filter((m) => {
      if (filterType === "pain") return m.hasPain;
      if (filterType === "no-pain") return !m.hasPain;
      return true;
    })
    .filter((m) => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        m.opponent.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q) ||
        m.matchDate.includes(q) ||
        m.notes.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime());

  return (
    <div id="match-list-view" className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
            <h2 className="text-xl font-bold text-slate-900">경기별 통증 기록</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            경기마다 발생한 신체 부위별 통증 강도(VAS)와 관련 사진을 기록하고 추적합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewMatchModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>새 경기 기록 등록</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="상대팀, 경기 장소 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-stretch sm:self-auto justify-center">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterType === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            전체 ({matches.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("pain")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterType === "pain"
                ? "bg-white text-rose-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            통증 발생 ({matches.filter((m) => m.hasPain).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("no-pain")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterType === "no-pain"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            통증 없음 ({matches.filter((m) => !m.hasPain).length})
          </button>
        </div>
      </div>

      {/* Match Cards Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMatches.map((match) => {
            const matchPains = pains.filter((p) => p.matchId === match.id);
            const matchImages = images.filter((img) => img.matchId === match.id);
            const highestPain = matchPains.length > 0
              ? Math.max(...matchPains.map((p) => p.painLevel))
              : 0;

            return (
              <div
                key={match.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top / Header */}
                <div className="p-5 border-b border-slate-100 bg-linear-to-b from-slate-50/50 to-transparent">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {match.matchDate.replace(/-/g, ".")}
                    </span>

                    {match.hasPain ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertCircle className="w-3 h-3" />
                        <span>통증 {matchPains.length}곳</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>통증 없음</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between mt-1">
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-slate-800 transition-colors flex items-center gap-1.5">
                      <span>상대팀:</span>
                      <span className="text-rose-600 font-black">{match.opponent}</span>
                    </h3>
                  </div>

                  {match.location && (
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{match.location}</span>
                    </div>
                  )}
                </div>

                {/* Card Middle: Pain Body Parts & Levels */}
                <div className="p-5 space-y-3.5 flex-1">
                  {match.hasPain && matchPains.length > 0 ? (
                    <div className="space-y-2">
                      <div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          통증 부위
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {matchPains.map((p) => {
                            const partInfo = BODY_PARTS_INFO[p.bodyPart] || BODY_PARTS_INFO.thigh;
                            const sideLabel = p.side ? SIDE_LABELS[p.side] : "";
                            return (
                              <span
                                key={p.id}
                                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-800 border border-slate-200"
                              >
                                {sideLabel} {partInfo.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          통증 정도
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {matchPains.map((p) => {
                            const partInfo = BODY_PARTS_INFO[p.bodyPart] || BODY_PARTS_INFO.thigh;
                            const color = getPainColor(p.painLevel);
                            return (
                              <span
                                key={p.id}
                                className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${color.bg} ${color.text} ${color.border}`}
                              >
                                {partInfo.label}: {p.painLevel}/10
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <p className="text-xs text-slate-500 font-medium">
                        경기 후 부상 및 이상 증상 없이 안전하게 종료되었습니다.
                      </p>
                    </div>
                  )}

                  {/* Attached Images preview badges */}
                  {matchImages.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>사진 {matchImages.length}장 첨부</span>
                      </span>
                      <div className="flex -space-x-2 overflow-hidden">
                        {matchImages.slice(0, 3).map((img) => (
                          <img
                            key={img.id}
                            src={img.imageUrl}
                            alt=""
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Detail Button */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onOpenDetailModal(match)}
                    className="w-full py-2 px-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 hover:border-slate-300"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>상세보기</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">등록된 경기 기록이 없습니다</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            새로운 경기를 등록하고 경기 중 발생한 신체 부위별 통증을 기록해보세요.
          </p>
          <button
            type="button"
            onClick={onOpenNewMatchModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>첫 경기 기록하기</span>
          </button>
        </div>
      )}
    </div>
  );
};
