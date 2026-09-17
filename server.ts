import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Recommendation Endpoint
app.post("/api/gemini/pain-care", async (req, res) => {
  try {
    const { matches, recentPains, playerInfo } = req.body;
    const ai = getGenAI();

    // Context description of pains
    const painSummaryText = (recentPains || [])
      .map((p: any) => {
        return `- ${p.matchDate || "최근 경기"} [${p.opponent ? `vs ${p.opponent}` : "경기"}]: ${p.sideLabel || ""} ${p.bodyPartLabel || p.bodyPart} (통증 레벨: ${p.painLevel}/10, 발생시점: ${p.occurrenceTime || "경기 중"}, 메모: ${p.notes || "없음"})`;
      })
      .join("\n");

    const playerDesc = playerInfo
      ? `선수 프로필: ${playerInfo.name || "선수"} (${playerInfo.position || "선수"}, ${playerInfo.dominantFoot || "양발"})`
      : "선수 프로필: 축구 선수";

    if (ai) {
      const systemInstruction = `당신은 축구 및 스포츠 전문 피지컬 컨디셔닝 & 리커버리 전문가입니다.
사용자가 기록한 경기별 통증 부위(bodyPart)와 통증 정도(painLevel: 1~10), 발생 시점을 바탕으로 일반적인 경기 후 신체 관리 방법, 아이싱/온찜질 기준, 안전한 폼롤러 및 스트레칭 가이드, 휴식 권고를 친절하고 전문적으로 제공합니다.

[절대 주의사항]:
1. 절대로 특정 질병이나 손상(파열, 염좌, 골절 등)에 대한 '의료적 진단'이나 '처방'을 단정하지 마십시오.
2. 통증 레벨이 5 이상이거나 지속적인 통증, 부종, 열감, 보행 장애가 동반되는 경우 반드시 정형외과, 재활의학과 전문의 또는 팀 닥터의 대면 진료를 받도록 명시하십시오.
3. 친절하고 읽기 쉬운 한국어로 답변하며, 구조화된 섹션(개요 요약, 부위별 회복 관리법, 스트레칭/모빌리티 팁, 훈련 강도 조절, 주의사항 및 전문의 상담 안내)으로 작성하세요.`;

      const prompt = `${playerDesc}

최근 경기별 통증 기록 목록:
${painSummaryText || "현재 기록된 통증 부위가 없습니다."}

위 통증 기록들을 종합적으로 분석하여 선수를 위한 경기 후 컨디셔닝 관리 팁과 일반적인 스포츠 회복 가이드를 작성해주세요.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        success: true,
        advice: response.text,
        generatedAt: new Date().toISOString(),
      });
    }

    // High quality sports science algorithmic fallback if API key not present
    const fallbackAdvice = generateFallbackAdvice(recentPains || [], playerInfo);
    return res.json({
      success: true,
      advice: fallbackAdvice,
      isFallback: true,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("AI pain-care error:", error);
    // Provide safe fallback even on error
    const fallbackAdvice = generateFallbackAdvice(req.body?.recentPains || [], req.body?.playerInfo);
    return res.json({
      success: true,
      advice: fallbackAdvice,
      isFallback: true,
      errorMsg: error?.message,
    });
  }
});

function generateFallbackAdvice(pains: any[], playerInfo: any): string {
  if (!pains || pains.length === 0) {
    return `### 경기 후 기본 리커버리 & 컨디셔닝 안내

현재 등록된 통증 부위가 없습니다. 좋은 컨디션을 유지하기 위한 축구 경기 후 표준 관리 프로토콜을 안내해 드립니다.

1. **쿨다운 & 가벼운 조깅 (10~15분)**
   - 경기 직후 정적 상태로 바로 쉬지 않고, 가벼운 조깅과 보행으로 젖산 배출을 유도합니다.

2. **수분 및 전해질 재공급**
   - 땀으로 배출된 수분과 전해질, 탄수화물/단백질(3:1 비율)을 경기 종료 후 30분 이내에 섭취하세요.

3. **수면 및 충분한 휴식**
   - 근육 세포 회복과 중추신경계 안정화를 위해 최소 7~8시간의 양질의 수면을 확보하세요.

---
⚠️ **안내사항**: 본 가이드는 일반적인 스포츠 컨디셔닝 정보이며 의사의 진단이나 처방이 아닙니다. 경기 후 이상 징후나 통증이 발생하면 즉시 기록하고 전문의와 상담하시기 바랍니다.`;
  }

  const parts = pains.map((p) => `${p.sideLabel || ""} ${p.bodyPartLabel || p.bodyPart} (${p.painLevel}/10)`).join(", ");
  const maxPain = Math.max(...pains.map((p) => p.painLevel || 0));

  let advice = `### 경기별 통증 분석 및 맞춤 컨디셔닝 가이드

**확인된 통증 부위**: ${parts}
**최고 통증 강도**: ${maxPain}/10

#### 1. 급성기 관리 (경기 후 24~48시간)
${maxPain >= 5 ? "- **통증 강도 주의**: 5/10 이상의 통증 부위는 무리한 스트레칭이나 마사지를 피하고 휴식을 취하십시오.\n" : ""}
- **냉찜질(Ice Therapy)**: 경기 직후 통증 부위에 열감이나 붓기가 있다면 1회 15~20분간 얼음찜질을 적용하세요.
- **압박 및 거상(Compression & Elevation)**: 하체 부위(발목, 종아리, 허벅지)의 경우 다리를 심장보다 높게 올려 부종을 방지합니다.

#### 2. 부위별 맞춤 모빌리티 & 관리 권고사항
`;

  pains.forEach((p) => {
    const label = `${p.sideLabel || ""} ${p.bodyPartLabel || p.bodyPart}`;
    const partKey = (p.bodyPart || "").toLowerCase();

    if (partKey.includes("thigh") || partKey.includes("허벅지")) {
      advice += `\n- **${label} (햄스트링/대퇴사두근)**:
  * 급성 통증이 가라앉은 후 부드러운 폼롤러 이완을 진행하세요.
  * 스프린트 및 강한 킥 동작은 통증이 2점 이하로 떨어질 때까지 제한합니다.`;
    } else if (partKey.includes("ankle") || partKey.includes("발목")) {
      advice += `\n- **${label}**:
  * 축구화 끈 압박이나 접질림 여부를 점검하고, 통증이 사라질 때까지 테이핑 또는 보호대를 권장합니다.
  * 체중 부하 시 통증이 느껴진다면 무리한 러닝을 중단하세요.`;
    } else if (partKey.includes("knee") || partKey.includes("무릎")) {
      advice += `\n- **${label}**:
  * 슬개골 주변 및 장경인대 스트레칭을 가볍게 시행하고, 쪼그려 앉는 동작을 피하세요.
  * 붓기나 물이 차는 느낌이 있다면 지체 없이 진료를 받으세요.`;
    } else if (partKey.includes("groin") || partKey.includes("사타구니")) {
      advice += `\n- **${label} (내전근)**:
  * 급격한 방향 전환이나 롱패스 시 자극받기 쉬운 부위입니다. 나비 자세 스트레칭을 통증이 없는 범위에서 가볍게 하세요.`;
    } else if (partKey.includes("back") || partKey.includes("허리")) {
      advice += `\n- **${label}**:
  * 둔근(엉덩이) 및 고관절 굴곡근을 부드럽게 이완하여 요추 부담을 분산시키세요.`;
    } else {
      advice += `\n- **${label}**:
  * 해당 관절 및 근육의 가동범위를 가볍게 체크하고, 통증 유발 동작을 최소화하세요.`;
    }
  });

  advice += `\n\n#### 3. 훈련 복귀(Return to Play) 기준
- 통증이 2점 이하로 감소하고, 일상 보행 및 조깅 시 통증이 없어야 합니다.
- 점진적 부하 증가(가벼운 패스 훈련 -> 가속 러닝 -> 볼 터치 게임) 순서로 복귀하세요.

---
⚠️ **의료 진단 안내 및 주의사항**:
본 AI 추천은 사용자가 기록한 통증 부위 및 수치를 참고하여 제공하는 **일반적인 스포츠 관리 및 컨디셔닝 참고 정보**이며, **의료적 진단이나 치료를 대신할 수 없습니다.** 통증이 3일 이상 지속되거나 보행 곤란, 지속적인 부종, 극심한 통증이 있는 경우 반드시 전문 의료진(정형외과 등)의 정밀 진료를 받으시기 바랍니다.`;

  return advice;
}

// Vite middleware / Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
