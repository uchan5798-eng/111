import React, { useState, useEffect } from "react";
import { Match, MatchPain, PlayerProfile } from "../types";
import { BODY_PARTS_INFO, SIDE_LABELS, getPainColor } from "../data/bodyParts";
import { Sparkles, AlertTriangle, ShieldCheck, RefreshCw, Activity, HeartPulse, Stethoscope, ChevronRight, CheckCircle2, Clock } from "lucide-react";

interface AiRecommendationViewProps {
  matches: Match[];
  pains: MatchPain[];
  playerProfile: PlayerProfile;
}

export const AiRecommendationView: React.FC<AiRecommendationViewProps> = ({
  matches,
  pains,
  playerProfile,
}) => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string>("");
  const [generatedAt, setGeneratedAt] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Prepare pains with context
  const getEnrichedPains = () => {
    return pains.map((p) => {
      const match = matches.find((m) => m.id === p.matchId);
      const partInfo = BODY_PARTS_INFO[p.bodyPart] || BODY_PARTS_INFO.thigh;
      const sideLabel = p.side ? SIDE_LABELS[p.side] : "";

      return {
        ...p,
        matchDate: match?.matchDate,
        opponent: match?.opponent,
        bodyPartLabel: partInfo.label,
        sideLabel,
      };
    });
  };

  const fetchAdvice = async () => {
    setLoading(true);
    setError(null);
    try {
      const enriched = getEnrichedPains();
      const res = await fetch("/api/gemini/pain-care", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matches,
          recentPains: enriched,
          playerInfo: playerProfile,
        }),
      });

      if (!res.ok) {
        throw new Error(`서버 응답 오류 (${res.status})`);
      }

      const data = await res.json();
      if (data.advice) {
        setAdvice(data.advice);
        setGeneratedAt(data.generatedAt || new Date().toISOString());
      } else {
        throw new Error("AI 추천 결과를 불러오지 못했습니다.");
      }
    } catch (err: any) {
      console.error("AI fetch error:", err);
      setError("AI 분석을 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!advice) {
      fetchAdvice();
    }
  }, [pains.length, matches.length]);

  const maxPainLevel = pains.length > 0 ? Math.max(...pains.map((p) => p.painLevel)) : 0;

  return (
    <div id="ai-recommendation-view" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-semibold border border-white/10 text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI 피지컬 컨디셔닝 & 리커버리 가이드</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            경기별 통증 데이터 맞춤 회복 관리
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            기록된 경기별 통증 부위(허벅지, 발목 등)와 통증 강도(1~10), 발생 시점을 바탕으로
            일반적인 스포츠 관리 방법과 부위별 운동 참고사항을 제안합니다.
          </p>

          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={fetchAdvice}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "통증 데이터 분석 중..." : "AI 추천 다시 생성하기"}</span>
            </button>
            {generatedAt && (
              <span className="text-[11px] text-slate-400">
                분석 일시: {new Date(generatedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mandatory Medical Disclaimer (Prompt Mandate) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-900 space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>의료 진단 제한 및 전문가 상담 안내 (중요)</span>
        </div>
        <p className="text-xs text-amber-800/90 leading-relaxed pl-7">
          본 AI 추천 기능은 경기 후 발생한 피로와 통증 완화를 돕기 위한 <strong>일반적인 스포츠 컨디셔닝 및 리커버리 참고 정보</strong>만을 제공합니다.
          <strong>의료적 진단이나 치료 행위가 아니므로</strong>, 통증 레벨이 5 이상이거나 3일 이상 지속되는 통증, 부종, 열감, 보행 곤란 등이 나타날 경우 지체 없이 <strong>정형외과·재활의학과 전문의 또는 팀 닥터의 대면 진료 및 상담</strong>을 받으시기 바랍니다.
        </p>
      </div>

      {/* Current Pain Points Summary Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-700" />
            <span>분석 대상 통증 항목 ({pains.length}개)</span>
          </span>
          <span className="text-xs text-slate-500 font-medium">
            최고 통증 강도:{" "}
            <strong className={maxPainLevel >= 5 ? "text-rose-600" : "text-emerald-600"}>
              {maxPainLevel}/10
            </strong>
          </span>
        </h3>

        {pains.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {getEnrichedPains().map((p) => {
              const color = getPainColor(p.painLevel);
              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-xl border ${color.border} ${color.bg} flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900">
                      {p.sideLabel} {p.bodyPartLabel}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-white ${color.text} border ${color.border}`}
                    >
                      {p.painLevel} / 10
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    <span>{p.matchDate}</span>
                    {p.opponent && <span> · vs {p.opponent}</span>}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 truncate">
                    발생 시점: {p.occurrenceTime || "경기 중"}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-xl">
            현재 등록된 통증 부위가 없습니다. 경기 기록에 통증을 기록하시면 AI 맞춤 관리가 제공됩니다.
          </div>
        )}
      </div>

      {/* AI Advice Output Display */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              맞춤형 리커버리 & 관리 참고사항
            </h3>
          </div>
          {loading && (
            <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>실시간 분석 생성 중...</span>
            </span>
          )}
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {error}
          </div>
        )}

        {advice ? (
          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
            {advice}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-xs">
            통증 정보를 분석하고 있습니다...
          </div>
        )}
      </div>

      {/* Common Sports Recovery Checkpoints */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <HeartPulse className="w-4 h-4" />
            <span>냉찜질(Ice) vs 온찜질(Heat)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            - <strong>경기 후 24~48시간</strong>: 열감이나 붓기가 있을 경우 1회 15~20분 냉찜질 권장.
            <br />- <strong>48시간 이후</strong>: 급성 부종이 가라앉고 근육이 뻐근할 때 가벼운 온찜질로 혈류 개선.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
            <Clock className="w-4 h-4" />
            <span>훈련 복귀 4단계 기준</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            1. 일상 보행 시 무통증
            <br />2. 가벼운 직선 조깅 및 스트레칭
            <br />3. 지그재그 방향 전환 및 가속 러닝
            <br />4. 정상 팀 훈련 및 볼 터치 복귀
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
            <Stethoscope className="w-4 h-4" />
            <span>전문의 상담 필요 신호 (Red Flags)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            - 체중을 싣기 힘든 경우
            <br />- 관절에서 뚝 하는 파열음이나 어긋남
            <br />- 3일 이상 지속되는 통증 또는 열감
            <br />- 야간 수면을 방해하는 통증
          </p>
        </div>
      </div>
    </div>
  );
};
