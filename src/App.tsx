import { useState } from 'react';
import { CHARACTERS, INITIAL_GREETINGS } from './data/characters';
import { CharacterId, ChatMessage } from './types';
import { CharacterSelect } from './components/CharacterSelect';
import { ChatHeader } from './components/ChatHeader';
import { ChatThread } from './components/ChatThread';
import { ChatInput } from './components/ChatInput';

export default function App() {
  const [currentView, setCurrentView] = useState<'select' | 'chat'>('select');
  const [selectedCharId, setSelectedCharId] = useState<CharacterId>('bestie');
  const [isGenerating, setIsGenerating] = useState(false);

  // Maintain separate conversation history per character persona
  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>({
    bestie: [
      {
        id: 'init-bestie',
        role: 'assistant',
        content: INITIAL_GREETINGS.bestie,
        timestamp: 'Just now',
        characterId: 'bestie',
      },
    ],
    savage: [
      {
        id: 'init-savage',
        role: 'assistant',
        content: INITIAL_GREETINGS.savage,
        timestamp: 'Just now',
        characterId: 'savage',
      },
    ],
    detective: [
      {
        id: 'init-detective',
        role: 'assistant',
        content: INITIAL_GREETINGS.detective,
        timestamp: 'Just now',
        characterId: 'detective',
      },
    ],
    delulu: [
      {
        id: 'init-delulu',
        role: 'assistant',
        content: INITIAL_GREETINGS.delulu,
        timestamp: 'Just now',
        characterId: 'delulu',
      },
    ],
    doomer: [
      {
        id: 'init-doomer',
        role: 'assistant',
        content: INITIAL_GREETINGS.doomer,
        timestamp: 'Just now',
        characterId: 'doomer',
      },
    ],
  });

  const activeCharacter =
    CHARACTERS.find((c) => c.id === selectedCharId) || CHARACTERS[0];
  const activeMessages = threads[selectedCharId] || [];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isGenerating) return;

    const timeString = new Date().toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: timeString,
      characterId: selectedCharId,
    };

    // Update conversation thread with user message
    const updatedMessages = [...activeMessages, userMessage];
    setThreads((prev) => ({
      ...prev,
      [selectedCharId]: updatedMessages,
    }));

    setIsGenerating(true);

    const characterFallbacks: Record<string, string> = {
      bestie: 'wait my phone glitched for a second, what did you just say?',
      savage: 'my phone literally choked on how ridiculous that was, say it again',
      detective: 'there was an interruption in the record, resend that message',
      delulu: 'the universe briefly scrambled our telepathic connection, tell me that again',
      doomer: 'great even the connection is collapsing now, try resending',
    };

    const attemptFetch = async (retriesLeft = 1): Promise<string> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 22000);

      try {
        const historyPayload = updatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            characterId: selectedCharId,
            message: text.trim(),
            history: historyPayload.slice(-8),
          }),
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        return data.reply || characterFallbacks[selectedCharId] || 'hold on resend that my phone lagged out';
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (retriesLeft > 0) {
          // Brief pause before single automatic retry
          await new Promise((r) => setTimeout(r, 700));
          return attemptFetch(retriesLeft - 1);
        }
        console.warn('Chat request recovered with offline fallback:', err?.message || err);
        return characterFallbacks[selectedCharId] || 'hold on resend that my phone lagged out for a second';
      }
    };

    try {
      const replyContent = await attemptFetch(1);

      const replyMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        }),
        characterId: selectedCharId,
      };

      setThreads((prev) => ({
        ...prev,
        [selectedCharId]: [...(prev[selectedCharId] || []), replyMessage],
      }));
    } catch {
      const fallbackReply: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: characterFallbacks[selectedCharId] || 'hold on resend that my phone lagged out for a second',
        timestamp: new Date().toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        }),
        characterId: selectedCharId,
      };

      setThreads((prev) => ({
        ...prev,
        [selectedCharId]: [...(prev[selectedCharId] || []), fallbackReply],
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearChat = () => {
    setThreads((prev) => ({
      ...prev,
      [selectedCharId]: [
        {
          id: `init-${selectedCharId}-${Date.now()}`,
          role: 'assistant',
          content: INITIAL_GREETINGS[selectedCharId],
          timestamp: 'Just now',
          characterId: selectedCharId,
        },
      ],
    }));
  };

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col selection:bg-[#00F0FF] selection:text-[#070b16]">
      {currentView === 'select' ? (
        <div className="flex-1 flex flex-col justify-center">
          <CharacterSelect
            selectedId={selectedCharId}
            onSelect={(id) => setSelectedCharId(id)}
            onConfirm={() => setCurrentView('chat')}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden">
          <ChatHeader
            character={activeCharacter}
            onBackToSelect={() => setCurrentView('select')}
            onSwitchCharacter={(id) => setSelectedCharId(id)}
            onClearChat={handleClearChat}
            isGenerating={isGenerating}
          />

          <ChatThread
            character={activeCharacter}
            messages={activeMessages}
            isGenerating={isGenerating}
            onSelectPrompt={handleSendMessage}
          />

          <ChatInput
            character={activeCharacter}
            onSendMessage={handleSendMessage}
            isGenerating={isGenerating}
          />
        </div>
      )}
    </div>
  );
}
