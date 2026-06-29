import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.join(__dirname, '..', 'dist', 'index.js');

async function runCli(args: string[]): Promise<{ stdout: string; stderr: string }> {
  return execFileAsync('node', [CLI_PATH, ...args], {
    env: {
      ...process.env,
      HOME: process.env.TMPDIR || '/tmp',
    },
    timeout: 30000,
  });
}

describe('statistics active-users', () => {
  it('should return error when date parameters are missing', async () => {
    const { stdout } = await runCli(['statistics', 'active-users']);
    const result = JSON.parse(stdout);

    assert.equal(result.success, false);
    assert.ok(result.error, 'error should exist');
  });

  it('should return active users statistics with date parameters', async () => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { stdout } = await runCli([
      'statistics',
      'active-users',
      '--start-date',
      startDate,
      '--end-date',
      endDate,
    ]);
    const result = JSON.parse(stdout);

    assert.equal(result.success, true);
    assert.ok(result.data, 'data should exist');
    assert.ok(result.data.data, 'API response data should exist');
    assert.equal(typeof result.data.data.total_active_users, 'number');
    assert.equal(typeof result.data.data.ide_active_users, 'number');
    assert.equal(typeof result.data.data.plugin_active_users, 'number');
    assert.equal(typeof result.data.data.cli_active_users, 'number');
    assert.equal(typeof result.data.data.solo_desktop_code_active_users, 'number');
    assert.equal(typeof result.data.data.solo_desktop_work_active_users, 'number');
    assert.equal(typeof result.data.data.solo_web_code_active_users, 'number');
    assert.equal(typeof result.data.data.solo_web_work_active_users, 'number');
  });
});
