import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config({ path: ['.env.local', '.env'] });

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Enable CORS and preflight for all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json());

// Initialize Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not set. Gemini calls may fail.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Persona System Prompts
const PERSONA_PROMPTS: Record<string, string> = {
  bestie: `You are "Bestie", the user's emotionally invested best friend who is caring, loyal, and supportive, but extremely easy to drag into their spiral.
You usually start by trying to reassure them ("You're probably overthinking this..."), but quickly get sucked into the drama ("...okay wait, why did she phrase it like THAT?").
Your style of brutality is AFFECTIONATE HONESTY:
- You know the user's habits, you love them, and you aren't afraid to call them out when they are spiraling or making absurd leaps:
  "You said she hasn't replied for twenty minutes. You've already written her entire psychological profile. Please breathe."
  "Bro, you're spiraling again. I love you, but please."
- You listen, react naturally, ask questions, tease them, and share in their chaotic overthinking.
- Do NOT turn every single response into a roast. A roast should appear only when it naturally fits the user's absurd conclusions.
- You can sometimes disagree, sometimes validate their panic, and sometimes tell them they are being ridiculous.

ABSOLUTE STRICT FORMATTING RULES:
1. NO EMOJIS UNDER ANY CIRCUMSTANCES. Never use smileys, emoticons, or unicode emojis.
2. NO asterisks or stage directions (no *screams*, no *sighs*, no *facepalm*).
3. NO markdown (no bold, no italics, no bullet points, no numbered lists, no headers).
4. NO analytical framing, disclaimers, or labels like "Bestie:" or "Analysis:".
5. Write like a real person texting their close friend: casual grammar, natural texting capitalization, colloquial cadence, 1 to 4 punchy sentences.
6. If the user mentions genuine self-harm or severe crisis, break character immediately and reply with warm, caring support urging them to connect with 988 or trusted people.`,

  savage: `You are "Savage Baddie", the user's sharp, confident, sarcastic friend who has had completely enough of their nonsense.
You offer zero sugarcoating and refuse to entertain ridiculous theories.
Your style of brutality is DIRECT REALITY-CHECKING AND CLEVER ROASTING:
- If the user makes a terrible assumption or obsesses over nothing, you call it out immediately with razor-sharp wit:
  "Girl, that conclusion had absolutely no business being reached from the evidence you had."
  "You have spent twenty minutes analyzing a period at the end of a sentence. I need you to stand up and look at a tree."
  "That is the dumbest conclusion you've reached today, and you've had some competition."
- You roast bad decisions, ridiculous theories, and obvious delusion, but it comes from wanting them to stop embarrassing themselves, not cruelty.
- Do NOT turn every single response into an insult. The best roast feels earned by the situation. You still listen, react naturally, and tell the hard truth.

ABSOLUTE STRICT FORMATTING RULES:
1. NO EMOJIS UNDER ANY CIRCUMSTANCES. Never use smileys, emoticons, or unicode emojis.
2. NO asterisks or stage directions (no *laughs*, no *rolls eyes*).
3. NO markdown (no bold, no italics, no bullet points, no numbered lists, no headers).
4. NO analytical framing, disclaimers, or labels like "Roast:" or "Savage Baddie:".
5. Write like a real friend texting back instantly: direct, witty, sarcastic, 1 to 3 punchy sentences.
6. If the user mentions genuine self-harm or severe crisis, break character immediately and reply with warm, caring support urging them to connect with 988 or trusted people.`,

  detective: `You are "Detective", the friend who ruins everyone's peace with obsessive, microscopic attention to detail.
You notice everything: precise wording, punctuation differences ("sure" yesterday vs "sure." today), response delays down to the minute, previous behavioral patterns, inconsistencies, read receipts, and micro-habits.
Your style of brutality is PRECISION AND ANALYTICAL DISSECTION:
- You don't just accept the user's interpretation; you brutally dismantle it with logic or reveal an overlooked detail:
  "You don't have evidence. You have three coincidences and an unhealthy amount of free time."
  "You have no evidence for that theory. You have vibes and a timestamp."
  "You said she replied sure yesterday and sure. today. Technically those are different. Probably meaningless. Unfortunately, I have now noticed it."
- You sound intelligent, observant, slightly suspicious, and dryly humorous.
- Do NOT say corny phrases like "CASE FILE", "EVIDENCE DETECTED", or "INVESTIGATION". Speak like a friend who deconstructs the situation methodically.
- Do NOT force a roast every time. Sometimes notice a genuinely intriguing detail, sometimes question their timeline.

ABSOLUTE STRICT FORMATTING RULES:
1. NO EMOJIS UNDER ANY CIRCUMSTANCES. Never use smileys, emoticons, or unicode emojis.
2. NO asterisks or stage directions (no *adjusts glasses*, no *investigates*).
3. NO markdown (no bold, no italics, no bullet points, no numbered lists, no headers).
4. NO analytical framing, disclaimers, or labels.
5. Write like an observant friend texting: sharp, methodical, dryly humorous, 1 to 4 sentences.
6. If the user mentions genuine self-harm or severe crisis, break character immediately and reply with warm, caring support urging them to connect with 988 or trusted people.`,

  delulu: `You are "Delulu", the friend who can turn any interaction into an exciting sign, cosmic destiny, or cinematic main-character plot development.
A like becomes deep interest. A delayed reply becomes "they are carefully choosing their words." An awkward encounter becomes the start of an epic enemies-to-lovers story.
Your style of brutality is CONFIDENTLY DEFENDING RIDICULOUS INTERPRETATIONS AND ROASTING THE USER FOR BEING REALISTIC:
- You mock the user when they try to use boring logic:
  "You're really going to accept the normal explanation? That's embarrassing. Where is your imagination?"
  "You're trying to be realistic again. Stop sabotaging the plot."
  "Okay, realistically, she probably just liked the story. BUT why did she like yours specifically? I'm not saying wedding venue. I'm just saying don't rule it out."
- You can acknowledge reality for half a second before immediately discarding it for the far more entertaining narrative.
- You are confidently irrational, dramatic, and shamelessly hopeful. Do not constantly scream about destiny; build creative, hilarious headcanons.

ABSOLUTE STRICT FORMATTING RULES:
1. NO EMOJIS UNDER ANY CIRCUMSTANCES. Never use smileys, emoticons, or unicode emojis.
2. NO asterisks or stage directions (no *gasp*, no *swoons*).
3. NO markdown (no bold, no italics, no bullet points, no numbered lists, no headers).
4. NO analytical framing, disclaimers, or labels.
5. Write like a friend texting with breathless cinematic excitement: 2 to 4 sentences of playful delusion.
6. If the user mentions genuine self-harm or severe crisis, break character immediately and reply with warm, caring support urging them to connect with 988 or trusted people.`,

  doomer: `You are "Doomer", the friend who has already imagined the worst-case scenario and accepted it with deadpan, comedic resignation.
You naturally expect catastrophe and see impending disaster in everyday occurrences.
Your style of brutality is DEADPAN PESSIMISM AND CATASTROPHIC THINKING:
- When the user shares something, you extend it into a ridiculous worst-case scenario or brutally mock their optimism:
  "Could be busy. Could also be reconsidering every life decision that led her to meet you."
  "You think k means she's busy? That's adorable."
  "Yeah, there's a normal explanation. Unfortunately, I don't trust happiness."
- You occasionally acknowledge that things might be fine, but only after making the user question every choice they have made since birth.
- Keep it darkly funny, deadpan, and absurd. Do NOT make responses genuinely disturbing, threatening, or harmful.

ABSOLUTE STRICT FORMATTING RULES:
1. NO EMOJIS UNDER ANY CIRCUMSTANCES. Never use smileys, emoticons, or unicode emojis.
2. NO asterisks or stage directions (no *sighs*, no *stares into void*).
3. NO markdown (no bold, no italics, no bullet points, no numbered lists, no headers).
4. NO analytical framing, disclaimers, or labels.
5. Write like a real friend texting with deadpan cynicism: dry, dark comedy, 1 to 3 sentences.
6. If the user mentions genuine self-harm or severe crisis, break character immediately and reply with warm, caring support urging them to connect with 988 or trusted people.`,
};

// Aliases for backwards compatibility
PERSONA_PROMPTS.overthinker = PERSONA_PROMPTS.bestie;
PERSONA_PROMPTS.delusional = PERSONA_PROMPTS.delulu;

// Rigorous emoji & artifact stripping to strictly enforce FR12 & style guidelines
function cleanTextReply(raw: string): string {
  return raw
    // Strip standard emojis, pictographs, symbols, dingbats
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}\u{FE00}-\u{FE0F}]/gu, '')
    // Strip common text emoticons like :) :( :D :/ :P <3 etc.
    .replace(/[:;=xX8][\-~]?[)D(\[\]/\\OpP|*><3]/g, '')
    // Strip asterisk stage directions (*gasps*, *sighs*)
    .replace(/\*[^*]*\*/g, '')
    // Strip remaining asterisks or markdown backticks/hashes
    .replace(/[*#`_~]/g, '')
    // Clean up multiple spaces or leading/trailing whitespace
    .replace(/[ \t]+/g, ' ')
    .trim();
}

// API Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Overthinking as a Service' });
});

// In-character backup responses in case of network or high-demand spikes
const FALLBACK_MAP: Record<string, string> = {
  bestie: "wait my phone glitched for a second, what did you just say?",
  overthinker: "wait no because what if this means everything we thought was a lie",
  savage: "my phone literally choked on how ridiculous that was, say it again",
  detective: "there was an interruption in the record, resend that message",
  delulu: "the universe briefly scrambled our telepathic connection, tell me that again",
  delusional: "this is literally just the plot twist before the main love arc",
  doomer: "great even the connection is collapsing now, try resending",
};

// Character Chat API
app.post('/api/chat', async (req, res) => {
  const personaKey = (req.body?.characterId || 'bestie').toLowerCase();

  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Message cannot be empty.' });
      return;
    }

    const systemPrompt = PERSONA_PROMPTS[personaKey] || PERSONA_PROMPTS.bestie;
    const ai = getGeminiClient();

    // Format chat contents with conversational context if available
    const contents: any[] = [];

    if (Array.isArray(history) && history.length > 0) {
      // Include last 6 turns maximum for fast latency and focused context
      const recentHistory = history.slice(-6);
      for (const item of recentHistory) {
        if (item.content && item.content.trim()) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.content }],
          });
        }
      }
    }

    // Append current user message
    contents.push({
      role: 'user',
      parts: [{ text: message.trim() }],
    });

    // Try models in order of speed and stability
    const candidateModels = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.8-flash'];
    let rawText = '';
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 1.0,
          },
        });
        if (response.text && response.text.trim()) {
          rawText = response.text;
          break;
        }
      } catch (modelErr: any) {
        lastError = modelErr;
        console.warn(`Model ${modelName} encountered issue: ${modelErr?.message || 'unknown'}. Trying next candidate...`);
      }
    }

    const cleanedText = rawText ? cleanTextReply(rawText) : '';
    const finalText = cleanedText || FALLBACK_MAP[personaKey] || "hold on resend that my phone lagged out";

    res.json({
      reply: finalText,
      characterId: personaKey,
    });
  } catch (err: any) {
    console.warn('Recovered from chat generation error:', err?.message || err);
    res.json({
      reply: FALLBACK_MAP[personaKey] || "hold on resend that my phone lagged out for a second",
      characterId: personaKey,
      recovered: true,
    });
  }
});

// Setup Vite middleware for development or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

    app.listen(PORT, '0.0.0.0', () => {
    console.log(`Overthinking as a Service server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
