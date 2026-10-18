const SITE_ORIGIN = 'https://himanshu77raj.github.io';
const PORTFOLIO = `Rajesh Roshan Nanda is a self-taught developer in Bhubaneswar, Odisha. He works on local AI assistants, Python automation, APIs, data workflows and interfaces. His portfolio projects are MIRA 2.0 (a private local AI assistant prototype with memory, planning and checkpoints), Trade Hack (research and paper evaluation only), Python automation/API utility workflows, and early SHAMBHALA Blender tooling. He studied BBA at Utkal University but discontinued in the final semester without a degree. His email is rajeshroshannanda2@gmail.com and phone is +91 9178839312. He is open to remote technical roles and collaboration. Do not invent employment, degrees, public demos or finished products.`;
const SYSTEM = `You are Mira (pronounced Meera), a warm, calm female guide on Rajesh Roshan Nanda's engineering portfolio. Keep answers concise, clear and conversational (usually 2-4 sentences). Answer general questions helpfully. For questions about Rajesh, use only the verified facts below; say when a detail is unknown. Do not claim access to his PC, files or private projects. Do not provide harmful instructions. Use plain text and natural punctuation for spoken replies.\n\nVerified portfolio facts: ${PORTFOLIO}`;
const REPLY_LANGUAGES = Object.freeze({
  'en-IN': 'English', 'hi-IN': 'Hindi', 'or-IN': 'Odia', 'te-IN': 'Telugu',
  'ta-IN': 'Tamil', 'mr-IN': 'Marathi', 'gu-IN': 'Gujarati', 'ur-PK': 'Urdu',
  'ar-SA': 'Arabic', 'zh-CN': 'Simplified Chinese', 'ko-KR': 'Korean', 'ja-JP': 'Japanese'
});

function cors() {
  return { 'Access-Control-Allow-Origin': SITE_ORIGIN, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin', 'Cache-Control': 'no-store' };
}
function json(value, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: { ...cors(), 'Content-Type': 'application/json; charset=utf-8' } });
}
async function inputJson(request) {
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) return null;
  if (Number(request.headers.get('content-length')) > 4000) return null;
  try { const raw = await request.text(); return raw.length <= 4000 ? JSON.parse(raw) : null; } catch { return null; }
}
export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin');
    if (origin !== SITE_ORIGIN) return new Response('Forbidden', { status: 403 });
    const path = new URL(request.url).pathname;
    if (!['/chat', '/speak'].includes(path)) return json({ error: 'Not found' }, 404);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
    const body = await inputJson(request);
    if (!body || typeof body !== 'object') return json({ error: 'Invalid JSON request' }, 400);
    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    const [visitor, site] = await Promise.all([
      env.VISITOR_LIMIT.limit({ key: `${ip}:${path}` }),
      env.SITE_LIMIT.limit({ key: path })
    ]);
    if (!visitor.success || !site.success) return json({ error: 'Mira is busy. Please try again in a minute.' }, 429);
    try {
      if (path === '/chat') {
        const question = typeof body.question === 'string' ? body.question.trim() : '';
        if (!question || question.length > 300) return json({ error: 'Question must be 1–300 characters.' }, 400);
        const language = body.language ?? 'en-IN';
        if (typeof language !== 'string' || !Object.hasOwn(REPLY_LANGUAGES, language)) return json({ error: 'Unsupported reply language.' }, 400);
        const history = Array.isArray(body.history) ? body.history.slice(-6).filter(item =>
          item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string' && item.content.length <= 400
        ).map(item => ({ role: item.role, content: item.content })) : [];
        const system = language === 'en-IN' ? SYSTEM : `${SYSTEM}\n\nAnswer this turn entirely in ${REPLY_LANGUAGES[language]} using its usual native script, even if the question is in English. Preserve names, email addresses, URLs and the exact written phone number +91 9178839312. Do not add an English translation or a language preface. Keep it short and natural for speech.`;
        const result = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
          messages: [{ role: 'system', content: system }, ...history, { role: 'user', content: question }],
          max_tokens: language === 'en-IN' ? 220 : 350,
          temperature: 0.6
        });
        const answer = typeof result?.response === 'string' ? result.response.trim().slice(0, 1200) : '';
        if (!answer) throw new Error('Empty model response');
        return json({ answer });
      }
      const spokenText = typeof body.text === 'string' ? body.text.trim() : '';
      if (!spokenText || spokenText.length > 750) return json({ error: 'Speech text must be 1–750 characters.' }, 400);
      const audio = await env.AI.run('@cf/deepgram/aura-2-en', { text: spokenText, speaker: 'luna', encoding: 'mp3' });
      if (!audio || typeof audio.getReader !== 'function') throw new Error('Audio stream unavailable');
      return new Response(audio, { headers: { ...cors(), 'Content-Type': 'audio/mpeg' } });
    } catch (error) {
      console.error('Portfolio AI request failed', error);
      if (/4006|daily free allocation/i.test(String(error))) return json({ error: 'Mira has reached today’s AI usage limit. Please try again later.' }, 503);
      return json({ error: 'Mira is temporarily unavailable. Please try again shortly.' }, 503);
    }
  }
};
