import { BodyPartInfo, BodyPartKey, BodySide } from "../types";

export const BODY_PARTS_INFO: Record<BodyPartKey, BodyPartInfo> = {
  shoulder: {
    key: "shoulder",
    label: "어깨",
    category: "upper",
    defaultSide: "right",
    allowsSide: true,
  },
  arm: {
    key: "arm",
    label: "팔",
    category: "upper",
    defaultSide: "right",
    allowsSide: true,
  },
  elbow: {
    key: "elbow",
    label: "팔꿈치",
    category: "upper",
    defaultSide: "right",
    allowsSide: true,
  },
  wrist: {
    key: "wrist",
    label: "손목",
    category: "upper",
    defaultSide: "right",
    allowsSide: true,
  },
  back: {
    key: "back",
    label: "허리",
    category: "core",
    defaultSide: "center",
    allowsSide: true,
  },
  pelvis: {
    key: "pelvis",
    label: "골반",
    category: "core",
    defaultSide: "center",
    allowsSide: true,
  },
  groin: {
    key: "groin",
    label: "사타구니",
    category: "core",
    defaultSide: "right",
    allowsSide: true,
  },
  thigh: {
    key: "thigh",
    label: "허벅지",
    category: "lower",
    defaultSide: "right",
    allowsSide: true,
  },
  knee: {
    key: "knee",
    label: "무릎",
    category: "lower",
    defaultSide: "right",
    allowsSide: true,
  },
  calf: {
    key: "calf",
    label: "종아리",
    category: "lower",
    defaultSide: "right",
    allowsSide: true,
  },
  ankle: {
    key: "ankle",
    label: "발목",
    category: "lower",
    defaultSide: "right",
    allowsSide: true,
  },
  foot: {
    key: "foot",
    label: "발",
    category: "lower",
    defaultSide: "right",
    allowsSide: true,
  },
};

export const OCCURRENCE_TIMES = [
  "워밍업 중",
  "전반전 초반 (0~20분)",
  "전반전 후반 (20~45분)",
  "하프타임",
  "후반전 초반 (45~70분)",
  "후반전 후반 (70~90분)",
  "연장전",
  "경기 직후 (쿨다운 중)",
  "경기 다음 날 아침",
];

export const SIDE_LABELS: Record<BodySide, string> = {
  left: "왼쪽",
  right: "오른쪽",
  both: "양쪽",
  center: "중앙",
};

export function getPainColor(level: number): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  if (level <= 2) {
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      badge: "bg-emerald-500",
    };
  }
  if (level <= 4) {
    return {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      badge: "bg-amber-500",
    };
  }
  if (level <= 6) {
    return {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      badge: "bg-orange-500",
    };
  }
  if (level <= 8) {
    return {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      badge: "bg-rose-500",
    };
  }
  return {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-300",
    badge: "bg-red-700",
  };
}
