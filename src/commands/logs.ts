import { Command } from 'commander';
import { createContext } from '../lib/context.js';
import { success } from '../utils/output.js';
import type { Command as CommanderCommand } from 'commander';

export function registerLogsCommands(program: Command): void {
  const logs = program
    .command('logs')
    .description('Query audit and operation logs');

  logs
    .command('openapi')
    .description('Get OpenAPI call logs')
    .option('--start-date <date>', 'Start date (YYYY-MM-DD)')
    .option('--end-date <date>', 'End date (YYYY-MM-DD)')
    .option('--page <number>', 'Page number', '1')
    .option('--page-size <number>', 'Page size', '20')
    .action(async (options, cmd: CommanderCommand) => {
      const { client } = createContext(cmd.optsWithGlobals());
      const data = await client.get('/openapi/v1/logs/openapi', {
        start_date: options.startDate,
        end_date: options.endDate,
        page: parseInt(options.page, 10),
        page_size: parseInt(options.pageSize, 10),
      });
      success(data);
    });

  logs
    .command('admin')
    .description('Get admin operation logs')
    .option('--start-date <date>', 'Start date (YYYY-MM-DD)')
    .option('--end-date <date>', 'End date (YYYY-MM-DD)')
    .option('--page <number>', 'Page number', '1')
    .option('--page-size <number>', 'Page size', '20')
    .action(async (options, cmd: CommanderCommand) => {
      const { client } = createContext(cmd.optsWithGlobals());
      const data = await client.get('/openapi/v1/logs/admin', {
        start_date: options.startDate,
        end_date: options.endDate,
        page: parseInt(options.page, 10),
        page_size: parseInt(options.pageSize, 10),
      });
      success(data);
    });
}
