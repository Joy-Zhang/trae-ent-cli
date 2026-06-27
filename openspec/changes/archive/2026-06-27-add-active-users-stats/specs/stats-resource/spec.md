## ADDED Requirements

### Requirement: stats active-users 命令
CLI SHALL 提供 `trae-ent stats active-users` 命令，用于查询企业活跃用户统计数据，包括总活跃用户数及各端（IDE、插件、CLI）活跃用户数。

#### Scenario: 命令定义存在
- **WHEN** 用户运行 `trae-ent stats --help`
- **THEN** 帮助输出 SHALL 包含 `active-users` 子命令

#### Scenario: 查询活跃用户统计（无日期参数）
- **WHEN** 用户运行 `trae-ent stats active-users`
- **THEN** 系统 SHALL 调用 `GET /openapi/v1/statistics/active-users`
- **THEN** 系统 SHALL 返回标准 CLI JSON 成功响应，data 字段包含 `total_active_users`、`ide_active_users`、`plugin_active_users`、`cli_active_users`

#### Scenario: 按日期范围查询活跃用户统计
- **WHEN** 用户运行 `trae-ent stats active-users --start-date 2024-01-01 --end-date 2024-01-31`
- **THEN** 系统 SHALL 调用 `GET /openapi/v1/statistics/active-users?start_date=2024-01-01&end_date=2024-01-31`
- **THEN** 系统 SHALL 返回指定日期范围内的活跃用户统计数据

## REMOVED Requirements

### Requirement: stats active-members 命令
**Reason**: 该命令使用了错误的 API 端点，为占位实现，需要替换为正确的 active-users 命令
**Migration**: 使用 `trae-ent stats active-users` 替代
