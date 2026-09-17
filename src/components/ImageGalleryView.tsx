import React, { useState } from "react";
import { Match, MatchImage, MatchPain } from "../types";
import { BODY_PARTS_INFO, SIDE_LABELS } from "../data/bodyParts";
import { Download, Trash2, ZoomIn, Image as ImageIcon, Calendar, Shield, X, Filter, Upload, CheckSquare, Square } from "lucide-react";

interface ImageGalleryViewProps {
  images: MatchImage[];
  matches: Match[];
  pains: MatchPain[];
  onDeleteImage: (imgId: string) => void;
  onUploadImage: (img: MatchImage) => void;
}

export const ImageGalleryView: React.FC<ImageGalleryViewProps> = ({
  images,
  matches,
  pains,
  onDeleteImage,
  onUploadImage,
}) => {
  const [selectedMatchFilter, setSelectedMatchFilter] = useState<string>("all");
  const [zoomImage, setZoomImage] = useState<MatchImage | null>(null);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);

  const filteredImages = images.filter((img) => {
    if (selectedMatchFilter === "all") return true;
    return img.matchId === selectedMatchFilter;
  });

  const getMatchInfo = (matchId: string) => {
    return matches.find((m) => m.id === matchId);
  };

  const getPainInfo = (painId?: string) => {
    if (!painId) return null;
    return pains.find((p) => p.id === painId);
  };

  const handleDownloadSingle = (img: MatchImage) => {
    const match = getMatchInfo(img.matchId);
    const link = document.createElement("a");
    link.href = img.imageUrl;
    link.download = `${img.date}_${match?.opponent || "경기"}_${img.title || "통증부위사진"}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSelected = () => {
    const toDownload = filteredImages.filter((img) => selectedImageIds.includes(img.id));
    toDownload.forEach((img, idx) => {
      setTimeout(() => {
        handleDownloadSingle(img);
      }, idx * 250);
    });
  };

  const handleDownloadAll = () => {
    filteredImages.forEach((img, idx) => {
      setTimeout(() => {
        handleDownloadSingle(img);
      }, idx * 250);
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedImageIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllToggle = () => {
    if (selectedImageIds.length === filteredImages.length) {
      setSelectedImageIds([]);
    } else {
      setSelectedImageIds(filteredImages.map((i) => i.id));
    }
  };

  const handleQuickUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Use latest match or create placeholder
    const targetMatch = matches[0];
    const matchId = targetMatch ? targetMatch.id : `match-${Date.now()}`;

    (Array.from(files) as File[]).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          const newImg: MatchImage = {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            matchId: matchId,
            imageUrl: dataUrl,
            title: file.name.replace(/\.[^/.]+$/, ""),
            date: new Date().toISOString().split("T")[0],
          };
          onUploadImage(newImg);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  return (
    <div id="image-gallery-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-slate-800" />
            <h2 className="text-xl font-bold text-slate-900">경기 통증 관련 이미지 다운로드</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            경기별 부상/통증 부위 사진을 미리보고, 다운로드하거나 삭제할 수 있습니다.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>사진 업로드</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleQuickUpload}
              className="hidden"
            />
          </label>

          {filteredImages.length > 0 && (
            <>
              {selectedImageIds.length > 0 && (
                <button
                  type="button"
                  onClick={handleDownloadSelected}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>선택 ({selectedImageIds.length}) 다운로드</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleDownloadAll}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>전체 다운로드 ({filteredImages.length})</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Control Bar: Filter & Select All */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {filteredImages.length > 0 && (
            <button
              type="button"
              onClick={handleSelectAllToggle}
              className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-semibold"
            >
              {selectedImageIds.length === filteredImages.length ? (
                <CheckSquare className="w-4 h-4 text-slate-900" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>전체 선택</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 ml-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">경기별 필터:</span>
            <select
              value={selectedMatchFilter}
              onChange={(e) => {
                setSelectedMatchFilter(e.target.value);
                setSelectedImageIds([]);
              }}
              className="bg-white border border-slate-200 rounded-lg py-1 px-2.5 text-xs text-slate-800 focus:outline-hidden"
            >
              <option value="all">모든 경기 사진 ({images.length})</option>
              {matches.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.matchDate} vs {m.opponent}
                </option>
              ))}
            </select>
          </div>
        </div>

        <span className="text-slate-500 text-[11px] self-end sm:self-auto">
          표시 중인 사진: <strong>{filteredImages.length}장</strong>
        </span>
      </div>

      {/* Image Grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((img) => {
            const match = getMatchInfo(img.matchId);
            const pain = getPainInfo(img.painId);
            const partInfo = pain?.bodyPart ? BODY_PARTS_INFO[pain.bodyPart] : null;
            const sideLabel = pain?.side ? SIDE_LABELS[pain.side] : "";
            const isSelected = selectedImageIds.includes(img.id);

            return (
              <div
                key={img.id}
                className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group ${
                  isSelected ? "ring-2 ring-slate-900 border-slate-900" : "border-slate-200"
                }`}
              >
                {/* Image Container */}
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />

                  {/* Select Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(img.id);
                    }}
                    className="absolute top-2.5 left-2.5 p-1 bg-white/90 backdrop-blur rounded-md shadow-xs text-slate-800 hover:bg-white"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-slate-900" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {/* Action overlay */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setZoomImage(img)}
                      className="p-1.5 bg-white/90 backdrop-blur text-slate-800 hover:text-slate-950 rounded-lg shadow-xs transition-colors hover:bg-white"
                      title="크게 보기"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadSingle(img)}
                      className="p-1.5 bg-white/90 backdrop-blur text-slate-800 hover:text-slate-950 rounded-lg shadow-xs transition-colors hover:bg-white"
                      title="다운로드"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`'${img.title}' 사진을 삭제하시겠습니까?`)) {
                          onDeleteImage(img.id);
                        }
                      }}
                      className="p-1.5 bg-rose-600/90 backdrop-blur text-white hover:bg-rose-700 rounded-lg shadow-xs transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Part Tag */}
                  {partInfo && (
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur text-white">
                        {sideLabel} {partInfo.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details Footer */}
                <div className="p-3.5 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900 truncate" title={img.title}>
                    {img.title || "통증 부위 사진"}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {img.date || match?.matchDate}
                    </span>
                    {match && (
                      <span className="truncate max-w-[110px] text-slate-600 font-medium">
                        vs {match.opponent}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setZoomImage(img)}
                      className="text-[11px] font-semibold text-slate-600 hover:text-slate-900"
                    >
                      미리보기
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadSingle(img)}
                      className="text-[11px] font-bold text-slate-900 hover:text-rose-600 flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>다운로드</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">등록된 이미지가 없습니다</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            경기 기록 시 또는 위의 '사진 업로드' 버튼을 눌러 통증 부위 사진을 추가해보세요.
          </p>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomImage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-3.5 bg-slate-800 flex items-center justify-between text-white text-xs">
              <span className="font-bold">{zoomImage.title || "통증 부위 사진 확대"}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadSingle(zoomImage)}
                  className="px-3 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 font-bold text-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>다운로드</span>
                </button>
                <button
                  type="button"
                  onClick={() => setZoomImage(null)}
                  className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 flex items-center justify-center max-h-[80vh] overflow-hidden bg-black/50">
              <img
                src={zoomImage.imageUrl}
                alt={zoomImage.title}
                className="max-h-[72vh] w-auto object-contain rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
