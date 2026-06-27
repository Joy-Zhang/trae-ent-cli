import { Command } from 'commander';
import { createContext } from '../lib/context.js';
import { success } from '../utils/output.js';
import type { Command as CommanderCommand } from 'commander';

export function registerStatsCommands(program: Command): void {
  const stats = program
    .command('stats')
    .description('Query usage statistics');

  stats
    .command('active-members')
    .description('Get active members count')
    .option('--start-date <date>', 'Start date (YYYY-MM-DD)')
    .option('--end-date <date>', 'End date (YYYY-MM-DD)')
    .action(async (options, cmd: CommanderCommand) => {
      const { client } = createContext(cmd.optsWithGlobals());
      const data = await client.get('/openapi/v1/stats/active-members', {
        start_date: options.startDate,
        end_date: options.endDate,
      });
      success(data);
    });

  stats
    .command('ai-usage')
    .description('Get AI usage statistics')
    .option('--start-date <date>', 'Start date (YYYY-MM-DD)')
    .option('--end-date <date>', 'End date (YYYY-MM-DD)')
    .option('--member-id <id>', 'Filter by member ID')
    .action(async (options, cmd: CommanderCommand) => {
      const { client } = createContext(cmd.optsWithGlobals());
      const data = await client.get('/openapi/v1/stats/ai-usage', {
        start_date: options.startDate,
        end_date: options.endDate,
        member_id: options.memberId,
      });
      success(data);
    });

  stats
    .command('mcp-usage')
    .description('Get MCP call rankings')
    .option('--start-date <date>', 'Start date (YYYY-MM-DD)')
    .option('--end-date <date>', 'End date (YYYY-MM-DD)')
    .option('--limit <number>', 'Number of results', '10')
    .action(async (options, cmd: CommanderCommand) => {
      const { client } = createContext(cmd.optsWithGlobals());
      const data = await client.get('/openapi/v1/stats/mcp-usage', {
        start_date: options.startDate,
        end_date: options.endDate,
        limit: parseInt(options.limit, 10),
      });
      success(data);
    });
}
