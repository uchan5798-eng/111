import React, { useState } from "react";
import { PlayerProfile } from "../types";
import { User, Camera, Plus, Edit2, Shield, Award, Sparkles, Check, X, Calendar, Activity, Dumbbell } from "lucide-react";

interface PlayerProfileViewProps {
  profile: PlayerProfile;
  onUpdateProfile: (updated: PlayerProfile) => void;
}

export const PlayerProfileView: React.FC<PlayerProfileViewProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<PlayerProfile>(profile);
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(editForm);
    setIsEditing(false);
  };

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      if (url) {
        setEditForm((prev) => ({ ...prev, photoUrl: url }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryPhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    (Array.from(files) as File[]).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        if (url) {
          setEditForm((prev) => ({
            ...prev,
            galleryImages: [...prev.galleryImages, url],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveGalleryImage = (idxToRemove: number) => {
    setEditForm((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, idx) => idx !== idxToRemove),
    }));
  };

  return (
    <div id="player-profile-view" className="space-y-6">
      {/* Top Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Cover Accent Banner */}
        <div className="h-36 sm:h-44 bg-linear-to-r from-slate-900 via-slate-800 to-rose-950 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditForm(profile);
                setIsEditing(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-xs transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>프로필 편집</span>
            </button>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              {/* Profile Avatar */}
              <div className="relative group">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden ring-4 ring-white shadow-md bg-slate-100 shrink-0">
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Name & Position */}
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {profile.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-lg bg-rose-600 text-white text-xs font-extrabold">
                    #{profile.number}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  {profile.position} · {profile.affiliation}
                </p>
                <p className="text-xs text-slate-400">
                  선수 고유 프로필 및 피지컬 관리 포트폴리오
                </p>
              </div>
            </div>
          </div>

          {/* Core Physical & Bio Traits (NO match statistics!) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-slate-100 bg-slate-50/60 rounded-2xl p-4">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                생년월일
              </span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {profile.birthDate}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                신장 / 체중
              </span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-slate-400" />
                {profile.height} cm / {profile.weight} kg
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                주발 (Dominant Foot)
              </span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-slate-400" />
                {profile.dominantFoot}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                소속 팀
              </span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                {profile.affiliation}
              </span>
            </div>
          </div>

          {/* Bio & Playing Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-700" />
                <span>선수 소개 및 포트폴리오 가치관</span>
              </h3>
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {profile.introduction}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-600" />
                <span>플레이 스타일 및 피지컬 강점</span>
              </h3>
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {profile.playingStyle}
              </div>
            </div>
          </div>

          {/* Training & Self-Care Routine */}
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-slate-700" />
              <span>경기 전후 신체 케어 및 컨디셔닝 루틴</span>
            </h3>
            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {profile.trainingRoutine}
            </div>
          </div>

          {/* Career & Activities Timeline */}
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>주요 이력 및 활동 연혁</span>
            </h3>
            <div className="space-y-2.5">
              {profile.careerMilestones.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50/60 rounded-xl border border-slate-200 gap-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-800">
                      {item.year}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{item.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Athlete Photo Gallery (선수 사진 중심 포트폴리오) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-slate-800" />
              <span>선수 포토 갤러리</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              경기 및 훈련 순간을 담은 선수의 대표 사진 모음입니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {profile.galleryImages.map((imgUrl, index) => (
            <div
              key={index}
              onClick={() => setSelectedGalleryPhoto(imgUrl)}
              className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-200 cursor-pointer shadow-2xs hover:shadow-md transition-all"
            >
              <img
                src={imgUrl}
                alt={`선수 사진 ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                  확대 보기
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">선수 개인 프로필 편집</h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Photo Upload */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">메인 프로필 사진</label>
                <div className="flex items-center gap-4">
                  <img
                    src={editForm.photoUrl}
                    alt="미리보기"
                    className="w-16 h-16 rounded-xl object-cover border"
                  />
                  <label className="cursor-pointer px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700">
                    사진 변경하기
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">이름</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">등번호</label>
                  <input
                    type="number"
                    value={editForm.number}
                    onChange={(e) =>
                      setEditForm({ ...editForm, number: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">포지션</label>
                  <input
                    type="text"
                    value={editForm.position}
                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">소속팀</label>
                  <input
                    type="text"
                    value={editForm.affiliation}
                    onChange={(e) => setEditForm({ ...editForm, affiliation: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">생년월일</label>
                  <input
                    type="text"
                    value={editForm.birthDate}
                    onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">주발</label>
                  <select
                    value={editForm.dominantFoot}
                    onChange={(e) =>
                      setEditForm({ ...editForm, dominantFoot: e.target.value as any })
                    }
                    className="w-full p-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="오른발">오른발</option>
                    <option value="왼발">왼발</option>
                    <option value="양발">양발</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">신장 (cm)</label>
                  <input
                    type="number"
                    value={editForm.height}
                    onChange={(e) =>
                      setEditForm({ ...editForm, height: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">체중 (kg)</label>
                  <input
                    type="number"
                    value={editForm.weight}
                    onChange={(e) =>
                      setEditForm({ ...editForm, weight: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">선수 소개</label>
                <textarea
                  rows={2}
                  value={editForm.introduction}
                  onChange={(e) => setEditForm({ ...editForm, introduction: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">플레이 스타일</label>
                <textarea
                  rows={2}
                  value={editForm.playingStyle}
                  onChange={(e) => setEditForm({ ...editForm, playingStyle: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">컨디셔닝 루틴</label>
                <textarea
                  rows={2}
                  value={editForm.trainingRoutine}
                  onChange={(e) => setEditForm({ ...editForm, trainingRoutine: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Gallery upload */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-semibold text-slate-700">갤러리 사진 관리</label>
                  <label className="cursor-pointer text-xs font-bold text-slate-900 hover:text-rose-600 flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" />
                    <span>갤러리 사진 추가</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryPhotoAdd}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {editForm.galleryImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Zoom Modal */}
      {selectedGalleryPhoto && (
        <div
          onClick={() => setSelectedGalleryPhoto(null)}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl">
            <img
              src={selectedGalleryPhoto}
              alt="갤러리 사진 확대"
              className="w-full h-full object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
