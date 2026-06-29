import { Command } from 'commander';
import { createContext } from '../lib/context.js';
import { success, error } from '../utils/output.js';
import type { Command as CommanderCommand } from 'commander';

export function registerStatisticsCommands(program: Command): void {
  const stats = program
    .command('statistics')
    .description('Query usage statistics');

  stats
    .command('active-users')
    .description('Get active users statistics')
    .option('--start-date <date>', 'Start date (YYYY-MM-DD)')
    .option('--end-date <date>', 'End date (YYYY-MM-DD)')
    .action(async (options, cmd: CommanderCommand) => {
      const { client } = createContext(cmd.optsWithGlobals());
      const data = await client.get('/openapi/v1/statistics/active-users', {
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

  stats
    .command('user-model-usage')
    .description('Get model usage consumption for users')
    .requiredOption('--start-time <ts>', 'Start time (unix seconds timestamp)', parseInt)
    .requiredOption('--end-time <ts>', 'End time (unix seconds timestamp)', parseInt)
    .option('--emails <emails>', 'Member emails (comma-separated)')
    .option('--user-ids <ids>', 'Member IDs (comma-separated)')
    .action(async (options, cmd: CommanderCommand) => {
      if (!options.emails && !options.userIds) {
        error('MISSING_PARAM', 'At least one of --emails or --user-ids is required');
      }

      const { client } = createContext(cmd.optsWithGlobals());

      const body: Record<string, any> = {
        start_time: options.startTime,
        end_time: options.endTime,
      };

      if (options.emails) {
        body.emails = options.emails.split(',').map((s: string) => s.trim());
      }
      if (options.userIds) {
        body.user_ids = options.userIds.split(',').map((s: string) => parseInt(s.trim(), 10));
      }

      const data = await client.post('/openapi/v1/statistics/user-model-usage', body);
      success(data);
    });
}
