import { ArrowRight, MessageCircle } from 'lucide-react';
import { CHARACTERS } from '../data/characters';
import { Character, CharacterId } from '../types';
import { CharacterAvatar } from './CharacterAvatar';

interface CharacterSelectProps {
  selectedId: CharacterId;
  onSelect: (id: CharacterId) => void;
  onConfirm: () => void;
}

export function CharacterSelect({
  selectedId,
  onSelect,
  onConfirm,
}: CharacterSelectProps) {
  const activeChar = CHARACTERS.find((c) => c.id === selectedId) || CHARACTERS[0];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Header section */}
      <div className="text-center max-w-xl mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0a1626] border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-semibold mb-4 tracking-wide shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#00FF80] animate-pulse shadow-[0_0_8px_#00FF80]" />
          OVERTHINKING AS A SERVICE
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
          Who are we texting about this?
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Pick the AI friend you need right now. Get raw, instantaneous text-message reactions to whatever just happened in your life.
        </p>
      </div>

      {/* Character Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {CHARACTERS.map((char: Character) => {
          const isSelected = char.id === selectedId;

          // Electric Fusion dynamic active styling per persona
          let activeCardStyle = 'bg-[#0a1626] border-[#00F0FF] shadow-[0_0_30px_rgba(0,240,255,0.28)] ring-2 ring-[#00F0FF]/50 scale-[1.02]';
          let badgeStyle = 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40';
          let activeAccentText = 'text-[#00F0FF]';

          if (char.id === 'savage') {
            activeCardStyle = 'bg-[#1f1008] border-[#FF6800] shadow-[0_0_30px_rgba(255,104,0,0.28)] ring-2 ring-[#FF6800]/50 scale-[1.02]';
            badgeStyle = 'bg-[#FF6800]/20 text-[#FF6800] border border-[#FF6800]/40';
            activeAccentText = 'text-[#FF6800]';
          } else if (char.id === 'detective') {
            activeCardStyle = 'bg-[#071724] border-[#00F0FF] shadow-[0_0_30px_rgba(0,240,255,0.28)] ring-2 ring-[#00FF80]/50 scale-[1.02]';
            badgeStyle = 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00FF80]/40';
            activeAccentText = 'text-[#00FF80]';
          } else if (char.id === 'delulu' || char.id === 'delusional') {
            activeCardStyle = 'bg-[#081a13] border-[#00FF80] shadow-[0_0_30px_rgba(0,255,128,0.28)] ring-2 ring-[#00FF80]/50 scale-[1.02]';
            badgeStyle = 'bg-[#00FF80]/20 text-[#00FF80] border border-[#00FF80]/40';
            activeAccentText = 'text-[#00FF80]';
          } else if (char.id === 'doomer') {
            activeCardStyle = 'bg-[#201406] border-[#FFA900] shadow-[0_0_30px_rgba(255,169,0,0.28)] ring-2 ring-[#FFA900]/50 scale-[1.02]';
            badgeStyle = 'bg-[#FFA900]/20 text-[#FFA900] border border-[#FFA900]/40';
            activeAccentText = 'text-[#FFA900]';
          }

          return (
            <div
              key={char.id}
              id={`character-card-${char.id}`}
              onClick={() => onSelect(char.id)}
              className={`relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-200 text-left border ${
                isSelected
                  ? activeCardStyle
                  : `bg-[#0c111d]/90 border-slate-800 hover:bg-[#111728] hover:border-slate-700`
              }`}
            >
              {/* Selected indicator badge */}
              {isSelected && (
                <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${badgeStyle} text-[11px] font-semibold`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  Selected
                </div>
              )}

              <div>
                {/* Avatar & Title */}
                <div className="flex items-center gap-3.5 mb-4">
                  <CharacterAvatar characterId={char.id} size="lg" showStatus />
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      {char.name}
                    </h2>
                    <span className="text-xs font-medium text-slate-300">
                      {char.shortRole}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {char.description}
                </p>

                {/* Sample Quote Text Bubble */}
                <div className="p-3 rounded-xl bg-[#060913] border border-slate-800/80 mb-4">
                  <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-1">
                    Typical response
                  </div>
                  <div className="text-xs text-slate-200 italic">
                    "{char.sampleQuote}"
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  {char.statusText}
                </span>
                <span
                  className={`font-semibold transition-colors ${
                    isSelected ? activeAccentText : 'text-slate-400'
                  }`}
                >
                  {isSelected ? 'Ready to chat' : 'Click to select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary CTA button to open chat */}
      <button
        id="start-chatting-btn"
        onClick={onConfirm}
        className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#00F0FF] via-[#00FF80] to-[#FFA900] hover:brightness-110 text-slate-950 font-bold text-sm sm:text-base shadow-[0_0_25px_rgba(0,240,255,0.35)] hover:shadow-[0_0_35px_rgba(0,255,128,0.45)] transition-all duration-200 active:scale-98 cursor-pointer"
      >
        <MessageCircle size={18} strokeWidth={2.4} />
        <span>Text {activeChar.name}</span>
        <ArrowRight
          size={16}
          strokeWidth={2.4}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>

      {/* Clean helper pill */}
      <p className="text-xs text-slate-400 mt-4 text-center">
        No accounts, no therapists, zero emojis. Just instant unfiltered text reactions.
      </p>
    </div>
  );
}
