import React, { useState } from "react";
import { Match, MatchPain, MatchImage, BodyPartKey, BodySide } from "../types";
import { BODY_PARTS_INFO, OCCURRENCE_TIMES, SIDE_LABELS, getPainColor } from "../data/bodyParts";
import { BodySilhouetteSelector } from "./BodySilhouetteSelector";
import { X, Calendar, MapPin, Shield, Plus, Trash2, Upload, AlertCircle, Sparkles, Image as ImageIcon } from "lucide-react";

interface MatchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (match: Match, pains: MatchPain[], images: MatchImage[]) => void;
  initialMatch?: Match | null;
  initialPains?: MatchPain[];
  initialImages?: MatchImage[];
}

export const MatchFormModal: React.FC<MatchFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMatch,
  initialPains = [],
  initialImages = [],
}) => {
  if (!isOpen) return null;

  // Match State
  const [matchDate, setMatchDate] = useState(
    initialMatch?.matchDate || new Date().toISOString().split("T")[0]
  );
  const [opponent, setOpponent] = useState(initialMatch?.opponent || "");
  const [location, setLocation] = useState(initialMatch?.location || "");
  const [hasPain, setHasPain] = useState<boolean>(initialMatch ? initialMatch.hasPain : true);
  const [matchNotes, setMatchNotes] = useState(initialMatch?.notes || "");

  // Pains State
  const [pains, setPains] = useState<MatchPain[]>(
    initialPains.length > 0
      ? initialPains
      : [
          {
            id: `pain-${Date.now()}-1`,
            matchId: initialMatch?.id || "",
            bodyPart: "thigh",
            side: "right",
            painLevel: 4,
            occurrenceTime: "후반전 후반 (70~90분)",
            notes: "",
          },
        ]
  );

  // Images State
  const [images, setImages] = useState<MatchImage[]>(initialImages);
  const [activeEditingIndex, setActiveEditingIndex] = useState<number>(0);

  // Handle Body Part Silhouette Click
  const handleTogglePart = (part: BodyPartKey, side?: BodySide) => {
    const defaultSide = side || BODY_PARTS_INFO[part].defaultSide;
    const existingIndex = pains.findIndex(
      (p) => p.bodyPart === part && p.side === defaultSide
    );

    if (existingIndex >= 0) {
      // If already selected, remove if more than 1 or ask
      if (pains.length === 1) {
        // If it's the last one and user unselects, can remove or switch
        setPains([]);
      } else {
        const next = pains.filter((_, idx) => idx !== existingIndex);
        setPains(next);
        setActiveEditingIndex(Math.max(0, next.length - 1));
      }
    } else {
      // Add new pain record for this part and side
      const newPain: MatchPain = {
        id: `pain-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        matchId: initialMatch?.id || "",
        bodyPart: part,
        side: defaultSide,
        painLevel: 3,
        occurrenceTime: OCCURRENCE_TIMES[5], // default e.g. 후반전
        notes: "",
      };
      const next = [...pains, newPain];
      setPains(next);
      setActiveEditingIndex(next.length - 1);
      setHasPain(true);
    }
  };

  const handleUpdatePain = (index: number, updates: Partial<MatchPain>) => {
    setPains((prev) =>
      prev.map((p, idx) => (idx === index ? { ...p, ...updates } : p))
    );
  };

  const handleRemovePain = (index: number) => {
    setPains((prev) => {
      const next = prev.filter((_, idx) => idx !== index);
      if (next.length === 0) {
        setHasPain(false);
      }
      return next;
    });
    setActiveEditingIndex(Math.max(0, activeEditingIndex - 1));
  };

  const handleAddNewEmptyPain = () => {
    const newPain: MatchPain = {
      id: `pain-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      matchId: initialMatch?.id || "",
      bodyPart: "knee",
      side: "right",
      painLevel: 3,
      occurrenceTime: OCCURRENCE_TIMES[7],
      notes: "",
    };
    setPains((prev) => [...prev, newPain]);
    setActiveEditingIndex(pains.length);
    setHasPain(true);
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, linkedPainId?: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    (Array.from(files) as File[]).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          const newImg: MatchImage = {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            matchId: initialMatch?.id || "",
            painId: linkedPainId,
            imageUrl: dataUrl,
            title: file.name.replace(/\.[^/.]+$/, ""),
            date: matchDate,
          };
          setImages((prev) => [...prev, newImg]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleRemoveImage = (imgId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imgId));
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponent.trim()) {
      alert("상대팀명을 입력해주세요.");
      return;
    }

    const matchId = initialMatch?.id || `match-${Date.now()}`;
    const finalizedMatch: Match = {
      id: matchId,
      userId: initialMatch?.userId || "user-1",
      matchDate,
      opponent: opponent.trim(),
      location: location.trim() || "홈 경기장",
      hasPain,
      notes: matchNotes.trim(),
    };

    const finalizedPains: MatchPain[] = hasPain
      ? pains.map((p) => ({
          ...p,
          matchId,
        }))
      : [];

    const finalizedImages: MatchImage[] = images.map((img) => ({
      ...img,
      matchId,
    }));

    onSave(finalizedMatch, finalizedPains, finalizedImages);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 my-8 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>{initialMatch ? "경기 기록 수정" : "새 경기 및 통증 기록 등록"}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              경기 정보와 경기 중/후 발생한 통증 부위를 실루엣으로 기록하세요.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Step 1: Basic Match Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
                1
              </span>
              <span>경기 기본 정보</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  경기 날짜 *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  상대팀 *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="예: 서울 FC, 블루윙즈"
                    value={opponent}
                    onChange={(e) => setOpponent(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                  />
                  <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  경기 장소
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="예: 잠실 주경기장, 탄천경기장"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Pain Occurrence Checkbox/Toggle */}
            <div className="pt-2">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-sm font-bold text-slate-900 block">
                    경기 후 통증 여부
                  </span>
                  <span className="text-xs text-slate-500">
                    경기 도중이나 종료 후 뻐근함, 충돌, 당김 등 신체 통증이 있었나요?
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setHasPain(true);
                      if (pains.length === 0) handleAddNewEmptyPain();
                    }}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      hasPain
                        ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    통증 있음
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasPain(false)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      !hasPain
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    통증 없음 (정상)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Body Silhouette & Pain Selector (Studio Workflow) */}
          {hasPain && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>신체 실루엣 통증 부위 및 강도 설정</span>
                </h4>
                <button
                  type="button"
                  onClick={handleAddNewEmptyPain}
                  className="text-xs font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>통증 부위 추가</span>
                </button>
              </div>

              {/* Body Silhouette Component */}
              <BodySilhouetteSelector
                selectedPains={pains}
                onTogglePart={handleTogglePart}
                activeEditingIndex={activeEditingIndex}
                onSelectPainToEdit={(idx) => setActiveEditingIndex(idx)}
              />

              {/* Detailed Settings for Each Pain Item */}
              {pains.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700">
                    선택된 통증 부위 상세 설정 ({pains.length}개 부위):
                  </div>

                  {pains.map((pain, index) => {
                    const partInfo = BODY_PARTS_INFO[pain.bodyPart] || BODY_PARTS_INFO.thigh;
                    const color = getPainColor(pain.painLevel);

                    return (
                      <div
                        key={pain.id || index}
                        className={`p-4 rounded-xl border transition-all ${
                          activeEditingIndex === index
                            ? "bg-white border-rose-400 ring-2 ring-rose-100 shadow-xs"
                            : "bg-slate-50/70 border-slate-200"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              {SIDE_LABELS[pain.side]} {partInfo.label}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-xs font-bold rounded-full ${color.bg} ${color.text} border ${color.border}`}
                            >
                              통증 정도: {pain.painLevel} / 10
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Side Toggle */}
                            {partInfo.allowsSide && (
                              <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs">
                                <button
                                  type="button"
                                  onClick={() => handleUpdatePain(index, { side: "left" })}
                                  className={`px-2 py-1 rounded-md font-medium transition-all ${
                                    pain.side === "left"
                                      ? "bg-white text-slate-900 shadow-xs font-bold"
                                      : "text-slate-600"
                                  }`}
                                >
                                  왼쪽
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdatePain(index, { side: "right" })}
                                  className={`px-2 py-1 rounded-md font-medium transition-all ${
                                    pain.side === "right"
                                      ? "bg-white text-slate-900 shadow-xs font-bold"
                                      : "text-slate-600"
                                  }`}
                                >
                                  오른쪽
                                </button>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemovePain(index)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Sliders & Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                          {/* Pain Level Slider (1 to 10) */}
                          <div className="sm:col-span-6">
                            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                              <span>통증 강도 (VAS 점수)</span>
                              <span className="text-rose-600 font-bold">{pain.painLevel} / 10</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={pain.painLevel}
                              onChange={(e) =>
                                handleUpdatePain(index, { painLevel: parseInt(e.target.value, 10) })
                              }
                              className="w-full accent-rose-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                              <span>1 (미미한 당김)</span>
                              <span>5 (보통 통증)</span>
                              <span>10 (극심한 통증)</span>
                            </div>
                          </div>

                          {/* Occurrence Time */}
                          <div className="sm:col-span-6">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              통증 발생 시점
                            </label>
                            <select
                              value={pain.occurrenceTime}
                              onChange={(e) =>
                                handleUpdatePain(index, { occurrenceTime: e.target.value })
                              }
                              className="w-full text-xs py-2 px-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                            >
                              {OCCURRENCE_TIMES.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Notes */}
                          <div className="sm:col-span-12">
                            <input
                              type="text"
                              placeholder="해당 부위의 상세 느낌이나 메모 (예: 슛 후 찌릿함, 멍이나 열감 있음)"
                              value={pain.notes}
                              onChange={(e) => handleUpdatePain(index, { notes: e.target.value })}
                              className="w-full text-xs py-2 px-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    통증이 있다고 표시되었습니다. 위의 신체 실루엣에서 아픈 부위를 터치하거나 클릭하여 선택해주세요.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Photos & Images Upload */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
                  {hasPain ? 3 : 2}
                </span>
                <span>관련 이미지 업로드 (환부 사진, 테이핑, 냉찜질 등)</span>
              </div>
              <label className="cursor-pointer text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>사진 추가</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </h4>

            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square"
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        className="self-end p-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="text"
                        value={img.title}
                        onChange={(e) =>
                          setImages((prev) =>
                            prev.map((i) =>
                              i.id === img.id ? { ...i, title: e.target.value } : i
                            )
                          )
                        }
                        className="text-[11px] text-white bg-slate-900/80 px-2 py-1 rounded border border-white/20 focus:outline-hidden"
                        placeholder="사진 제목"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center py-6">
                <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                <p className="text-xs text-slate-500">
                  통증 부위 사진이나 치료/테이핑 사진을 첨부할 수 있습니다.
                </p>
              </div>
            )}
          </div>

          {/* Step 4: Overall Match Notes */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              경기 종합 메모 및 특이사항
            </label>
            <textarea
              rows={3}
              placeholder="예: 경기 템포가 매우 빨랐으며 인조잔디 상태가 미끄러웠음. 쿨다운 스트레칭 실시함."
              value={matchNotes}
              onChange={(e) => setMatchNotes(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
            >
              {initialMatch ? "수정 완료" : "경기 및 통증 기록 저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
