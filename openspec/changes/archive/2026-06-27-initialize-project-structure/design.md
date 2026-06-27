## Context

项目当前为空仓库，需要从零开始构建一个 TypeScript CLI 工具。目标用户主要是 AI agent（如 trae work），因此输出必须是纯 JSON 格式，稳定、可预测、机器友好。CLI 需要封装 TRAE 企业版 OpenAPI 的三个核心模块：成员管理、使用数据统计、审计与日志。

## Goals / Non-Goals

**Goals:**
- 建立清晰的分层架构（CLI 层 → Auth/Client 层 → 资源层）
- 支持多种凭证配置方式（环境变量 + 命令行参数）
- 实现 access_token 文件缓存，减少重复鉴权请求
- 统一 JSON 输出格式，包含 success/data/error 字段
- 内置 QPS 限流和错误重试机制（针对 HTTP 429）
- 配置 TypeScript、构建脚本和 E2E 测试环境
- 提供完整的 AGENTS.md 项目指南

**Non-Goals:**
- 不实现交互式终端 UI（纯 JSON 输出）
- 不做单元测试（仅 E2E 测试）
- 不支持配置文件凭证（仅环境变量 + 命令行参数）
- 不实现复杂的表格/格式化输出

## Decisions

### 1. CLI 命令结构：资源导向
- **决策**：采用 `trae-ent <resource> <action>` 结构，如 `trae-ent members invite`
- **理由**：结构清晰，易于扩展新资源，符合 REST API 设计直觉
- **替代方案**：操作导向命令（如 `trae-ent invite-member`）- 随着资源增多会导致命令数量爆炸

### 2. 凭证配置优先级
- **决策**：命令行参数 > 环境变量
- **环境变量命名**：
  - `TRAE_ENT_APP_ID`
  - `TRAE_ENT_APP_SECRET`
  - `TRAE_ENT_BASE_URL`（可选，默认 https://console.enterprise.trae.cn）
- **理由**：命令行参数显式指定，优先级最高；环境变量方便批量配置

### 3. Token 缓存策略
- **决策**：文件缓存到 `~/.trae-ent/token.json`
- **缓存内容**：`{ "access_token": "...", "expires_at": 1234567890 }`
- **理由**：CLI 每次执行是独立进程，文件缓存可跨进程复用，减少鉴权请求
- **替代方案**：内存缓存 - 仅同一进程有效，不适合 CLI 场景

### 4. 统一 JSON 响应格式
```typescript
interface CliResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```
- **决策**：所有命令（包括错误情况）都输出上述结构的 JSON
- **理由**：agent 解析简单、可预测，错误信息结构化便于处理

### 5. 项目目录结构
```
src/
├── commands/          # Commander 命令定义
│   ├── members.ts
│   ├── stats.ts
│   └── logs.ts
├── lib/
│   ├── auth.ts        # 鉴权 & token 管理
│   ├── client.ts      # API 客户端（限流、重试、错误处理）
│   └── types.ts       # 共享 TypeScript 类型
├── utils/
│   └── output.ts      # 统一 JSON 输出工具
└── index.ts           # CLI 入口
```
- **决策**：按职责分层
- **理由**：关注点分离，代码清晰易维护

### 6. 依赖选择
- `commander`: CLI 框架
- `typescript`: 类型安全
- `ts-node`: 开发时直接运行 TS
- `@types/node`: Node.js 类型定义
- 不引入额外 HTTP 客户端库，使用原生 `fetch`（Node.js 18+ 已内置）

## Risks / Trade-offs

- [Node.js 版本依赖] → 在 package.json 中要求 Node.js >= 18，使用原生 fetch
- [Token 文件权限] → 创建 token 文件时设置 0600 权限，仅所有者可读写
- [QPS 限流处理] → 客户端内置简单的令牌桶限流，遇到 429 时根据 Retry-After 头重试
- [凭证泄露风险] → 命令行参数可能出现在进程列表中，建议优先使用环境变量
