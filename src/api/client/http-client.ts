import type { ApiErrorResponseDto } from '../models/common.dto.ts';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export class HttpClient {
  private readonly baseUrl: string;

  constructor(baseUrl = import.meta.env.VITE_API_BASE_URL ?? '') {
    this.baseUrl = baseUrl;
  }

  async request<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
    const method = options.method ?? 'GET';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (options.token) {
      headers.Authorization = `Bearer ${options.token}`;
    }

    const response = await fetch(this.resolveUrl(path), {
      method,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal,
    });

    const payload = await this.tryParseJson(response);

    if (!response.ok) {
      const apiError = (payload as ApiErrorResponseDto | null) ?? {
        message: response.statusText,
        statusCode: response.status,
      };
      throw apiError;
    }

    return payload as TResponse;
  }

  get<TResponse>(path: string, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<TResponse> {
    return this.request<TResponse>(path, { ...options, method: 'GET' });
  }

  post<TResponse, TBody>(path: string, body: TBody, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<TResponse> {
    return this.request<TResponse>(path, { ...options, method: 'POST', body });
  }

  private resolveUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (!this.baseUrl) return path;
    return `${this.baseUrl}${path}`;
  }

  private async tryParseJson(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }
}

export const apiClient = new HttpClient();
