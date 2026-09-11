type Persona = 'bestie' | 'savage' | 'detective' | 'delulu' | 'doomer';

const FALLBACKS: Record<Persona, string> = {
  bestie: 'okay, the evidence is limited, but i am absolutely available to spiral through it with you. what part is bothering you most?',
  savage: 'that theory is doing a lot of work for very little evidence. give me the facts before we embarrass ourselves further.',
  detective: 'interesting. now separate what actually happened from what you inferred, because those are currently filing for divorce.',
  delulu: 'you are focusing on the normal explanation when the cinematic one is right there. i am choosing the plot.',
  doomer: 'there is probably a reasonable explanation. unfortunately, reasonable explanations have a poor track record around here.',
};

function normalizePersona(value: unknown): Persona {
  return value === 'savage' || value === 'detective' || value === 'delulu' || value === 'doomer' ? value : 'bestie';
}

export function createPrototypeReply(personaValue: unknown, message: string): string {
  const persona = normalizePersona(personaValue);
  const topic = message.trim().replace(/\s+/g, ' ').slice(0, 120);
  if (!topic) return FALLBACKS[persona];

  const replies: Record<Persona, string> = {
    bestie: `okay, about "${topic}"... i get why your brain grabbed onto that, but we do not have enough evidence for the full disaster movie yet. tell me the exact part that made your stomach drop.`,
    savage: `you really looked at "${topic}" and built a whole courtroom out of it. pause, collect the actual facts, and stop cross-examining punctuation.`,
    detective: `noted: "${topic}". the wording matters less than the pattern, timing, and what happened immediately before it. what changed from the last interaction?`,
    delulu: `"${topic}"? that is not a problem, that is narrative tension. the universe is clearly leaving a clue and i refuse to let realism ruin the second act.`,
    doomer: `"${topic}" could be harmless. it could also be the first loose thread in a sweater already unraveling. either way, we should probably inspect it too closely.`,
  };
  return replies[persona];
}

export function healthResponse() {
  return { status: 'ok', service: 'Overthinking as a Service', mode: 'prototype' };
}