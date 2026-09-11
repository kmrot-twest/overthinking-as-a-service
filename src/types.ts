export type CharacterId =
  | 'bestie'
  | 'savage'
  | 'detective'
  | 'delulu'
  | 'doomer'
  | 'overthinker'
  | 'delusional';

export interface Character {
  id: CharacterId;
  name: string;
  shortRole: string;
  tagline: string;
  description: string;
  replyVibe: string;
  sampleQuote: string;
  avatarIcon: 'users' | 'flame' | 'search' | 'sparkles' | 'skull';
  accentGradient: string;
  accentBorder: string;
  accentBadge: string;
  bubbleTheme: string;
  statusText: string;
  samplePrompts: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  characterId?: CharacterId;
}
