import React, { useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon, SparklesIcon } from './icons/Icons';
import { Button } from './ui/Button';

type UIMessage = ChatMessage & { id: number };

interface ChatInterfaceProps {
  messages: UIMessage[];
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  inputPlaceholder?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  renderMessageAddon?: (message: UIMessage) => React.ReactNode;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  input,
  setInput,
  onSend,
  isLoading,
  inputPlaceholder = "Type your message...",
  header,
  footer,
  renderMessageAddon,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const isAiTyping = isLoading && messages.length > 0 && messages[messages.length - 1]?.sender === 'user';
  const isAiStreaming = isLoading && messages.length > 0 && messages[messages.length - 1]?.sender === 'ai';

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      {header}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary self-start shrink-0">
                <SparklesIcon className="w-5 h-5" />
              </div>
            )}
            <div
              className={`p-3 rounded-lg max-w-md ${
                msg.sender === 'ai'
                  ? 'bg-card-light dark:bg-card-dark'
                  : 'bg-primary text-white'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              {isAiStreaming && msg.id === messages[messages.length - 1].id && (
                  <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse inline-block ml-1"></div>
              )}
              {renderMessageAddon && renderMessageAddon(msg)}
            </div>
            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-accent text-background-dark flex items-center justify-center self-start shrink-0">
                <span className="font-bold text-sm">You</span>
              </div>
            )}
          </div>
        ))}
        {isAiTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary self-start shrink-0">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <div className="p-3 rounded-lg max-w-md bg-card-light dark:bg-card-dark">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm italic">AI sedang menaip...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-border-light dark:border-border-dark">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={inputPlaceholder}
            disabled={isLoading}
            className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
          />
          <Button onClick={onSend} disabled={isLoading || !input.trim()} size="icon">
            <SendIcon className="w-5 h-5" />
          </Button>
        </div>
        {footer}
      </div>
    </div>
  );
};
