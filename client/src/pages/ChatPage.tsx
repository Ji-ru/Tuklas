import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ChatWindow, { type Message } from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';

// ─────────────────────────────────────────────
// Suggestion chips for common queries
// ─────────────────────────────────────────────
const SUGGESTION_CHIPS = [
  '🏖️ Best beaches in Palawan',
  '🍜 Must-try street food in Cebu',
  '🧗 Top adventures in Siargao',
  '🏛️ Heritage spots in Vigan',
  '📋 Plan a 3-day trip to Boracay',
];

let msgCounter = 0;
function makeId() { return `msg-${++msgCounter}`; }

const GREETING_MESSAGE = `Hi there! I'm **Tuklas AI** 🌴 — your personal Philippine travel assistant.

I can help you in two ways:

**🗣️ Ask me anything** about Philippine destinations — food, activities, adventures, hidden gems, and more!

**📋 Create an itinerary** — just tell me where you want to go, how long, and I'll build a complete travel plan for you.

What would you like to explore today?`;

// ─────────────────────────────────────────────
// Main ChatPage Component
// ─────────────────────────────────────────────
export default function ChatPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const prefilledHub = searchParams.get('hub');
  const prefilledItinerary = location.state?.itineraryData;

  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(!prefilledHub && !prefilledItinerary);

  const initialMessage = prefilledItinerary 
    ? `✨ I see you want to customize your **${prefilledItinerary.title}**!\n\nHow would you like to modify it? For example:\n- *"Make it cheaper"* \n- *"Swap Day 2 with a beach trip"*\n- *"Add more food spots"*`
    : prefilledHub
      ? `Hi there! I'm **Tuklas AI** 🌴\n\nI see you're interested in **${prefilledHub}**! Great choice.\n\nI can answer any questions you have about this destination — food, activities, hidden gems — or I can create a full itinerary for you. What would you like to do?`
      : GREETING_MESSAGE;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: makeId(),
      role: 'assistant',
      content: initialMessage,
    },
  ]);

  // Conversation history for the API (excludes typing indicators)
  const chatHistoryRef = useRef<{ role: 'user' | 'assistant'; content: string }[]>(
    prefilledItinerary
      ? [
          { role: 'user', content: `Context: Here is my current generated itinerary. Please help me modify it based on my next requests.\n\n\`\`\`json\n${JSON.stringify(prefilledItinerary, null, 2)}\n\`\`\`` },
          { role: 'assistant', content: 'I am ready to help you modify this itinerary! What would you like to change?' }
        ]
      : prefilledHub
        ? [{ role: 'assistant', content: `I see you're interested in ${prefilledHub}. I can answer questions or create an itinerary.` }]
        : []
  );

  const handleResetChat = useCallback(() => {
    setSearchParams({});
    setShowSuggestions(true);
    chatHistoryRef.current = [];
    setMessages([
      {
        id: makeId(),
        role: 'assistant',
        content: GREETING_MESSAGE,
      },
    ]);
  }, [setSearchParams]);

  const isMounted = useRef(true);
  const isInitialMount = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Update chat state if the ?hub= URL parameter changes mid-session
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const hub = searchParams.get('hub');
    if (hub) {
      chatHistoryRef.current = [{ role: 'assistant', content: `I see you're interested in ${hub}. I can answer questions or create an itinerary.` }];
      setMessages([
        {
          id: makeId(),
          role: 'assistant',
          content: `Hi there! I'm **Tuklas AI** 🌴\n\nI see you're interested in **${hub}**! Great choice.\n\nI can answer any questions you have about this destination — food, activities, hidden gems — or I can create a full itinerary for you. What would you like to do?`
        }
      ]);
      setShowSuggestions(false);
    }
  }, [searchParams]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async (userInput: string) => {
    if (isTyping) return;

    setShowSuggestions(false);

    // Add user message to UI
    setMessages(prev => [...prev, { id: makeId(), role: 'user', content: userInput }]);

    // Add user message to history
    chatHistoryRef.current.push({ role: 'user', content: userInput });

    // Show typing indicator
    setIsTyping(true);
    const typingId = makeId();
    setMessages(prev => [...prev, { id: typingId, role: 'assistant', content: '', isTyping: true }]);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistoryRef.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error (${response.status}). Is the backend running?`);
      }

      const data = await response.json();

      // Add assistant reply to history
      chatHistoryRef.current.push({ role: 'assistant', content: data.reply });

      // Replace typing indicator with actual reply
      setMessages(prev =>
        prev.map(m => m.id === typingId ? { ...m, content: data.reply, isTyping: false } : m)
      );

      // If the AI generated an itinerary, save it and redirect
      if (data.itinerary) {
        localStorage.setItem('tuklas_latest_itinerary', JSON.stringify(data.itinerary));

        // Add a follow-up message announcing the itinerary
        setTimeout(() => {
          if (!isMounted.current) return;
          setMessages(prev => [...prev, {
            id: makeId(),
            role: 'assistant',
            content: `✨ Your itinerary is ready! Redirecting you to view it now.`,
          }]);
          setTimeout(() => {
            if (isMounted.current) navigate('/sample-trip');
          }, 1500);
        }, 800);
      }

    } catch (err) {
      // Revert history so we don't send duplicate user messages on retry
      chatHistoryRef.current.pop();
      // Replace typing indicator with error message
      const errorMessage = `Oops! I couldn't connect to the server. Please make sure the backend is running.\n\nError: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setMessages(prev =>
        prev.map(m => m.id === typingId ? { ...m, content: errorMessage, isTyping: false } : m)
      );
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, navigate]);

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-background pb-24 md:pb-0">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="pt-[72px] md:pt-[88px] border-b border-surface-variant bg-surface/95 backdrop-blur-sm sticky top-0 z-20 shadow-sm"
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center shadow-md">
              <span
                className="material-symbols-outlined text-on-primary"
                style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
              >
                travel_explore
              </span>
            </div>
            <div>
              <h1 className="font-headline-md text-base md:text-headline-md text-primary leading-tight">Tuklas AI</h1>
              <p className="font-label-sm text-[11px] md:text-label-sm text-secondary flex items-center gap-1">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-secondary inline-block" />
                <span className="hidden sm:inline">Online · Philippine Travel Assistant</span>
                <span className="sm:hidden">Online</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-surface-container"
              title="Start a New Chat"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_comment</span>
              <span className="hidden sm:inline">New Chat</span>
            </button>
            <Link
              to="/plan"
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-surface-container"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>tune</span>
              <span className="hidden sm:inline">Use Form Instead</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto min-h-0 relative">
        <div className="max-w-3xl mx-auto w-full flex flex-col min-h-full">
          <div className="flex-1" />
          <ChatWindow messages={messages} />

          {/* Suggestion Chips — shown on initial load */}
          {showSuggestions && !isTyping && (
            <div className="px-4 pb-3">
              <p className="font-label-sm text-label-sm text-on-surface-variant/60 mb-2 uppercase tracking-wider">Try asking</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTION_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSend(chip)}
                    className="px-3 py-1.5 rounded-full border border-secondary/40 bg-secondary-container/30 text-on-secondary-container hover:bg-secondary-container hover:border-secondary transition-all active:scale-95 font-label-sm text-label-sm"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Auto-scroll target */}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Chat Input */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.1 }}
      >
        <ChatInput
          onSend={handleSend}
          placeholder="Ask any PH destination or plan a trip"
          disabled={isTyping}
        />
      </motion.div>
    </div>
  );
}
