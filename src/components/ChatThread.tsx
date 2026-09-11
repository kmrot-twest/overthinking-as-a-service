import React, { useEffect, useRef } from 'react';
import { Character, ChatMessage } from '../types';
import { CharacterAvatar } from './CharacterAvatar';

interface ChatThreadProps {
  character: Character;
  messages: ChatMessage[];
  isGenerating: boolean;
  onSelectPrompt: (prompt: string) => void;
}

export function ChatThread({
  character,
  messages,
  isGenerating,
  onSelectPrompt,
}: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 flex flex-col justify-between overflow-y-auto space-y-4">
      {/* Starting conversation indicator */}
      <div className="text-center my-2">
        <div className="inline-block px-3 py-1 rounded-full bg-[#0d1424] border border-slate-800 text-[11px] text-slate-300">
          Texting with {character.name}
        </div>
      </div>

      {/* Message List */}
      <div className="space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`flex gap-2.5 max-w-[85%] sm:max-w-[75%] ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Character avatar for assistant messages */}
                {!isUser && (
                  <div className="mt-1">
                    <CharacterAvatar characterId={character.id} size="sm" />
                  </div>
                )}

                {/* Message Bubble */}
                <div>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm sm:text-[15px] leading-relaxed break-words shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-[#FF6800] to-[#FFA900] text-slate-950 font-medium rounded-tr-xs shadow-[0_4px_16px_rgba(255,104,0,0.3)]'
                        : `${character.bubbleTheme} border rounded-tl-xs shadow-lg`
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Timestamp & Status */}
                  <div
                    className={`flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 px-1 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isUser && <span className="text-[#00FF80]">• Delivered</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Lightweight "typing..." bubble indicator */}
        {isGenerating && (
          <div className="flex items-start gap-2.5 max-w-[85%]">
            <div className="mt-1">
              <CharacterAvatar characterId={character.id} size="sm" />
            </div>
            <div>
              <div
                className={`px-4 py-3 rounded-2xl rounded-tl-xs ${character.bubbleTheme} border flex items-center gap-1.5 shadow-md`}
              >
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF] animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-[#00FF80] shadow-[0_0_6px_#00FF80] animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-[#FFA900] shadow-[0_0_6px_#FFA900] animate-bounce" />
              </div>
              <div className="text-[10px] text-slate-400 mt-1 px-1">
                {character.name} is typing...
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Starter Prompts chips when conversation is fresh */}
      {messages.length <= 1 && !isGenerating && (
        <div className="pt-6 pb-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
            Tap a situation or type your own below:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {character.samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                id={`prompt-chip-${idx}`}
                onClick={() => onSelectPrompt(prompt)}
                className="p-2.5 text-left rounded-xl bg-[#0c1322]/90 hover:bg-[#121c30] border border-slate-800 hover:border-[#00F0FF]/50 text-xs text-slate-300 hover:text-white transition-all duration-150 cursor-pointer shadow-sm"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
