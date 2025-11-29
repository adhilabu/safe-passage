import { GoogleGenAI } from "@google/genai";
import { SafetyPriority, ItineraryResult, IcebreakerResult } from '../types';

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
console.log('🔑 API Key loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'MISSING');
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

// Helper to sanitize and extract grounding metadata
const extractSources = (groundingChunks: any[]): { title: string; uri: string }[] => {
  if (!groundingChunks) return [];
  const sources: { title: string; uri: string }[] = [];

  groundingChunks.forEach(chunk => {
    if (chunk.web?.uri) {
      sources.push({
        title: chunk.web.title || new URL(chunk.web.uri).hostname,
        uri: chunk.web.uri
      });
    }
  });
  return sources;
};

export const generateEthicalItinerary = async (
  destination: string,
  priorities: SafetyPriority | SafetyPriority[],
  days: number,
  itineraryType: string = 'General Sightseeing'
): Promise<ItineraryResult> => {
  if (!apiKey) throw new Error("API Key missing");

  // Handle both single priority (backward compatibility) and multiple priorities
  const priorityList = Array.isArray(priorities) ? priorities : [priorities];
  const priorityText = priorityList.join(', ');

  const prompt = `
    Create a detailed ${days}-day travel itinerary for ${destination}.
    
    CRITICAL USER PRIORITIES: ${priorityText}.
    TRAVEL STYLE/TYPE: ${itineraryType}
    
    MANDATORY GUIDELINES (Responsible AI):
    1. SAFETY FIRST: Filter recommendations through the lens of ALL these priorities: ${priorityText}. Identify well-lit areas, safe transport, and specific safety checks (e.g., locking mechanisms, neighborhood reputation).
    2. ETHICAL CONSUMPTION: Prioritize minority-owned, women-owned, or community-run businesses. Avoid global chains unless they are the only safe option.
    3. COUNTER BIAS: Explicitly avoid stereotypes. Base safety ratings on recent, factual reports.
    4. ACCESSIBILITY: If Accessibility is one of the priorities, ensure all locations have ramp access and accessible restrooms.
    5. INTERSECTIONAL APPROACH: Consider how these priorities intersect. For example, if both "Solo Female Safety" and "Minority Community Support" are selected, recommend places that are safe for solo female travelers AND support minority communities.
    6. TRAVEL STYLE: Tailor the itinerary to the specified travel style (${itineraryType}). For example:
       - Trekking/Hiking: Focus on trails, nature spots, and outdoor activities
       - Food Exploration: Highlight local eateries, markets, and culinary experiences
       - Cultural Immersion: Emphasize museums, historical sites, and cultural events
       - Sightseeing: Include major landmarks and scenic viewpoints
    
    FORMAT:
    Return the response in clean Markdown.
    Start with a "Safety & Ethics Briefing" specific to ${destination} and these priorities: ${priorityText}.
    Then list Day 1, Day 2, etc.
    For each recommendation, explain *why* it is safe/ethical and how it addresses the selected priorities and aligns with the ${itineraryType} style.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Use Grounding for transparency
        temperature: 0.4, // Lower temperature for more factual safety info
      }
    });

    const markdown = response.text || "No itinerary generated.";
    const sources = extractSources(response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);

    return { markdown, sources };

  } catch (error) {
    console.error("Gemini Itinerary Error:", error);
    throw new Error("Failed to generate safe itinerary. Please try again.");
  }
};

export const generateSafetyIcebreaker = async (
  recipientName: string,
  priority: SafetyPriority,
  myLocation: string
): Promise<IcebreakerResult> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    Draft a short, friendly, and safety-conscious message to start a conversation with a potential travel buddy named ${recipientName}.
    
    Context:
    - We matched because we both prioritize: ${priority}.
    - I am currently in: ${myLocation}.
    
    Goal:
    - Break the ice warmly.
    - IMMEDIATELY establish a collaborative safety footing (e.g., "Let's vet accommodations together" or "Interested in sharing live locations if we meet?").
    - Keep it under 50 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return { message: response.text || "Hi! Let's connect safely." };
  } catch (error) {
    console.error("Gemini Icebreaker Error:", error);
    return { message: `Hi ${recipientName}, I noticed we both care about ${priority}. Would love to connect!` };
  }
};