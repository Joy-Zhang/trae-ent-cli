## Purpose

定义使用数据统计命令组，包括活跃用户数、AI 用量、MCP 调用排行。

## Requirements

### Requirement: stats 命令组
CLI SHALL 提供 `trae-ent stats` 命令组，用于查询使用数据统计。

#### Scenario: stats 命令存在
- **WHEN** 用户运行 `trae-ent stats --help`
- **THEN** 系统 SHALL 输出统计相关子命令的帮助信息，格式为 JSON

#### Scenario: 命令文件存在
- **WHEN** 初始化项目结构完成
- **THEN** `src/commands/stats.ts` 文件 SHALL 存在并定义 stats 命令组

### Requirement: stats active-users 命令
CLI SHALL 提供 `trae-ent stats active-users` 命令，用于查询企业活跃用户统计数据，包括总活跃用户数及各端（IDE、插件、CLI、Solo）活跃用户数。

#### Scenario: 命令定义存在
- **WHEN** 用户运行 `trae-ent stats --help`
- **THEN** 帮助输出 SHALL 包含 `active-users` 子命令

#### Scenario: 按日期范围查询活跃用户统计
- **WHEN** 用户运行 `trae-ent stats active-users --start-date 2024-01-01 --end-date 2024-01-31`
- **THEN** 系统 SHALL 调用 `GET /openapi/v1/statistics/active-users?start_date=2024-01-01&end_date=2024-01-31`
- **THEN** 系统 SHALL 返回指定日期范围内的活跃用户统计数据
