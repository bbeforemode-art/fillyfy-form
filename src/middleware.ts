import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/privacy',
  '/terms',
  '/auth/sign-in(.*)',
  '/auth/sign-up(.*)',
  '/auth/callback',
  '/api/webhooks/razorpay',
  '/api/cron/(.*)',
  '/api/explain',  // TODO: Remove after auth flow is implemented in extension
]);

const ALLOWED_ORIGINS = [
  'https://fillyfy.com',
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (origin.startsWith('chrome-extension://')) return true;
  return ALLOWED_ORIGINS.includes(origin);
}

function addCorsHeaders(response: NextResponse, origin: string | null): NextResponse {
  if (origin && isAllowedOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
  }
  return response;
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const origin = req.headers.get('origin');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    return addCorsHeaders(response, origin);
  }

  // Protect non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  const response = NextResponse.next();
  return addCorsHeaders(response, origin);
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

// Export for testing
export { isAllowedOrigin };
