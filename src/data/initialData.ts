import { Match, MatchPain, MatchImage, PlayerProfile } from "../types";

export const INITIAL_PLAYER_PROFILE: PlayerProfile = {
  id: "player-1",
  name: "이지훈",
  photoUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&auto=format&fit=crop&q=80",
  galleryImages: [
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
  ],
  number: 7,
  position: "미드필더 (MF)",
  affiliation: "서울 유나이티드",
  birthDate: "2002. 04. 15",
  height: 178,
  weight: 73,
  dominantFoot: "오른발",
  introduction:
    "빠른 판단력과 정교한 패스 워크를 바탕으로 팀의 경기 템포를 조율하는 중앙 미드필더입니다. 꾸준한 자기 관리와 경기별 피지컬 컨디셔닝을 최우선으로 생각합니다.",
  playingStyle:
    "넓은 시야와 민첩한 전환 플레이, 정확한 킥력을 갖추었으며 전방 압박과 공수 밸런스 유지에 탁월합니다.",
  careerMilestones: [
    {
      year: "2025 ~ 현재",
      title: "서울 유나이티드 1군 등록",
      detail: "주전 미드필더 및 등번호 7번 배정",
    },
    {
      year: "2023 ~ 2024",
      title: "전국 대학 축구 대회",
      detail: "우수 선수상 수상 및 대학 대표 선발",
    },
    {
      year: "2020 ~ 2022",
      title: "U-18 유스팀 수석 졸업",
      detail: "권역 리그 우승 및 팀 캡틴 역임",
    },
  ],
  trainingRoutine:
    "경기 24시간 전 폼롤러 및 동적 스트레칭 30분, 경기 후 냉온욕과 하지 정맥 림프 순환 케어, 주 3회 코어 및 햄스트링 강화 운동",
};

export const INITIAL_MATCHES: Match[] = [
  {
    id: "match-1",
    userId: "user-1",
    matchDate: "2026-09-17",
    opponent: "○○ FC",
    location: "서울 잠실 보조경기장",
    hasPain: true,
    notes: "후반전 70분경 상대와의 경합 및 강한 슈팅 후 허벅지 당김 발생. 후반 종료 직전 착지 시 발목 살짝 삐끗함.",
  },
  {
    id: "match-2",
    userId: "user-1",
    matchDate: "2026-09-10",
    opponent: "블루윙즈 FC",
    location: "수원 원정 전용구장",
    hasPain: true,
    notes: "전반 초반 허리 쪽 뻐근함이 있었으나 후반 스트레칭 후 완화됨.",
  },
  {
    id: "match-3",
    userId: "user-1",
    matchDate: "2026-09-03",
    opponent: "그린 스타즈",
    location: "성남 탄천 경기장",
    hasPain: false,
    notes: "경기 후 전신 피로감 외 특이 통증 부위 없음. 컨디션 양호.",
  },
];

export const INITIAL_PAINS: MatchPain[] = [
  {
    id: "pain-1",
    matchId: "match-1",
    bodyPart: "thigh",
    side: "right",
    painLevel: 4,
    occurrenceTime: "후반전 후반 (70~90분)",
    notes: "우측 대퇴사두근 및 햄스트링 상단 당김. 쿨다운 시 얼음찜질 15분 실시.",
  },
  {
    id: "pain-2",
    matchId: "match-1",
    bodyPart: "ankle",
    side: "left",
    painLevel: 2,
    occurrenceTime: "경기 직후 (쿨다운 중)",
    notes: "좌측 외측 복사뼈 주변 가벼운 욱신거림. 체중 지지 가능.",
  },
  {
    id: "pain-3",
    matchId: "match-2",
    bodyPart: "back",
    side: "center",
    painLevel: 3,
    occurrenceTime: "전반전 초반 (0~20분)",
    notes: "요추 중앙 근육 경직. 경기 전 워밍업 부족 추정.",
  },
];

export const INITIAL_IMAGES: MatchImage[] = [
  {
    id: "img-1",
    matchId: "match-1",
    painId: "pain-1",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80",
    title: "오른쪽 허벅지 아이싱 처치 후",
    date: "2026-09-17",
  },
  {
    id: "img-2",
    matchId: "match-1",
    painId: "pain-2",
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80",
    title: "왼쪽 발목 테이핑 상태 점검",
    date: "2026-09-17",
  },
];
