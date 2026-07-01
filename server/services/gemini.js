import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { env } from '../config/env.js';
import { fetchActivityImage } from './images.js';

let genAI;
if (env.GEMINI_API_KEY && env.GEMINI_API_KEY !== 'dummy-key') {
  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
} else {
  console.warn('WARNING: GEMINI_API_KEY is not defined or is dummy. AI generation will fail.');
}

// Zod schema to validate Gemini's JSON response structure
const activitySchema = z.object({
  id: z.number(),
  type: z.string(),
  time: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().optional().default(''),
  mapTop: z.string().optional().default('50%'),
  mapLeft: z.string().optional().default('50%'),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

const daySchema = z.object({
  dayNumber: z.number(),
  dayTitle: z.string(),
  transitDetails: z.object({
    mode: z.string(),
    departureTime: z.string().optional(),
    arrivalTime: z.string().optional(),
    duration: z.string(),
  }).optional(),
  routingRationale: z.string().optional(),
  estimatedCost: z.string().optional(),
  activities: z.array(activitySchema).min(1),
});

const itinerarySchema = z.object({
  title: z.string(),
  duration: z.string(),
  days: z.array(daySchema).min(1),
});

// Timeout wrapper for promises
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Gemini API timed out after ${ms / 1000}s`)), ms)
    ),
  ]);
}

export async function generateItineraryFromAI(params) {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: `You are Tuklas AI, an elite Philippine travel planner specializing in high-end, customized itineraries.
Your task is to curate an unforgettable, detailed travel itinerary.
You must respond with a raw JSON object only. Do not include markdown code block syntax (like \`\`\`json or \`\`\`), no backticks, and no conversational lead-in or explanation. Just start with { and end with }.

The JSON structure MUST follow this schema exactly:
{
  "title": "A creative title for this trip",
  "duration": "E.g., 4 Days, 3 Nights",
  "days": [
    {
      "dayNumber": 1,
      "dayTitle": "Theme or highlight of Day 1",
      "transitDetails": {
        "mode": "E.g., flight, ferry, bus, van, tricycle",
        "departureTime": "E.g., 09:00 AM (optional)",
        "arrivalTime": "E.g., 10:30 AM (optional)",
        "duration": "E.g., 1h 30m"
      },
      "routingRationale": "A one-line routing rationale explaining the logistics of this day.",
      "estimatedCost": "Estimated cost in Philippine Peso, e.g. ₱3,500 PHP per person",
      "activities": [
        {
          "id": 1,
          "type": "E.g., Arrival, Dining, Sightseeing, Activity, Check-in, Leisure",
          "time": "E.g., 09:00 AM",
          "title": "Name of the venue or activity",
          "description": "A descriptive summary highlighting the unique experience.",
          "image": "A high-quality Unsplash image URL related to the activity, venue, or place (use a realistic, working link)",
          "mapTop": "Percentage for UI coordinates from 15% to 85% (e.g., '35%')",
          "mapLeft": "Percentage for UI coordinates from 15% to 85% (e.g., '45%')",
          "lat": 10.3075, // A valid geographical latitude number
          "lng": 123.9794 // A valid geographical longitude number
        }
      ]
    }
  ]
}

Rules:
- Provide 3 to 4 activities per day.
- Use actual well-known spots, restaurants, and resorts in the Philippines.`
  });

  const notesText = params.notes ? `\nSpecial requests: ${params.notes}` : '';

  const userPrompt = `Generate a travel itinerary for:
Hub: ${params.hub} (Region: ${params.region || 'Philippines'})
Duration: ${params.duration} days
Group: ${params.travelGroup || 'Solo'}
Budget: ${params.budget || 'Mid-range'} ${params.budgetBasis ? `(${params.budgetBasis})` : ''}
Accommodation: ${params.accommodation || 'Hotel'}
Dietary: ${params.dietary || 'No Restrictions'}
Vibes: ${params.purpose || 'Leisure'}
Pace: ${params.pace || 'Moderate'}${notesText}`;

  // Call Gemini with a 45-second timeout
  const result = await withTimeout(
    model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    }),
    45000
  );

  const cleanedResponse = result.response.text().trim();

  // Parse the JSON
  let parsed;
  try {
    parsed = JSON.parse(cleanedResponse);
  } catch (parseErr) {
    console.error('Failed to parse Gemini output as JSON. Raw output:', cleanedResponse.substring(0, 200));
    const error = new Error('AI did not return a valid JSON structure.');
    error.status = 500;
    error.isOperational = true;
    throw error;
  }

  // Validate the parsed JSON against our schema
  const validation = itinerarySchema.safeParse(parsed);
  if (!validation.success) {
    console.error('Gemini response failed schema validation:', validation.error.format());
    const error = new Error('AI returned an unexpected data structure. Please try again.');
    error.status = 500;
    error.isOperational = true;
    throw error;
  }

  const finalItinerary = validation.data;

  // Enhance activities with Wikipedia/Fallback images
  await Promise.all(
    finalItinerary.days.map(async (day) => {
      await Promise.all(
        day.activities.map(async (activity) => {
          activity.image = await fetchActivityImage(activity.title, params.hub, activity.type);
        })
      );
    })
  );

  return finalItinerary;
}

// ─────────────────────────────────────────────
// Versatile Chat Function (Dual-Mode)
// ─────────────────────────────────────────────
const CHAT_SYSTEM_PROMPT = `You are Tuklas AI, an elite Philippine travel assistant created by Tuklas.

## YOUR ONLY PURPOSE
Your ONLY purpose is to help users explore and plan trips within the Philippines. You can:
- Answer questions about Philippine destinations, islands, cities, provinces, and regions.
- Recommend activities, food, adventures, cultural experiences, and hidden gems in any Philippine location.
- Help users build a travel itinerary when they are ready.

## STRICT RESTRICTION (GUARDRAIL)
You MUST politely decline ANY request that is NOT related to Philippine travel, destinations, food, culture, or itinerary planning. This includes but is not limited to:
- Math problems, coding questions, homework help
- General trivia unrelated to the Philippines
- Personal advice, relationship questions
- Any topic outside Philippine travel

When declining, be warm and friendly. Example: "That's an interesting question! But I'm Tuklas AI — I specialize exclusively in Philippine travel. 🌴 Is there a destination in the Philippines I can help you explore instead?"

## CONVERSATIONAL MODE
When the user is asking general questions about a place, activity, food, or experience in the Philippines:
- Be enthusiastic, knowledgeable, and specific. Use real place names, restaurant names, and activity names.
- Use markdown formatting (bold, bullet points, emojis) to make responses engaging and scannable.
- Suggest related things they might enjoy.
- If the conversation naturally leads to trip planning, gently offer to create an itinerary.

## ITINERARY MODIFICATION MODE
When the user asks to modify or update an existing itinerary (e.g., "Swap Day 2 with a beach trip", "Make it cheaper", "Add more food"):
1. Acknowledge their request enthusiastically and explain how you will modify the itinerary.
2. DO NOT output the JSON itinerary yet.
3. Ask the user: "Is there anything else you'd like to change before I finalize the updated itinerary?"
4. ONLY when the user explicitly confirms they are ready (e.g., "No, that's it", "Finalize it", "Yes, go ahead"), or if they explicitly ask to see the updated itinerary right away, output the <<<ITINERARY_JSON>>> block.

## ITINERARY GENERATION (OR FINALIZATION) MODE
When the user explicitly asks you to generate/create/make a new itinerary, OR when they confirm they are ready to finalize an updated itinerary, you MUST:
1. First, provide a brief conversational message confirming the itinerary is ready.
2. Then, on a NEW LINE, output EXACTLY the marker <<<ITINERARY_JSON>>> followed by a valid JSON object on the next line, then <<<END_ITINERARY_JSON>>> on the line after.

The JSON MUST follow this exact schema:
{
  "title": "A creative title for this trip",
  "duration": "E.g., 4 Days, 3 Nights",
  "days": [
    {
      "dayNumber": 1,
      "dayTitle": "Theme or highlight of Day 1",
      "transitDetails": {
        "mode": "E.g., flight, ferry, bus, van, tricycle",
        "departureTime": "E.g., 09:00 AM (optional)",
        "arrivalTime": "E.g., 10:30 AM (optional)",
        "duration": "E.g., 1h 30m"
      },
      "routingRationale": "A one-line routing rationale explaining the logistics of this day.",
      "estimatedCost": "Estimated cost in Philippine Peso, e.g. ₱3,500 PHP per person",
      "activities": [
        {
          "id": 1,
          "type": "E.g., Arrival, Dining, Sightseeing, Activity, Check-in, Leisure",
          "time": "E.g., 09:00 AM",
          "title": "Name of the venue or activity",
          "description": "A descriptive summary highlighting the unique experience.",
          "image": "",
          "mapTop": "50%",
          "mapLeft": "50%",
          "lat": 10.3075,
          "lng": 123.9794
        }
      ]
    }
  ]
}

Rules for itinerary generation:
- Provide 3 to 4 activities per day.
- Use actual well-known spots, restaurants, and resorts in the Philippines.
- Include valid lat/lng coordinates for each activity.
- If the user hasn't specified details (duration, budget, etc.), use sensible defaults (3 days, mid-range, solo, moderate pace).
- ONLY output the JSON block when the user explicitly asks for an itinerary. Do NOT output JSON for casual questions.`;

export async function chatWithAI(messages) {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: CHAT_SYSTEM_PROMPT,
  });

  // Convert frontend messages to Gemini format
  const geminiHistory = messages.slice(0, -1).map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const lastMessage = messages[messages.length - 1];

  const chat = model.startChat({ history: geminiHistory });

  const result = await withTimeout(
    chat.sendMessage(lastMessage.content),
    45000
  );

  const responseText = result.response.text().trim();

  // Check if the response contains an itinerary JSON block
  const itineraryMatch = responseText.match(
    /<<<ITINERARY_JSON>>>\s*([\s\S]*?)\s*<<<END_ITINERARY_JSON>>>/
  );

  let reply = responseText;
  let itinerary = null;

  if (itineraryMatch) {
    // Extract the conversational part (everything before the marker)
    reply = responseText.split('<<<ITINERARY_JSON>>>')[0].trim();

    // Parse and validate the itinerary JSON
    try {
      const parsed = JSON.parse(itineraryMatch[1].trim());
      const validation = itinerarySchema.safeParse(parsed);

      if (validation.success) {
        itinerary = validation.data;

        // Enhance activities with images
        await Promise.all(
          itinerary.days.map(async (day) => {
            await Promise.all(
              day.activities.map(async (activity) => {
                const hub = itinerary.title || 'Philippines';
                activity.image = await fetchActivityImage(activity.title, hub, activity.type);
              })
            );
          })
        );
      } else {
        console.error('[CHAT] Itinerary JSON failed validation:', validation.error.format());
      }
    } catch (parseErr) {
      console.error('[CHAT] Failed to parse itinerary JSON from chat response:', parseErr.message);
    }
  }

  return { reply, itinerary };
}
