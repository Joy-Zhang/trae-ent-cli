## Why

将 CLI 命令 `stats` 重命名为 `statistics`，对齐 TRAE 企业版 API 文档中的资源命名（`/openapi/v1/statistics/...`），消除 CLI 命令名与 API 路径命名不一致的问题。

## What Changes

- **BREAKING**: `trae-ent stats` 命令重命名为 `trae-ent statistics`，所有子命令（`active-users`、`ai-usage`、`mcp-usage`、`user-model-usage`）路径随之变更
- 源文件 `src/commands/stats.ts` 重命名为 `src/commands/statistics.ts`，导出函数 `registerStatsCommands` 重命名为 `registerStatisticsCommands`
- 入口文件 `src/index.ts` 同步更新 import 和注册调用
- 测试文件重命名并更新硬编码的 `'stats'` 字符串为 `'statistics'`

## Capabilities

### New Capabilities

无

### Modified Capabilities

- `stats-resource`: 命令名从 `stats` 改为 `statistics`，文件名从 `stats.ts` 改为 `statistics.ts`
- `cli-core`: 帮助输出中资源名称从 `stats` 改为 `statistics`

## Impact

- 源文件: `src/commands/stats.ts`, `src/index.ts`
- 测试文件: `test/stats-active-users.test.ts`, `test/stats-user-model-usage.test.ts`
- Spec: `openspec/specs/stats-resource/spec.md`, `openspec/specs/cli-core/spec.md`
