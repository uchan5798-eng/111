import React, { useState } from "react";
import { BodyPartKey, BodySide, MatchPain } from "../types";
import { BODY_PARTS_INFO, SIDE_LABELS, getPainColor } from "../data/bodyParts";
import { Check, Info, RotateCcw } from "lucide-react";

interface BodySilhouetteSelectorProps {
  selectedPains: Partial<MatchPain>[];
  onTogglePart: (part: BodyPartKey, side?: BodySide) => void;
  activeEditingIndex: number | null;
  onSelectPainToEdit: (index: number) => void;
}

export const BodySilhouetteSelector: React.FC<BodySilhouetteSelectorProps> = ({
  selectedPains,
  onTogglePart,
  activeEditingIndex,
  onSelectPainToEdit,
}) => {
  const [view, setView] = useState<"front" | "back">("front");

  const isPartSelected = (key: BodyPartKey, side?: BodySide) => {
    return selectedPains.some(
      (p) => p.bodyPart === key && (!side || p.side === side || p.side === "both")
    );
  };

  const getPartPainLevel = (key: BodyPartKey, side?: BodySide) => {
    const found = selectedPains.find(
      (p) => p.bodyPart === key && (!side || p.side === side || p.side === "both")
    );
    return found?.painLevel;
  };

  return (
    <div id="body-silhouette-selector" className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>신체 실루엣 통증 부위 선택</span>
            <span className="text-xs font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              다중 선택 가능
            </span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            실루엣의 부위를 직접 터치/클릭하거나 아래 부위 태그를 눌러 선택하세요.
          </p>
        </div>

        {/* Front / Back Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setView("front")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              view === "front"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            앞면 (Front)
          </button>
          <button
            type="button"
            onClick={() => setView("back")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              view === "back"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            뒷면 (Back)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Silhouette Visual SVG Canvas */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-3 bg-slate-50/80 rounded-2xl border border-slate-100 relative min-h-[420px]">
          <div className="absolute top-3 left-3 text-[11px] font-medium text-slate-400 bg-white/80 backdrop-blur px-2 py-1 rounded-md border border-slate-200">
            {view === "front" ? "앞면 시점 (좌/우 표기: 선수의 관점)" : "뒷면 시점 (좌/우 표기: 선수의 관점)"}
          </div>

          <svg
            viewBox="0 0 300 520"
            className="w-full max-w-[280px] h-auto max-h-[440px] drop-shadow-sm select-none"
          >
            <defs>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Head & Neck */}
            <circle cx="150" cy="45" r="26" fill="#cbd5e1" opacity="0.6" />
            <path d="M142,70 L158,70 L160,86 L140,86 Z" fill="#cbd5e1" opacity="0.6" />

            {/* Torso Base Outline */}
            <path
              d="M110,88 C125,86 175,86 190,88 C205,102 208,155 198,185 C192,205 186,220 188,235 C175,238 125,238 112,235 C114,220 108,205 102,185 C92,155 95,102 110,88 Z"
              fill="#e2e8f0"
            />

            {/* SHOULDER LEFT (Patient's Left, Screen Right in Front View) */}
            {(() => {
              const pLeft = isPartSelected("shoulder", "left");
              const levelL = getPartPainLevel("shoulder", "left");
              return (
                <g
                  onClick={() => onTogglePart("shoulder", "left")}
                  className="cursor-pointer group"
                >
                  <path
                    d={
                      view === "front"
                        ? "M182,88 Q198,88 206,102 Q196,114 182,106 Z"
                        : "M94,102 Q102,88 118,88 Q118,106 104,114 Z"
                    }
                    fill={pLeft ? "#f43f5e" : "#94a3b8"}
                    className="transition-colors hover:fill-rose-400"
                    filter={pLeft ? "url(#glow)" : undefined}
                  />
                  {pLeft && (
                    <circle
                      cx={view === "front" ? 194 : 106}
                      cy={view === "front" ? 96 : 96}
                      r="9"
                      fill="#be123c"
                    />
                  )}
                  {pLeft && (
                    <text
                      x={view === "front" ? 194 : 106}
                      y={100}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {levelL || "!"}
                    </text>
                  )}
                </g>
              );
            })()}

            {/* SHOULDER RIGHT (Patient's Right, Screen Left in Front View) */}
            {(() => {
              const pRight = isPartSelected("shoulder", "right");
              const levelR = getPartPainLevel("shoulder", "right");
              return (
                <g
                  onClick={() => onTogglePart("shoulder", "right")}
                  className="cursor-pointer group"
                >
                  <path
                    d={
                      view === "front"
                        ? "M118,88 Q102,88 94,102 Q104,114 118,106 Z"
                        : "M182,106 Q196,114 206,102 Q198,88 182,88 Z"
                    }
                    fill={pRight ? "#f43f5e" : "#94a3b8"}
                    className="transition-colors hover:fill-rose-400"
                    filter={pRight ? "url(#glow)" : undefined}
                  />
                  {pRight && (
                    <circle
                      cx={view === "front" ? 106 : 194}
                      cy={96}
                      r="9"
                      fill="#be123c"
                    />
                  )}
                  {pRight && (
                    <text
                      x={view === "front" ? 106 : 194}
                      y={100}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {levelR || "!"}
                    </text>
                  )}
                </g>
              );
            })()}

            {/* ARM / ELBOW / WRIST - Left & Right */}
            {/* Upper Arm Left */}
            <rect
              x={view === "front" ? 195 : 88}
              y="110"
              width="17"
              height="46"
              rx="8"
              fill={isPartSelected("arm", "left") ? "#f43f5e" : "#cbd5e1"}
              className="cursor-pointer hover:fill-rose-300 transition-colors"
              onClick={() => onTogglePart("arm", "left")}
            />
            {/* Upper Arm Right */}
            <rect
              x={view === "front" ? 88 : 195}
              y="110"
              width="17"
              height="46"
              rx="8"
              fill={isPartSelected("arm", "right") ? "#f43f5e" : "#cbd5e1"}
              className="cursor-pointer hover:fill-rose-300 transition-colors"
              onClick={() => onTogglePart("arm", "right")}
            />

            {/* Elbow Left */}
            <circle
              cx={view === "front" ? 204 : 96}
              cy="162"
              r="10"
              fill={isPartSelected("elbow", "left") ? "#f43f5e" : "#94a3b8"}
              className="cursor-pointer hover:fill-rose-300 transition-colors"
              onClick={() => onTogglePart("elbow", "left")}
            />
            {/* Elbow Right */}
            <circle
              cx={view === "front" ? 96 : 204}
              cy="162"
              r="10"
              fill={isPartSelected("elbow", "right") ? "#f43f5e" : "#94a3b8"}
              className="cursor-pointer hover:fill-rose-300 transition-colors"
              onClick={() => onTogglePart("elbow", "right")}
            />

            {/* Forearm & Wrist Left */}
            <rect
              x={view === "front" ? 197 : 88}
              y="176"
              width="15"
              height="40"
              rx="6"
              fill={isPartSelected("arm", "left") ? "#f43f5e" : "#cbd5e1"}
              className="cursor-pointer hover:fill-rose-300 transition-colors"
              onClick={() => onTogglePart("arm", "left")}
            />
            <circle
              cx={view === "front" ? 204 : 96}
              cy="222"
              r="8"
              fill={isPartSelected("wrist", "left") ? "#f43f5e" : "#94a3b8"}
              className="cursor-pointer hover:fill-rose-300 transition-colors"
              onClick={() => onTogglePart("wrist", "left")}
            />

            {/* Forearm & Wrist Right */}
            <rect
              x={view === "front" ? 88 : 197}
              y="176"
              width="15"
              height="40"
              rx="6"
              fill={isPartSelected("arm", "right") ? "#f43f5e" : "#cbd5e1"}
              className="cursor-pointer hover:fill-rose-300 transition-colors"
              onClick={() => onTogglePart("arm", "right")}
            />
            <circle
              cx={view === "front" ? 96 : 204}
              cy="222"
              r="8"
              fill={isPartSelected("wrist", "right") ? "#f43f5e" : "#94a3b8"}
              className="cursor-pointer hover:fill-rose-300 transition-colors"
              onClick={() => onTogglePart("wrist", "right")}
            />

            {/* WAIST / BACK */}
            <path
              d="M120,150 L180,150 L176,190 L124,190 Z"
              fill={isPartSelected("back") ? "#f43f5e" : "#94a3b8"}
              opacity={view === "back" ? 1 : 0.4}
              className="cursor-pointer hover:fill-rose-400 transition-colors"
              onClick={() => onTogglePart("back", "center")}
            />
            <text
              x="150"
              y="173"
              textAnchor="middle"
              fill={isPartSelected("back") ? "#fff" : "#475569"}
              fontSize="10"
              fontWeight="600"
              className="pointer-events-none"
            >
              허리
            </text>

            {/* PELVIS / GROIN (골반 & 사타구니) */}
            <path
              d="M116,192 L184,192 L178,230 L122,230 Z"
              fill={isPartSelected("pelvis") ? "#f43f5e" : "#cbd5e1"}
              className="cursor-pointer hover:fill-rose-300 transition-colors"
              onClick={() => onTogglePart("pelvis", "center")}
            />
            <text
              x="150"
              y="208"
              textAnchor="middle"
              fill="#475569"
              fontSize="9"
              fontWeight="600"
              className="pointer-events-none"
            >
              골반
            </text>

            {/* Groin / Inner Hip in front view */}
            {view === "front" && (
              <path
                d="M136,220 L164,220 L156,242 L144,242 Z"
                fill={isPartSelected("groin") ? "#f43f5e" : "#94a3b8"}
                className="cursor-pointer hover:fill-rose-400 transition-colors"
                onClick={() => onTogglePart("groin", "right")}
              />
            )}

            {/* LEGS: THIGH (허벅지) */}
            {/* Left Thigh (Patient Left) */}
            {(() => {
              const sel = isPartSelected("thigh", "left");
              const lvl = getPartPainLevel("thigh", "left");
              const xPos = view === "front" ? 154 : 116;
              return (
                <g onClick={() => onTogglePart("thigh", "left")} className="cursor-pointer group">
                  <path
                    d={`M${xPos},242 L${xPos + 30},240 L${xPos + 26},330 L${xPos + 4},330 Z`}
                    fill={sel ? "#f43f5e" : "#cbd5e1"}
                    className="hover:fill-rose-300 transition-colors"
                  />
                  <text
                    x={xPos + 16}
                    y="285"
                    textAnchor="middle"
                    fill={sel ? "#fff" : "#475569"}
                    fontSize="10"
                    fontWeight="600"
                  >
                    {sel && lvl ? `허벅지(${lvl})` : "허벅지"}
                  </text>
                </g>
              );
            })()}

            {/* Right Thigh (Patient Right) */}
            {(() => {
              const sel = isPartSelected("thigh", "right");
              const lvl = getPartPainLevel("thigh", "right");
              const xPos = view === "front" ? 116 : 154;
              return (
                <g onClick={() => onTogglePart("thigh", "right")} className="cursor-pointer group">
                  <path
                    d={`M${xPos},240 L${xPos + 30},242 L${xPos + 26},330 L${xPos + 4},330 Z`}
                    fill={sel ? "#f43f5e" : "#cbd5e1"}
                    className="hover:fill-rose-300 transition-colors"
                  />
                  <text
                    x={xPos + 15}
                    y="285"
                    textAnchor="middle"
                    fill={sel ? "#fff" : "#475569"}
                    fontSize="10"
                    fontWeight="600"
                  >
                    {sel && lvl ? `허벅지(${lvl})` : "허벅지"}
                  </text>
                </g>
              );
            })()}

            {/* KNEE (무릎) */}
            {/* Left Knee */}
            {(() => {
              const sel = isPartSelected("knee", "left");
              const cx = view === "front" ? 168 : 132;
              return (
                <g onClick={() => onTogglePart("knee", "left")} className="cursor-pointer group">
                  <circle
                    cx={cx}
                    cy="348"
                    r="13"
                    fill={sel ? "#f43f5e" : "#94a3b8"}
                    className="hover:fill-rose-400 transition-colors"
                  />
                  <text x={cx} y="352" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">
                    {sel ? "✓" : "무릎"}
                  </text>
                </g>
              );
            })()}

            {/* Right Knee */}
            {(() => {
              const sel = isPartSelected("knee", "right");
              const cx = view === "front" ? 132 : 168;
              return (
                <g onClick={() => onTogglePart("knee", "right")} className="cursor-pointer group">
                  <circle
                    cx={cx}
                    cy="348"
                    r="13"
                    fill={sel ? "#f43f5e" : "#94a3b8"}
                    className="hover:fill-rose-400 transition-colors"
                  />
                  <text x={cx} y="352" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">
                    {sel ? "✓" : "무릎"}
                  </text>
                </g>
              );
            })()}

            {/* CALF (종아리) */}
            {/* Left Calf */}
            {(() => {
              const sel = isPartSelected("calf", "left");
              const xPos = view === "front" ? 156 : 120;
              return (
                <g onClick={() => onTogglePart("calf", "left")} className="cursor-pointer group">
                  <path
                    d={`M${xPos},366 L${xPos + 24},366 L${xPos + 20},435 L${xPos + 6},435 Z`}
                    fill={sel ? "#f43f5e" : "#cbd5e1"}
                    className="hover:fill-rose-300 transition-colors"
                  />
                  <text x={xPos + 13} y="405" textAnchor="middle" fill={sel ? "#fff" : "#475569"} fontSize="9" fontWeight="600">
                    종아리
                  </text>
                </g>
              );
            })()}

            {/* Right Calf */}
            {(() => {
              const sel = isPartSelected("calf", "right");
              const xPos = view === "front" ? 120 : 156;
              return (
                <g onClick={() => onTogglePart("calf", "right")} className="cursor-pointer group">
                  <path
                    d={`M${xPos},366 L${xPos + 24},366 L${xPos + 18},435 L${xPos + 4},435 Z`}
                    fill={sel ? "#f43f5e" : "#cbd5e1"}
                    className="hover:fill-rose-300 transition-colors"
                  />
                  <text x={xPos + 12} y="405" textAnchor="middle" fill={sel ? "#fff" : "#475569"} fontSize="9" fontWeight="600">
                    종아리
                  </text>
                </g>
              );
            })()}

            {/* ANKLE (발목) */}
            {/* Left Ankle */}
            {(() => {
              const sel = isPartSelected("ankle", "left");
              const lvl = getPartPainLevel("ankle", "left");
              const cx = view === "front" ? 169 : 131;
              return (
                <g onClick={() => onTogglePart("ankle", "left")} className="cursor-pointer group">
                  <circle
                    cx={cx}
                    cy="448"
                    r="11"
                    fill={sel ? "#f43f5e" : "#94a3b8"}
                    className="hover:fill-rose-400 transition-colors"
                  />
                  <text x={cx} y="451" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">
                    {sel && lvl ? lvl : "발목"}
                  </text>
                </g>
              );
            })()}

            {/* Right Ankle */}
            {(() => {
              const sel = isPartSelected("ankle", "right");
              const lvl = getPartPainLevel("ankle", "right");
              const cx = view === "front" ? 131 : 169;
              return (
                <g onClick={() => onTogglePart("ankle", "right")} className="cursor-pointer group">
                  <circle
                    cx={cx}
                    cy="448"
                    r="11"
                    fill={sel ? "#f43f5e" : "#94a3b8"}
                    className="hover:fill-rose-400 transition-colors"
                  />
                  <text x={cx} y="451" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">
                    {sel && lvl ? lvl : "발목"}
                  </text>
                </g>
              );
            })()}

            {/* FOOT (발) */}
            {/* Left Foot */}
            <path
              d={
                view === "front"
                  ? "M163,462 L180,462 L184,495 L160,495 Z"
                  : "M124,462 L141,462 L143,495 L120,495 Z"
              }
              fill={isPartSelected("foot", "left") ? "#f43f5e" : "#cbd5e1"}
              className="cursor-pointer hover:fill-rose-300 transition-colors"
              onClick={() => onTogglePart("foot", "left")}
            />
            {/* Right Foot */}
            <path
              d={
                view === "front"
                  ? "M120,462 L137,462 L140,495 L116,495 Z"
                  : "M159,462 L176,462 L180,495 L156,495 Z"
              }
              fill={isPartSelected("foot", "right") ? "#f43f5e" : "#cbd5e1"}
              className="cursor-pointer hover:fill-rose-300 transition-colors"
              onClick={() => onTogglePart("foot", "right")}
            />
          </svg>
        </div>

        {/* Body Part Selection Quick List / Side Picker */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              부위별 직접 선택 및 좌/우 지정
            </span>
            <span className="text-xs text-slate-500 font-medium">
              선택된 부위: <strong className="text-slate-900">{selectedPains.length}곳</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.keys(BODY_PARTS_INFO) as BodyPartKey[]).map((key) => {
              const info = BODY_PARTS_INFO[key];
              const isSelected = selectedPains.some((p) => p.bodyPart === key);
              const activePartPains = selectedPains.filter((p) => p.bodyPart === key);

              return (
                <div
                  key={key}
                  className={`p-2.5 rounded-xl border transition-all text-left flex flex-col justify-between ${
                    isSelected
                      ? "bg-rose-50/70 border-rose-300 shadow-xs"
                      : "bg-slate-50/60 border-slate-200 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-bold ${isSelected ? "text-rose-900" : "text-slate-800"}`}>
                      {info.label}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>

                  {info.allowsSide ? (
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        type="button"
                        onClick={() => onTogglePart(key, "left")}
                        className={`flex-1 py-1 text-[11px] font-medium rounded-md border transition-all ${
                          selectedPains.some((p) => p.bodyPart === key && p.side === "left")
                            ? "bg-rose-600 text-white border-rose-600 font-bold shadow-xs"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        왼쪽
                      </button>
                      <button
                        type="button"
                        onClick={() => onTogglePart(key, "right")}
                        className={`flex-1 py-1 text-[11px] font-medium rounded-md border transition-all ${
                          selectedPains.some((p) => p.bodyPart === key && p.side === "right")
                            ? "bg-rose-600 text-white border-rose-600 font-bold shadow-xs"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        오른쪽
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onTogglePart(key, "center")}
                      className={`w-full py-1 text-[11px] font-medium rounded-md border transition-all ${
                        isSelected
                          ? "bg-rose-600 text-white border-rose-600 font-bold shadow-xs"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {isSelected ? "선택 해제" : "부위 선택"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Currently selected pain summary bar inside silhouette */}
          {selectedPains.length > 0 && (
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-700 mb-2">
                선택된 통증 항목 (클릭하여 아래 상세 항목으로 이동):
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedPains.map((p, idx) => {
                  const partInfo = p.bodyPart ? BODY_PARTS_INFO[p.bodyPart] : null;
                  const sideLabel = p.side ? SIDE_LABELS[p.side] : "";
                  const level = p.painLevel ?? 3;
                  const color = getPainColor(level);

                  return (
                    <button
                      key={`${p.bodyPart}-${p.side}-${idx}`}
                      type="button"
                      onClick={() => onSelectPainToEdit(idx)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        activeEditingIndex === idx
                          ? "ring-2 ring-rose-500 bg-white border-rose-400 font-bold"
                          : `${color.bg} ${color.text} ${color.border}`
                      }`}
                    >
                      <span>
                        {sideLabel} {partInfo?.label}
                      </span>
                      <span className="px-1.5 py-0.2 bg-white/80 rounded-sm text-[10px] font-bold">
                        {level}/10
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
