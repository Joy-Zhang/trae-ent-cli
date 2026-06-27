import { getCredentials } from './auth.js';
import { ApiClient } from './client.js';
import type { Credentials } from './types.js';

export function createContext(opts: { appId?: string; appSecret?: string; baseUrl?: string }): {
  credentials: Credentials;
  client: ApiClient;
} {
  const credentials = getCredentials(opts);
  const client = new ApiClient(credentials);
  return { credentials, client };
}
