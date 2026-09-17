export type BodyPartKey =
  | "shoulder"
  | "arm"
  | "elbow"
  | "wrist"
  | "back"
  | "pelvis"
  | "groin"
  | "thigh"
  | "knee"
  | "calf"
  | "ankle"
  | "foot";

export type BodySide = "left" | "right" | "both" | "center";

export interface BodyPartInfo {
  key: BodyPartKey;
  label: string;
  category: "upper" | "core" | "lower";
  defaultSide: BodySide;
  allowsSide: boolean; // whether left/right applies
}

export interface Match {
  id: string;
  userId: string;
  matchDate: string; // YYYY-MM-DD
  opponent: string;
  location: string;
  hasPain: boolean;
  notes: string;
}

export interface MatchPain {
  id: string;
  matchId: string;
  bodyPart: BodyPartKey;
  side: BodySide;
  painLevel: number; // 1 to 10
  occurrenceTime: string; // e.g., '전반전', '후반전', '경기 직후', etc.
  notes: string;
}

export interface MatchImage {
  id: string;
  matchId: string;
  painId?: string;
  imageUrl: string;
  title: string;
  date: string;
}

export interface PlayerProfile {
  id: string;
  name: string;
  photoUrl: string;
  galleryImages: string[];
  number: number;
  position: string;
  affiliation: string;
  birthDate: string;
  height: number;
  weight: number;
  dominantFoot: "오른발" | "왼발" | "양발";
  introduction: string;
  playingStyle: string;
  careerMilestones: {
    year: string;
    title: string;
    detail: string;
  }[];
  trainingRoutine: string;
}

export type ActiveTab = "home" | "profile" | "matches" | "images" | "ai";
