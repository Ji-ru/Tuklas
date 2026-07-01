import { useState, useRef } from 'react';

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, disabled, placeholder }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-grow textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  return (
    <div className="border-t border-surface-variant bg-surface px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder || "Tell me where you'd like to go…"}
            className="w-full resize-none rounded-2xl border border-outline-variant bg-surface-container-low text-on-surface font-body-md text-body-md px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-on-surface-variant/50 disabled:opacity-50 transition-all scrollbar-hide"
            style={{ minHeight: '48px', maxHeight: '160px' }}
          />
          {/* Character count hint on long input */}
          {value.length > 150 && (
            <span className="absolute bottom-2 right-3 font-label-sm text-label-sm text-on-surface-variant/40">
              {value.length}
            </span>
          )}
        </div>
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-md hover:bg-primary-container hover:text-on-primary transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 cta-glow"
        >
          <span className="material-symbols-outlined pl-0.5" style={{ fontVariationSettings: "'FILL' 1", fontSize: '22px' }}>
            send
          </span>
        </button>
      </div>
      <div className="max-w-3xl mx-auto flex gap-3 mt-2">
        <div className="flex-1">
          <p className="text-center font-label-sm text-label-sm text-on-surface-variant/40">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
        <div className="w-12 flex-shrink-0 invisible" />
      </div>
    </div>
  );
}
