import React, { useRef, useEffect } from 'react';
import { type ChatMessage } from '../types';
import { SparklesIcon, SendIcon } from './icons/Icons';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

type UIMessage = ChatMessage & { id: number };

interface ChatInterfaceProps {
  messages: UIMessage[];
  onSend: () => void;
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  header: React.ReactNode;
  footer: React.ReactNode;
  inputPlaceholder: string;
  renderMessageAddon?: (message: UIMessage) => React.ReactNode;
  isStoppable?: boolean;
  onStop?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSend,
  input,
  setInput,
  isLoading,
  header,
  footer,
  inputPlaceholder,
  renderMessageAddon,
  isStoppable = false,
  onStop,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const renderLoadingIndicator = () => (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-foreground-light/50 dark:bg-foreground-dark/50 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-foreground-light/50 dark:bg-foreground-dark/50 rounded-full animate-pulse [animation-delay:0.2s]"></div>
      <div className="w-2 h-2 bg-foreground-light/50 dark:bg-foreground-dark/50 rounded-full animate-pulse [animation-delay:0.4s]"></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col">
      {header}
      
      <div className="flex-1 overflow-y-auto pr-4 space-y-6">
        {messages.map((msg) => {
          const isLastMessage = msg.id === lastMessage?.id;
          // Show the loading indicator inside the last AI message bubble if it's still empty.
          const showLoadingIndicator = isLoading && isLastMessage && msg.sender === 'ai' && !msg.text;

          return (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary self-start shrink-0">
                  <SparklesIcon className="w-5 h-5"/>
                </div>
              )}
              <Card className={`p-4 max-w-lg ${msg.sender === 'ai' ? 'bg-background-light dark:bg-background-dark' : 'bg-primary text-white'}`}>
                {showLoadingIndicator ? (
                  renderLoadingIndicator()
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
                {renderMessageAddon && renderMessageAddon(msg)}
              </Card>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>
      
      <div className="mt-6">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={inputPlaceholder}
            className="w-full pl-4 pr-12 py-3 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:ring-2 focus:ring-primary focus:outline-none"
            disabled={isLoading}
          />
          <Button 
            onClick={onSend} 
            disabled={isLoading || input.trim() === ''} 
            size="icon" 
            className="absolute right-1.5 top-1/2 -translate-y-1/2"
          >
            <SendIcon />
          </Button>
        </div>
        {footer}
      </div>
    </div>
  );
};