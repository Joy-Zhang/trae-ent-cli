import type { Credentials } from './types.js';
import { getAccessToken } from './auth.js';
import { error } from '../utils/output.js';

const TOKEN_EXPIRED_CODE = 1002;

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  body?: any;
  query?: Record<string, any>;
  retried?: boolean;
}

export class ApiClient {
  private credentials: Credentials;
  private accessToken?: string;
  private lastRequestTime: number = 0;
  private readonly readQps: number = 2;
  private readonly writeQps: number = 1;

  constructor(credentials: Credentials) {
    this.credentials = credentials;
  }

  private async getToken(forceRefresh = false): Promise<string> {
    if (forceRefresh || !this.accessToken) {
      this.accessToken = await getAccessToken(this.credentials, forceRefresh);
    }
    return this.accessToken;
  }

  private async rateLimit(method: string): Promise<void> {
    const isWrite = method !== 'GET';
    const qps = isWrite ? this.writeQps : this.readQps;
    const minInterval = 1000 / qps;
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < minInterval) {
      await new Promise(resolve => setTimeout(resolve, minInterval - elapsed));
    }
    this.lastRequestTime = Date.now();
  }

  private buildUrl(path: string, query?: Record<string, any>): string {
    let url = `${this.credentials.baseUrl}${path}`;
    if (query) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      }
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    return url;
  }

  private isTokenExpiredError(data: any, status: number): boolean {
    if (status === 401) {
      return true;
    }
    if (status === 200 && typeof data === 'object' && data !== null && data.code === TOKEN_EXPIRED_CODE) {
      return true;
    }
    return false;
  }

  private async requestOnce<T>(options: RequestOptions): Promise<T> {
    await this.rateLimit(options.method);
    const forceRefresh = options.retried === true;
    const token = await this.getToken(forceRefresh);
    const url = this.buildUrl(options.path, options.query);

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const init: RequestInit = {
      method: options.method,
      headers,
    };

    if (options.body && options.method !== 'GET') {
      init.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, init);

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '1', 10);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return this.requestOnce({ ...options });
    }

    const contentType = response.headers.get('content-type') || '';
    let data: any;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (this.isTokenExpiredError(data, response.status) && !options.retried) {
      this.accessToken = undefined;
      return this.requestOnce({ ...options, retried: true });
    }

    if (!response.ok) {
      const errMsg = typeof data === 'object' && data.message ? data.message : `HTTP ${response.status}`;
      const errCode = typeof data === 'object' && data.code ? String(data.code) : `HTTP_${response.status}`;
      error(errCode, errMsg, { status: response.status, data });
    }

    if (typeof data === 'object' && data.code !== undefined && data.code !== 0 && data.code !== TOKEN_EXPIRED_CODE) {
      error(String(data.code), data.message || 'API request failed', data);
    }

    return data as T;
  }

  async request<T>(options: Omit<RequestOptions, 'retried'>): Promise<T> {
    return this.requestOnce<T>({ ...options, retried: false });
  }

  async get<T>(path: string, query?: Record<string, any>): Promise<T> {
    return this.request<T>({ method: 'GET', path, query });
  }

  async post<T>(path: string, body?: any, query?: Record<string, any>): Promise<T> {
    return this.request<T>({ method: 'POST', path, body, query });
  }

  async put<T>(path: string, body?: any, query?: Record<string, any>): Promise<T> {
    return this.request<T>({ method: 'PUT', path, body, query });
  }

  async delete<T>(path: string, query?: Record<string, any>): Promise<T> {
    return this.request<T>({ method: 'DELETE', path, query });
  }
}
