## Why

需要对接 TRAE 企业版 OpenAPI 的获取活跃用户数接口，为 AI agent 提供企业成员活跃度数据查询能力。当前代码库中存在一个错误的占位实现（使用了错误的 API 端点），需要替换为正确的实现。

## What Changes

- 新增 `trae-ent stats active-users` 命令，用于查询活跃用户统计
- 调用正确的 API 端点 `GET /openapi/v1/statistics/active-users`
- 支持可选的 `--start-date` 和 `--end-date` 参数（YYYY-MM-DD 格式）
- 添加 `ActiveUsersStats` TypeScript 类型定义，匹配 API 返回结构
- 移除错误的 `active-members` 占位命令
- 新增 E2E 测试，使用真实 API 请求验证功能

## Capabilities

### New Capabilities

（无新增能力，在现有 stats 资源上扩展）

### Modified Capabilities

- `stats-resource`: 新增 `active-users` 子命令要求，支持按日期范围查询活跃用户统计数据

## Impact

- **代码文件**:
  - `src/commands/stats.ts`: 替换错误的 active-members 实现为正确的 active-users
  - `src/lib/types.ts`: 添加 ActiveUsersStats 接口定义
- **测试**:
  - 新增 `test/stats-active-users.test.ts`: E2E 测试文件
- **API**: 对接 `/openapi/v1/statistics/active-users` 端点
