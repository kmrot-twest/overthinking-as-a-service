import { ArrowLeft, Trash2, RefreshCw } from 'lucide-react';
import { CHARACTERS } from '../data/characters';
import { Character, CharacterId } from '../types';
import { CharacterAvatar } from './CharacterAvatar';

interface ChatHeaderProps {
  character: Character;
  onBackToSelect: () => void;
  onSwitchCharacter: (id: CharacterId) => void;
  onClearChat: () => void;
  isGenerating: boolean;
}

export function ChatHeader({
  character,
  onBackToSelect,
  onSwitchCharacter,
  onClearChat,
  isGenerating,
}: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-20 w-full bg-[#090e1c]/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-3 flex items-center justify-between gap-3">
      {/* Left: Back button & Character info */}
      <div className="flex items-center gap-3">
        <button
          id="back-to-friends-btn"
          onClick={onBackToSelect}
          className="p-2 rounded-xl bg-[#0f172a] hover:bg-[#1a253c] border border-slate-700/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Back to Friend Selection"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-2.5">
          <CharacterAvatar characterId={character.id} size="md" showStatus />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
                {character.name}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <span className={`w-1.5 h-1.5 rounded-full ${isGenerating ? 'bg-[#FFA900] animate-ping' : 'bg-[#00FF80] shadow-[0_0_6px_#00FF80]'}`} />
              <span>{isGenerating ? 'typing...' : character.statusText}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center/Right: Quick Switcher pills & Clear action */}
      <div className="flex items-center gap-2">
        {/* Quick character switcher for fast toggling */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-[#0d1424] rounded-xl border border-slate-800">
          {CHARACTERS.map((char) => {
            const isActive = char.id === character.id;
            let activePillStyle = 'bg-[#00F0FF] text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]';
            if (char.id === 'savage') {
              activePillStyle = 'bg-[#FF6800] text-slate-950 shadow-[0_0_12px_rgba(255,104,0,0.4)]';
            } else if (char.id === 'detective') {
              activePillStyle = 'bg-gradient-to-r from-[#00F0FF] to-[#00FF80] text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]';
            } else if (char.id === 'delulu' || char.id === 'delusional') {
              activePillStyle = 'bg-[#00FF80] text-slate-950 shadow-[0_0_12px_rgba(0,255,128,0.4)]';
            } else if (char.id === 'doomer') {
              activePillStyle = 'bg-[#FFA900] text-slate-950 shadow-[0_0_12px_rgba(255,169,0,0.4)]';
            }

            return (
              <button
                key={char.id}
                id={`switch-to-${char.id}`}
                onClick={() => onSwitchCharacter(char.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? `${activePillStyle} font-bold`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {char.name.replace('The ', '')}
              </button>
            );
          })}
        </div>

        {/* Clear chat button */}
        <button
          id="clear-chat-btn"
          onClick={onClearChat}
          className="p-2 rounded-xl bg-[#0f172a] hover:bg-[#20100a] border border-slate-700/60 hover:border-[#FF6800]/50 text-slate-300 hover:text-[#FF6800] transition-colors cursor-pointer"
          title="Clear this conversation"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </header>
  );
}
