import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import type { FieldContext, ExplanationResponse } from './types';

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const MODEL_ID = 'us.anthropic.claude-sonnet-4-6';

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
  let prompt = `Form Context:
- Page: ${context.pageTitle || 'Unknown page'}
- Form Title: ${context.formTitle || 'Unknown form'}
- Field Label: ${context.fieldLabel}
- Field Placeholder: ${context.fieldPlaceholder || 'none'}
- Field Type: ${context.fieldType || 'text'}
- Field Name/ID: ${context.fieldName || 'none'}
- Field Required: ${context.fieldRequired ? 'Yes' : 'No'}`;

  if (context.surroundingHtml) {
    prompt += `\n- Surrounding HTML context: ${context.surroundingHtml}`;
  }

  prompt += '\n\nPlease explain this field. If the field label says "Unknown field", use the surrounding HTML context and field name/ID to determine what this field is actually asking for.';

  return prompt;
}

/**
 * Calls Claude via AWS Bedrock with field context and returns a structured explanation.
 * Throws on timeout (30s) or API errors.
 */
export async function getExplanation(context: FieldContext): Promise<ExplanationResponse> {
  const body = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(context) }],
  });

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: new TextEncoder().encode(body),
  });

  const response = await client.send(command, {
    requestTimeout: 30_000,
  });

  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  const text = responseBody.content?.[0]?.text || '';

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Invalid response format from AI');
  }

  return JSON.parse(jsonMatch[0]) as ExplanationResponse;
}
