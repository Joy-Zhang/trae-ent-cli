export interface CliResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface Credentials {
  appId: string;
  appSecret: string;
  baseUrl: string;
}

export interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

export interface ApiError {
  code: number;
  message: string;
  data?: any;
}

export interface Member {
  id: string;
  email: string;
  name?: string;
  role?: string;
  status?: string;
}

export interface ActiveUsersStats {
  total_active_users: number;
  ide_active_users: number;
  plugin_active_users: number;
  cli_active_users: number;
  solo_desktop_code_active_users: number;
  solo_desktop_work_active_users: number;
  solo_web_code_active_users: number;
  solo_web_work_active_users: number;
}

export interface UsageStats {
  activeUsers?: ActiveUsersStats;
  aiUsage?: {
    totalTokens?: number;
    totalRequests?: number;
    byModel?: Record<string, { tokens: number; requests: number }>;
  };
  mcpUsage?: Array<{
    serverName: string;
    callCount: number;
  }>;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor?: string;
  details?: any;
}

export interface ListMembersParams {
  page?: number;
  pageSize?: number;
}

export interface InviteMemberParams {
  email: string;
  role?: string;
}

export interface GetUsageParams {
  startDate?: string;
  endDate?: string;
  memberId?: string;
}

export interface GetLogsParams {
  startDate?: string;
  endDate?: string;
  type?: 'openapi' | 'admin';
  page?: number;
  pageSize?: number;
}
