import Anthropic from '@anthropic-ai/sdk';
import type { FieldContext, ExplanationResponse } from './types';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are Fillyfy, an expert form guide. A user is filling a form and needs help with a specific field. Respond ONLY with valid JSON in this exact format:
{
  "plain_explanation": "What this field is asking in simple terms",
  "what_to_write": "Exactly what the user should enter, with example",
  "why_asked": "Why this information is needed",
  "common_mistakes": ["mistake 1", "mistake 2"],
  "documents_needed": ["document 1"],
  "tips": "Any additional helpful tips"
}
Be concise, friendly, and reassuring. Use plain language a non-technical person can understand.`;

function buildUserPrompt(context: FieldContext): string {
  return `Form Context:
- Page: ${context.pageTitle || 'Unknown page'}
- Form Title: ${context.formTitle || 'Unknown form'}
- Field Label: ${context.fieldLabel}
- Field Placeholder: ${context.fieldPlaceholder || 'none'}
- Field Type: ${context.fieldType || 'text'}
- Field Required: ${context.fieldRequired ? 'Yes' : 'No'}

Please explain this field.`;
}

/**
 * Calls Claude API with field context and returns a structured explanation.
 * Throws on timeout (30s) or API errors.
 */
export async function getExplanation(context: FieldContext): Promise<ExplanationResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const message = await client.messages.create(
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildUserPrompt(context) }],
      },
      { signal: controller.signal }
    );

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI');
    }

    return JSON.parse(jsonMatch[0]) as ExplanationResponse;
  } finally {
    clearTimeout(timeout);
  }
}
