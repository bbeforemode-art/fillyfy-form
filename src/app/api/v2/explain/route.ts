import { errorResponse, ErrorCodes } from '@/lib/errors';
import type { NextRequest } from 'next/server';

const MAX_BODY_SIZE = 8 * 1024; // 8KB for v2 (structured context is larger)

export async function POST(request: NextRequest) {
  try {
    // Content-Type check
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return errorResponse('Content-Type must be application/json', ErrorCodes.VALIDATION_ERROR, 400);
    }

    // Body size check
    const body = await request.text();
    if (body.length > MAX_BODY_SIZE) {
      return errorResponse('Request body too large', ErrorCodes.PAYLOAD_TOO_LARGE, 413);
    }

    // Parse body
    let parsed: { systemPrompt?: string; userPrompt?: string; version?: string };
    try {
      parsed = JSON.parse(body);
    } catch {
      return errorResponse('Invalid JSON body', ErrorCodes.VALIDATION_ERROR, 400);
    }

    if (!parsed.systemPrompt || !parsed.userPrompt) {
      return errorResponse('systemPrompt and userPrompt are required', ErrorCodes.VALIDATION_ERROR, 400);
    }

    // Call Claude via Bedrock
    const explanation = await getExplanationFromPrompt(parsed.systemPrompt, parsed.userPrompt);

    // Return response with correlation ID
    const correlationId = request.headers.get('x-correlation-id') || 'unknown';

    return new Response(explanation, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-Id': correlationId,
        'X-Api-Version': '2.0',
      },
    });
  } catch (error) {
    console.error('v2/explain error:', error);
    return errorResponse('AI service unavailable', ErrorCodes.UPSTREAM_ERROR, 502);
  }
}

async function getExplanationFromPrompt(systemPrompt: string, userPrompt: string): Promise<string> {
  const { BedrockRuntimeClient, InvokeModelCommand } = await import('@aws-sdk/client-bedrock-runtime');

  const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const body = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 800,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const command = new InvokeModelCommand({
    modelId: 'us.anthropic.claude-sonnet-4-6',
    contentType: 'application/json',
    accept: 'application/json',
    body: new TextEncoder().encode(body),
  });

  const response = await client.send(command, { requestTimeout: 30_000 });
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  const text = responseBody.content?.[0]?.text || '';

  return text;
}
