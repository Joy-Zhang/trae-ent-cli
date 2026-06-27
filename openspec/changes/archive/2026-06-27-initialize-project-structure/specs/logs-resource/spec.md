## ADDED Requirements

### Requirement: logs 命令组
CLI SHALL 提供 `trae-ent logs` 命令组，用于查询审计与日志。

#### Scenario: logs 命令存在
- **WHEN** 用户运行 `trae-ent logs --help`
- **THEN** 系统 SHALL 输出日志相关子命令的帮助信息，格式为 JSON

#### Scenario: 命令文件存在
- **WHEN** 初始化项目结构完成
- **THEN** `src/commands/logs.ts` 文件 SHALL 存在并定义 logs 命令组
