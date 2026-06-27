import type { CliResponse } from '../lib/types.js';

export function success<T>(data: T): void {
  const response: CliResponse<T> = {
    success: true,
    data,
  };
  console.log(JSON.stringify(response, null, 2));
}

export function error(code: string, message: string, details?: any, exitCode: number = 1): never {
  const response: CliResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
  console.log(JSON.stringify(response, null, 2));
  process.exit(exitCode);
}

export function help(text: string): void {
  success({ help: text });
}
