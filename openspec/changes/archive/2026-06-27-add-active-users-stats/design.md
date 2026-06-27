## Context

当前 `trae-ent-cli` 是一个基于 Commander.js 的 TypeScript CLI 工具，封装 TRAE 企业版 OpenAPI。stats 命令组已有 `ai-usage` 和 `mcp-usage` 两个子命令，但存在一个错误的占位 `active-members` 命令，使用了错误的 API 端点 `/openapi/v1/stats/active-members`。

正确的活跃用户统计端点是 `/openapi/v1/statistics/active-users`，返回包含各端（IDE、插件、CLI）活跃用户数的详细统计。

测试采用 E2E 真实请求模式，依赖环境变量中的认证信息。

## Goals / Non-Goals

**Goals:**
- 正确实现 `trae-ent stats active-users` 命令
- 匹配 TRAE 企业版 OpenAPI 规范
- 提供完整的 TypeScript 类型定义
- 添加 E2E 测试覆盖
- 遵循现有代码约定和模式

**Non-Goals:**
- 不修改其他 stats 命令（ai-usage、mcp-usage）
- 不重构现有 API 客户端或架构
- 不处理 /stats 与 /statistics 路径不一致问题（后续变更处理）
- 不添加 mock 测试框架

## Decisions

### 1. 命令命名: `active-users`
- 选择与 API 端点命名一致（`active-users`），而非沿用错误的 `active-members`
- 理由：命令名应准确反映 API 资源名称，减少混淆

### 2. 参数设计
- 复用现有 stats 命令的参数模式：`--start-date <date>` 和 `--end-date <date>`（均可选）
- 日期格式：YYYY-MM-DD，与其他命令保持一致
- 参数转换为 snake_case（`start_date`、`end_date`）传递给 API，与现有代码一致

### 3. API 响应透传
- CLI 直接透传 API 返回的完整 data 字段（包含 `total_active_users`、`ide_active_users`、`plugin_active_users`、`cli_active_users`）
- 理由：保持 CLI 的"机器友好"设计，让调用方（AI agent）自行处理数据结构
- 添加 TypeScript 接口 `ActiveUsersStats` 保证类型安全

### 4. 测试策略
- 使用 Node.js 内置 `node:test` 框架
- 真实 API 请求（不 mock），依赖环境变量 `TRAE_ENT_APP_ID` 和 `TRAE_ENT_APP_SECRET`
- 测试验证：命令成功执行、响应格式正确、包含必要字段

### 5. 替换错误实现
- 直接删除 `active-members` 命令，替换为 `active-users`
- 理由：该实现是错误的占位代码，没有已知用户依赖

## Risks / Trade-offs

- **真实请求测试依赖环境配置** → 缓解：测试失败时给出明确提示，说明需要配置环境变量；CI 环境可以配置测试凭证
- **日期参数可选性** → 如果 API 实际要求必填参数，命令会返回错误，这是可接受的（错误信息会清晰展示）
