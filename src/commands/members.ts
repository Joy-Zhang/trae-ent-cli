import { Command } from 'commander';
import { createContext } from '../lib/context.js';
import { success } from '../utils/output.js';
import type { Command as CommanderCommand } from 'commander';

export function registerMembersCommands(program: Command): void {
  const members = program
    .command('members')
    .description('Manage enterprise members');

  members
    .command('list')
    .description('List members')
    .option('--page <number>', 'Page number', '1')
    .option('--page-size <number>', 'Page size', '20')
    .action(async (options, cmd: CommanderCommand) => {
      const { client } = createContext(cmd.optsWithGlobals());
      const data = await client.get('/openapi/v1/members', {
        page: parseInt(options.page, 10),
        page_size: parseInt(options.pageSize, 10),
      });
      success(data);
    });

  members
    .command('invite <email>')
    .description('Invite a new member')
    .option('--role <role>', 'Member role', 'member')
    .action(async (email: string, options, cmd: CommanderCommand) => {
      const { client } = createContext(cmd.optsWithGlobals());
      const data = await client.post('/openapi/v1/members/invite', {
        email,
        role: options.role,
      });
      success(data);
    });

  members
    .command('remove <member-id>')
    .description('Remove a member')
    .action(async (memberId: string, _options, cmd: CommanderCommand) => {
      const { client } = createContext(cmd.optsWithGlobals());
      const data = await client.delete(`/openapi/v1/members/${memberId}`);
      success(data);
    });
}
