import React, { useState, useRef, useEffect } from 'react';
import { SendHorizonal, CornerDownLeft } from 'lucide-react';
import { Character } from '../types';

interface ChatInputProps {
  character: Character;
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
}

export function ChatInput({
  character,
  onSendMessage,
  isGenerating,
}: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isGenerating && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isGenerating]);

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isGenerating) return;

    const messageToSend = text.trim();
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    onSendMessage(messageToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 w-full bg-[#070b16]/95 backdrop-blur-md border-t border-slate-800/80 p-3 sm:p-4">
      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 bg-[#0d1424] rounded-2xl border border-slate-700/60 focus-within:border-[#00F0FF] focus-within:ring-2 focus-within:ring-[#00F0FF]/25 p-1.5 sm:p-2 transition-all shadow-lg"
        >
          <textarea
            ref={textareaRef}
            id="chat-message-input"
            rows={1}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            placeholder={
              isGenerating
                ? `${character.name} is texting back...`
                : `Describe what just happened to ${character.name}...`
            }
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-400 text-sm sm:text-base px-3 py-2 outline-none resize-none max-h-32 min-h-[42px] leading-relaxed disabled:opacity-50"
          />

          <button
            type="submit"
            id="send-message-btn"
            disabled={!text.trim() || isGenerating}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#FF6800] to-[#FFA900] text-slate-950 font-bold hover:brightness-110 disabled:opacity-25 disabled:cursor-not-allowed transition-all shadow-[0_0_18px_rgba(255,104,0,0.3)] active:scale-95 shrink-0 cursor-pointer"
            title="Send text message (Enter)"
          >
            <SendHorizonal size={18} strokeWidth={2.4} />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 mt-1.5">
          <span className="flex items-center gap-1">
            <CornerDownLeft size={11} />
            <span>Press Enter to send</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF80]" />
            <span>Plain text only • No emojis</span>
          </span>
        </div>
      </div>
    </div>
  );
}
