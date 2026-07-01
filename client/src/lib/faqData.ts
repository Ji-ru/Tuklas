export interface FAQItem {
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    question: 'How do I edit my generated itinerary?',
    answer: 'Once your itinerary is generated, you can open the AI Chat window at any time and request edits conversationally (e.g., "Change Day 2 lunch to vegan food" or "Add another day in Coron"). The AI will update your trip plan in real-time, saving it directly to your Trips view.'
  },
  {
    question: 'How accurate are the estimated budgets?',
    answer: 'Budgets are estimated in Philippine Pesos (Php) based on current local averages for transport, tours, and food. However, prices vary depending on season, group size, and personal preference. We recommend keeping a buffer for tip-offs and unexpected local fees.'
  },
  {
    question: 'What happens if a ferry gets cancelled or schedules change?',
    answer: 'Philippine sea travel is subject to coast guard clearances and weather. Tuklas indicates the most stable transit routes, but if a ferry is cancelled, check local operator stations immediately. Alternative routes (like small-plane flights or land-route detours) can be dynamically re-routed via our AI travel chatbot.'
  },
  {
    question: 'Is my personal travel data kept private?',
    answer: 'Absolutely. We do not sell your travel details. All generated itineraries and chat histories are stored securely and privately in your browser session and database storage, ensuring your personal vacation logs remain yours.'
  },
  {
    question: 'Is it free to use Tuklas?',
    answer: 'Yes! It is 100% free to generate, view, edit, and share itineraries on Tuklas. We require no credit cards or upfront commitments—just start planning your dream island holiday.'
  },
  {
    question: 'How often is the transit/schedule data refreshed?',
    answer: 'Our transit and regional databases are continuously updated to reflect major ferry route changes, seasonal flight adjustments, and local operator rates, ensuring you get accurate suggestions.'
  },
  {
    question: 'Can I plan multi-island trips, or only single destinations?',
    answer: 'Tuklas is built specifically for the archipelagic nature of the Philippines! You can seamlessly plan multi-island routes (like Cebu to Bohol, or Coron to El Nido) complete with transit schedules, ferry details, and connecting flights.'
  },
  {
    question: 'Do I need an account to save my itineraries?',
    answer: 'No, Tuklas automatically caches your latest itinerary in your browser storage so it persists between sessions. However, to save multiple separate trips permanently, we recommend bookmarking or copying the shareable trip link.'
  }
];
