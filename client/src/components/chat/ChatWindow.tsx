import ReactMarkdown from 'react-markdown';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
}

interface Props {
  messages: Message[];
}

export default function ChatWindow({ messages }: Props) {
  return (
    <div className="flex flex-col px-4 py-6 space-y-4">
      {messages.map((msg) => (
        <ChatBubbleItem key={msg.id} message={msg} />
      ))}
    </div>
  );
}

function ChatBubbleItem({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-md">
          <span
            className="material-symbols-outlined text-on-primary"
            style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}
          >
            travel_explore
          </span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[80%] md:max-w-[65%] rounded-2xl px-4 py-3 shadow-sm transition-all ${
          isUser
            ? 'bg-primary text-on-primary rounded-br-sm'
            : 'bg-surface-container-high text-on-surface rounded-bl-sm border border-outline-variant/30'
        }`}
      >
        {message.isTyping ? (
          <div className="flex items-center gap-1.5 py-1">
            <span className="w-2 h-2 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          isUser ? (
            <p className="font-body-md text-body-md leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="markdown-body">
              <ReactMarkdown>
                {message.content}
              </ReactMarkdown>
            </div>
          )
        )}
      </div>
    </div>
  );
}
