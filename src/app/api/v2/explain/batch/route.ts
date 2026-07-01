import { errorResponse, ErrorCodes } from '@/lib/errors';
import type { NextRequest } from 'next/server';

const MAX_BATCH_SIZE = 5;
const MAX_BODY_SIZE = 40 * 1024; // 40KB for batch

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return errorResponse('Content-Type must be application/json', ErrorCodes.VALIDATION_ERROR, 400);
    }

    const body = await request.text();
    if (body.length > MAX_BODY_SIZE) {
      return errorResponse('Request body too large', ErrorCodes.PAYLOAD_TOO_LARGE, 413);
    }

    let parsed: { contexts: Array<{ systemPrompt: string; userPrompt: string }> };
    try {
      parsed = JSON.parse(body);
    } catch {
      return errorResponse('Invalid JSON body', ErrorCodes.VALIDATION_ERROR, 400);
    }

    if (!parsed.contexts || !Array.isArray(parsed.contexts)) {
      return errorResponse('contexts array is required', ErrorCodes.VALIDATION_ERROR, 400);
    }

    if (parsed.contexts.length > MAX_BATCH_SIZE) {
      return errorResponse(`Batch size exceeds maximum of ${MAX_BATCH_SIZE}`, ErrorCodes.VALIDATION_ERROR, 400);
    }

    // Process each context sequentially (to avoid overwhelming Bedrock)
    const { BedrockRuntimeClient, InvokeModelCommand } = await import('@aws-sdk/client-bedrock-runtime');

    const client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const responses: string[] = [];

    for (const ctx of parsed.contexts) {
      try {
        const reqBody = JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 800,
          system: ctx.systemPrompt,
          messages: [{ role: 'user', content: ctx.userPrompt }],
        });

        const command = new InvokeModelCommand({
          modelId: 'us.anthropic.claude-sonnet-4-6',
          contentType: 'application/json',
          accept: 'application/json',
          body: new TextEncoder().encode(reqBody),
        });

        const response = await client.send(command, { requestTimeout: 30_000 });
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const text = responseBody.content?.[0]?.text || '';
        responses.push(text);
      } catch {
        // If one fails, push a fallback error response
        responses.push(JSON.stringify({
          detectedField: 'unknown',
          detectedLabel: 'Unknown',
          confidence: 'low',
          explanation: 'AI service encountered an error for this field.',
          whatToWrite: '',
          examples: [],
          commonMistakes: [],
          validation: [],
          privacy: [],
          recommendations: [],
        }));
      }
    }

    const correlationId = request.headers.get('x-correlation-id') || 'unknown';

    return Response.json(
      { responses },
      {
        status: 200,
        headers: {
          'X-Correlation-Id': correlationId,
          'X-Api-Version': '2.0',
        },
      }
    );
  } catch (error) {
    console.error('v2/explain/batch error:', error);
    return errorResponse('AI service unavailable', ErrorCodes.UPSTREAM_ERROR, 502);
  }
}
