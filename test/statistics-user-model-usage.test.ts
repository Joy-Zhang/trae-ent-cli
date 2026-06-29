import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.join(__dirname, '..', 'dist', 'index.js');

async function runCli(args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  try {
    const { stdout, stderr } = await execFileAsync('node', [CLI_PATH, ...args], {
      env: {
        ...process.env,
        HOME: process.env.TMPDIR || '/tmp',
      },
      timeout: 30000,
    });
    return { stdout, stderr, exitCode: 0 };
  } catch (err: any) {
    return { stdout: err.stdout || '', stderr: err.stderr || '', exitCode: err.code || 1 };
  }
}

describe('statistics user-model-usage', () => {
  it('should return error when neither --emails nor --user-ids is provided', async () => {
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60;

    const { stdout, exitCode } = await runCli([
      'stats',
      'user-model-usage',
      '--start-time', String(thirtyDaysAgo),
      '--end-time', String(now),
    ]);
    const result = JSON.parse(stdout);

    assert.notEqual(exitCode, 0);
    assert.equal(result.success, false);
    assert.ok(result.error);
    assert.equal(result.error.code, 'MISSING_PARAM');
  });

  it('should return data when querying by emails', async () => {
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60;

    const { stdout } = await runCli([
      'statistics',
      'user-model-usage',
      '--start-time', String(thirtyDaysAgo),
      '--end-time', String(now),
      '--emails', 'a@example.com',
    ]);
    const result = JSON.parse(stdout);

    assert.equal(result.success, true);
    assert.ok(result.data);
  });

  it('should return data when querying by user IDs', async () => {
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60;

    const { stdout } = await runCli([
      'statistics',
      'user-model-usage',
      '--start-time', String(thirtyDaysAgo),
      '--end-time', String(now),
      '--user-ids', '1001',
    ]);
    const result = JSON.parse(stdout);

    assert.equal(result.success, true);
    assert.ok(result.data);
  });

  it('should handle multiple emails and user IDs with comma separation', async () => {
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60;

    const { stdout } = await runCli([
      'statistics',
      'user-model-usage',
      '--start-time', String(thirtyDaysAgo),
      '--end-time', String(now),
      '--emails', 'a@example.com,b@example.com',
      '--user-ids', '1001,1002',
    ]);
    const result = JSON.parse(stdout);

    assert.equal(result.success, true);
    assert.ok(result.data);
  });
});
