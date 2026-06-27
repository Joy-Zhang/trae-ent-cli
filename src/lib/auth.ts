import { promises as fs } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import type { Credentials, TokenCache } from './types.js';
import { error } from '../utils/output.js';

const DEFAULT_BASE_URL = 'https://console.enterprise.trae.cn';
const TOKEN_DIR = join(homedir(), '.trae-ent');
const TOKEN_FILE = join(TOKEN_DIR, 'token.json');
const DEFAULT_TOKEN_EXPIRE_SECONDS = 7200;
const TOKEN_REFRESH_ADVANCE_SECONDS = 300;

export function getCredentials(cliOptions: {
  appId?: string;
  appSecret?: string;
  baseUrl?: string;
}): Credentials {
  const appId = cliOptions.appId || process.env.TRAE_ENT_APP_ID;
  const appSecret = cliOptions.appSecret || process.env.TRAE_ENT_APP_SECRET;
  const baseUrl = cliOptions.baseUrl || process.env.TRAE_ENT_BASE_URL || DEFAULT_BASE_URL;

  if (!appId || !appSecret) {
    error(
      'MISSING_CREDENTIALS',
      'Missing credentials. Please provide --app-id and --app-secret, or set TRAE_ENT_APP_ID and TRAE_ENT_APP_SECRET environment variables.'
    );
  }

  return {
    appId: appId!,
    appSecret: appSecret!,
    baseUrl,
  };
}

async function ensureTokenDir(): Promise<void> {
  try {
    await fs.access(TOKEN_DIR);
  } catch {
    await fs.mkdir(TOKEN_DIR, { recursive: true, mode: 0o700 });
  }
}

export async function getCachedToken(): Promise<TokenCache | null> {
  try {
    const content = await fs.readFile(TOKEN_FILE, 'utf-8');
    const cache: TokenCache = JSON.parse(content);
    if (cache.expiresAt > Date.now()) {
      return cache;
    }
    return null;
  } catch {
    return null;
  }
}

export async function clearCachedToken(): Promise<void> {
  try {
    await fs.unlink(TOKEN_FILE);
  } catch {
  }
}

export async function saveToken(token: string, expireSeconds: number): Promise<void> {
  await ensureTokenDir();
  const effectiveExpire = expireSeconds || DEFAULT_TOKEN_EXPIRE_SECONDS;
  const cache: TokenCache = {
    accessToken: token,
    expiresAt: Date.now() + (effectiveExpire - TOKEN_REFRESH_ADVANCE_SECONDS) * 1000,
  };
  await fs.writeFile(TOKEN_FILE, JSON.stringify(cache, null, 2), { mode: 0o600 });
}

export async function getAccessToken(credentials: Credentials, forceRefresh = false): Promise<string> {
  if (!forceRefresh) {
    const cached = await getCachedToken();
    if (cached) {
      return cached.accessToken;
    }
  } else {
    await clearCachedToken();
  }

  const tokenUrl = `${credentials.baseUrl}/openapi/v1/auth/token`;
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_id: credentials.appId,
      app_secret: credentials.appSecret,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    error(
      'AUTH_FAILED',
      `Failed to get access token: HTTP ${response.status}`,
      { status: response.status, body }
    );
  }

  const data = await response.json() as {
    access_token?: string;
    expire?: number;
    expires_in?: number;
    token_type?: string;
    code?: number;
    message?: string;
  };

  if (data.code && data.code !== 0) {
    error('AUTH_FAILED', data.message || 'Authentication failed', data);
  }

  if (!data.access_token) {
    error('AUTH_FAILED', 'No access_token in response', data);
  }

  const expireSeconds = data.expire ?? data.expires_in ?? DEFAULT_TOKEN_EXPIRE_SECONDS;
  await saveToken(data.access_token, expireSeconds);
  return data.access_token;
}
