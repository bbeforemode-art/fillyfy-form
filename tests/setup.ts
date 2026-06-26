/**
 * Jest setup file — polyfills Web APIs not available in jsdom.
 */

// Polyfill Request for jsdom environment
if (typeof Request === 'undefined') {
  // @ts-expect-error polyfilling global
  globalThis.Request = class Request {
    url: string;
    method: string;
    headers: Map<string, string>;
    _body: string;

    constructor(url: string, init?: RequestInit) {
      this.url = url;
      this.method = init?.method || 'GET';
      this.headers = new Map();
      if (init?.headers) {
        if (init.headers instanceof Map) {
          init.headers.forEach((v: string, k: string) => this.headers.set(k.toLowerCase(), v));
        } else {
          const h = init.headers as Record<string, string>;
          for (const [k, v] of Object.entries(h)) {
            this.headers.set(k.toLowerCase(), v);
          }
        }
      }
      this._body = typeof init?.body === 'string' ? init.body : '';
      // Make headers.get work like the standard API
      const headersMap = this.headers;
      this.headers = {
        get: (name: string) => headersMap.get(name.toLowerCase()) || null,
        set: (name: string, value: string) => headersMap.set(name.toLowerCase(), value),
        has: (name: string) => headersMap.has(name.toLowerCase()),
      } as unknown as Map<string, string>;
    }

    async text() {
      return this._body;
    }

    async json() {
      return JSON.parse(this._body);
    }
  };
}

// Polyfill Response.json() static method for jsdom environment
if (typeof Response === 'undefined' || !Response.json) {
  // @ts-expect-error polyfilling global
  globalThis.Response = class Response {
    body: string;
    status: number;
    headers: Map<string, string>;

    constructor(body?: BodyInit | null, init?: ResponseInit) {
      this.body = typeof body === 'string' ? body : '';
      this.status = init?.status || 200;
      this.headers = new Map();
      if (init?.headers) {
        const h = init.headers as Record<string, string>;
        for (const [k, v] of Object.entries(h)) {
          this.headers.set(k, v);
        }
      }
    }

    async json() {
      return JSON.parse(this.body);
    }

    static json(data: unknown, init?: ResponseInit) {
      const body = JSON.stringify(data);
      return new Response(body, {
        ...init,
        headers: { 'Content-Type': 'application/json', ...(init?.headers as Record<string, string>) },
      });
    }
  };
}
