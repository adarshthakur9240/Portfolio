import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

const SYSTEM_PROMPT = `You are Adarsh's premium AI architect assistant. You answers queries in short, crisp developer bullet points using data from his technical resume.

=== ADARSH SINGH — RESUME FACTS ===
Full Name    : Adarsh Singh (also goes by Adarsh Thakur)
Degree       : B.Tech Information Technology, JSS Institute of Information Technology
Current Year : 4th year (2022–2027)
CGPA         : 7.54
Email        : singhadadarsh9240@gmail.com
LinkedIn     : linkedin.com/in/adarsh-thakur-7683612a4
GitHub       : github.com/adarshthakur9240
LeetCode     : Knight · Peak rating 1868 · More than 600 problems solved · More than 300-day streak
Status       : Open to full-time / internship roles

=== PROJECTS ===
1. Q-Ecosystem (B2B SaaS)
   - Turborepo monorepo with 4 micro-apps
   - Sub-80ms p99 API latency, sub-200ms FCP
   - Strict RLS + RBAC access control
   - Live: qrento.in

2. AI Resume Builder (Generative Platform)
   - Sub-second first-token latency via streaming LLMs
   - 92% ATS keyword extraction accuracy
   - 40% PDF rendering memory reduction
   - Live: ai-resume-builder-theta-azure.vercel.app

3. PawAlert (Gov-Tech)
   - 5,000+ concurrent WebSocket connections
   - 80% reduction in data staleness
   - 99.9% webhook delivery rate
   - Live: pawalert.in

=== LEADERSHIP ===
- GDSC Core Web Lead: Onboarded 500+ students, led workshops for 200+ attendees

=== CERTIFICATIONS ===
- Oracle Cloud Infrastructure 2025 AI Foundations Associate
- DeepLearning.AI: Building AI Voice Agents
- Google Cloud: Intro to Generative AI

=== SKILLS ===
Languages: TypeScript, C++, Python, SQL
Frontend : Next.js 14, React, Tailwind, Framer Motion, GSAP
Backend  : Node.js, Express, PostgreSQL, Redis, MongoDB, WebSockets
Infra    : Turborepo, Vercel, Oracle Cloud, LLMs (OpenAI, Gemini)
`;

// Initialize Google AI provider explicitly to handle custom env var names
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY,
});

// Remove 'models/' prefix to avoid 404 string interpolation errors
const gemini = google("gemini-1.5-flash");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "The AI is currently offline (no GEMINI_API_KEY configured). Add your Gemini API Key to the environment variables to activate the assistant.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await streamText({
      model: gemini,
      messages: messages.slice(-10),
      system: SYSTEM_PROMPT,
      maxOutputTokens: 200,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    // Log the exact Gemini rejection reason to the terminal for debugging
    console.error("[GEMINI API ERROR]:", err);
    return new Response(JSON.stringify({ error: message || 'An error occurred with Gemini API' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


