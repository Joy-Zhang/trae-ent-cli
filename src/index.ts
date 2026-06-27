#!/usr/bin/env node

import { Command } from 'commander';
import { error, help } from './utils/output.js';
import { registerMembersCommands } from './commands/members.js';
import { registerStatsCommands } from './commands/stats.js';
import { registerLogsCommands } from './commands/logs.js';

const program = new Command();

program
  .name('trae-ent')
  .description('TRAE Enterprise CLI - Machine-friendly CLI for TRAE Enterprise OpenAPI')
  .version('0.1.0', '-v, --version', 'Output the current version')
  .helpOption('-h, --help', 'Display help for command')
  .option('--app-id <id>', 'TRAE Enterprise App ID')
  .option('--app-secret <secret>', 'TRAE Enterprise App Secret')
  .option('--base-url <url>', 'TRAE Enterprise API Base URL')
  .configureOutput({
    writeOut: (str) => {
      help(str.trim());
    },
    writeErr: (str) => {
      console.error(str.trim());
    },
  });

registerMembersCommands(program);
registerStatsCommands(program);
registerLogsCommands(program);

async function main() {
  try {
    await program.parseAsync(process.argv);
  } catch (err: any) {
    if (err?.message) {
      error('UNEXPECTED_ERROR', err.message, err);
    } else {
      error('UNEXPECTED_ERROR', 'An unexpected error occurred', err);
    }
  }
}

main();
