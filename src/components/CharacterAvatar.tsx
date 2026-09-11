import { Users, Flame, Search, Sparkles, Skull } from 'lucide-react';
import { CharacterId } from '../types';

interface CharacterAvatarProps {
  characterId: CharacterId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
}

export function CharacterAvatar({
  characterId,
  size = 'md',
  showStatus = false,
}: CharacterAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  }[size];

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 26,
    xl: 36,
  }[size];

  let bgClass = 'bg-gradient-to-br from-[#00F0FF] to-[#00a8c6] text-slate-950 shadow-[0_0_18px_rgba(0,240,255,0.4)]';
  let IconComponent = Users;

  if (characterId === 'savage') {
    bgClass = 'bg-gradient-to-br from-[#FF6800] to-[#FFA900] text-slate-950 shadow-[0_0_18px_rgba(255,104,0,0.4)]';
    IconComponent = Flame;
  } else if (characterId === 'detective') {
    bgClass = 'bg-gradient-to-br from-[#00F0FF] to-[#00FF80] text-slate-950 shadow-[0_0_18px_rgba(0,240,255,0.4)]';
    IconComponent = Search;
  } else if (characterId === 'delulu' || characterId === 'delusional') {
    bgClass = 'bg-gradient-to-br from-[#00FF80] to-[#FFA900] text-slate-950 shadow-[0_0_18px_rgba(0,255,128,0.4)]';
    IconComponent = Sparkles;
  } else if (characterId === 'doomer') {
    bgClass = 'bg-gradient-to-br from-[#FFA900] to-[#FF6800] text-slate-950 shadow-[0_0_18px_rgba(255,169,0,0.4)]';
    IconComponent = Skull;
  }

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <div
        className={`${sizeClasses} ${bgClass} rounded-2xl flex items-center justify-center font-bold shadow-lg ring-1 ring-white/20 transition-transform duration-200`}
      >
        <IconComponent size={iconSizes} strokeWidth={2.4} />
      </div>
      {showStatus && (
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00FF80] border-2 border-[#060913] rounded-full shadow-[0_0_8px_#00FF80]"
          title="Online"
        />
      )}
    </div>
  );
}
