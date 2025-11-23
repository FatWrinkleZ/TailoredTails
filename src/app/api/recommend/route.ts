// app/api/recommend/route.ts
import { NextRequest, NextResponse } from "next/server";

type SurveyResponse = {
  id: string;
  text: string;
  value: number;
}[];

export async function POST(request: NextRequest) {
  const surveyData: SurveyResponse = await request.json();

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct:free",
      temperature: 0.7,
      max_tokens: 512,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an expert dog behaviorist. Analyze the survey and return ONLY this JSON format:

{
  "embedding": [float, float, float, float, float],
  "summary": "short friendly description"
}

Embedding meaning:
0: Cleanliness tolerance (0 = ok with mess, 1 = very neat)
1: Activity level (0 = sedentary, 1 = very active)
2: Social exposure (0 = quiet/alone, 1 = very social)
3: Time & capability for dog care (0 = little time, 1 = lots of time)
4: Family/kids presence (0 = alone, 1 = kids/family often around)

Return valid JSON only. No markdown.`
        },
        {
          role: "user",
          content: `Survey answers (1-10 scale):\n${surveyData
            .map(q => `• ${q.text} → ${q.value}`)
            .join("\n")}\n\nReturn the JSON now.`
        }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("OpenRouter error:", err);
    return NextResponse.json(
      { error: "AI service error" },
      { status: 502 }
    );
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  try {
    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (e) {
    console.error("Failed to parse AI JSON:", content);
    return NextResponse.json(
      { error: "Invalid response from AI" },
      { status: 500 }
    );
  }
}