## Purpose

定义使用数据统计命令组，包括活跃成员数、AI 用量、MCP 调用排行。

## Requirements

### Requirement: stats 命令组
CLI SHALL 提供 `trae-ent stats` 命令组，用于查询使用数据统计。

#### Scenario: stats 命令存在
- **WHEN** 用户运行 `trae-ent stats --help`
- **THEN** 系统 SHALL 输出统计相关子命令的帮助信息，格式为 JSON

#### Scenario: 命令文件存在
- **WHEN** 初始化项目结构完成
- **THEN** `src/commands/stats.ts` 文件 SHALL 存在并定义 stats 命令组
