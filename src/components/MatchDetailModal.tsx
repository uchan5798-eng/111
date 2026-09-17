import React, { useState } from "react";
import { Match, MatchPain, MatchImage } from "../types";
import { BODY_PARTS_INFO, SIDE_LABELS, getPainColor } from "../data/bodyParts";
import { X, Calendar, MapPin, Shield, Edit3, Trash2, Download, ZoomIn, CheckCircle2, AlertTriangle, Image as ImageIcon } from "lucide-react";

interface MatchDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match | null;
  pains: MatchPain[];
  images: MatchImage[];
  onEdit: (match: Match) => void;
  onDelete: (matchId: string) => void;
  onDeleteImage: (imgId: string) => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  isOpen,
  onClose,
  match,
  pains,
  images,
  onEdit,
  onDelete,
  onDeleteImage,
}) => {
  const [selectedImageForZoom, setSelectedImageForZoom] = useState<MatchImage | null>(null);

  if (!isOpen || !match) return null;

  const handleDownload = (img: MatchImage) => {
    const a = document.createElement("a");
    a.href = img.imageUrl;
    a.download = `${match.matchDate}_${match.opponent}_${img.title || "환부사진"}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-800 text-white">
                  경기 상세 기록
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {match.matchDate}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                <span>vs {match.opponent}</span>
                {match.hasPain ? (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    통증 발생 ({pains.length}곳)
                  </span>
                ) : (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    통증 없음
                  </span>
                )}
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onEdit(match)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors"
                title="수정하기"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm("이 경기 기록을 삭제하시겠습니까?")) {
                    onDelete(match.id);
                    onClose();
                  }
                }}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="삭제하기"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Meta Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">경기 일자</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {match.matchDate}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">상대팀</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  {match.opponent}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">경기 장소</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {match.location || "미지정"}
                </span>
              </div>
            </div>

            {/* Pain Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>경기 후 통증 부위 및 상태</span>
                <span className="text-xs font-normal text-slate-500">
                  총 {pains.length}개 부위 기록됨
                </span>
              </h4>

              {pains.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pains.map((pain) => {
                    const partInfo = BODY_PARTS_INFO[pain.bodyPart] || BODY_PARTS_INFO.thigh;
                    const color = getPainColor(pain.painLevel);

                    return (
                      <div
                        key={pain.id}
                        className={`p-4 rounded-xl border ${color.border} ${color.bg} flex flex-col justify-between`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-slate-900">
                              {SIDE_LABELS[pain.side]} {partInfo.label}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-white ${color.text} border ${color.border} shadow-2xs`}
                            >
                              통증 정도 {pain.painLevel} / 10
                            </span>
                          </div>

                          {/* VAS Progress Bar */}
                          <div className="w-full bg-white/80 h-2 rounded-full overflow-hidden mb-2.5">
                            <div
                              className={`h-full ${color.badge}`}
                              style={{ width: `${(pain.painLevel / 10) * 100}%` }}
                            />
                          </div>

                          <div className="text-xs text-slate-600 mb-1">
                            <span className="font-semibold text-slate-700">발생 시점: </span>
                            {pain.occurrenceTime || "경기 중"}
                          </div>

                          {pain.notes && (
                            <p className="text-xs text-slate-700 bg-white/70 p-2 rounded-lg border border-slate-200/50 mt-2">
                              {pain.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-xs text-emerald-800">
                    <p className="font-bold">통증 없는 안전한 경기였습니다.</p>
                    <p className="text-emerald-700/80">
                      특이 통증 부위가 발생하지 않아 양호한 컨디션 상태를 유지했습니다.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Match Notes */}
            {match.notes && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">경기 메모</h4>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {match.notes}
                </div>
              </div>
            )}

            {/* Images Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-slate-600" />
                  <span>관련 사진 ({images.length})</span>
                </h4>
              </div>

              {images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square shadow-2xs"
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedImageForZoom(img)}
                            className="p-1.5 bg-white/90 text-slate-900 rounded-lg hover:bg-white"
                            title="확대 보기"
                          >
                            <ZoomIn className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload(img)}
                            className="p-1.5 bg-white/90 text-slate-900 rounded-lg hover:bg-white"
                            title="다운로드"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("이 이미지를 삭제하시겠습니까?")) {
                                onDeleteImage(img.id);
                              }
                            }}
                            className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-white text-xs font-semibold truncate bg-black/40 px-2 py-1 rounded">
                          {img.title || "환부 사진"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">등록된 이미지가 없습니다.</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onEdit(match)}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>기록 수정</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
            >
              닫기
            </button>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {selectedImageForZoom && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-3 bg-slate-800 flex items-center justify-between text-white text-xs">
              <span className="font-semibold">{selectedImageForZoom.title || "환부 사진"}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(selectedImageForZoom)}
                  className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-1 text-xs"
                >
                  <Download className="w-3 h-3" />
                  <span>다운로드</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedImageForZoom(null)}
                  className="p-1 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-2 flex items-center justify-center max-h-[80vh] overflow-hidden">
              <img
                src={selectedImageForZoom.imageUrl}
                alt={selectedImageForZoom.title}
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
