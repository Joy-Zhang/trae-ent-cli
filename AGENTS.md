# trae-ent-cli - AGENTS Guide

## 项目概述

`trae-ent-cli` 是一个基于 Commander.js 的 TypeScript CLI 工具，用于封装 TRAE 企业版 OpenAPI。该 CLI 设计为**机器友好**，所有输出均为 JSON 格式，主要供 AI agent（如 trae work）调用。

## 技术栈

- **Runtime**: Node.js >= 18（使用原生 fetch）
- **Language**: TypeScript
- **CLI Framework**: Commander.js
- **Module System**: ES Modules (type: "module")
- **Testing**: node:test (E2E tests only)

## 项目结构

```
trae-ent-cli/
├── src/
│   ├── index.ts              # CLI 入口点
│   ├── commands/             # Commander 命令定义（资源导向）
│   │   ├── members.ts        # 成员管理: invite/list/remove
│   │   ├── stats.ts          # 数据统计: active-members/ai-usage/mcp-usage
│   │   └── logs.ts           # 审计日志: openapi/admin
│   ├── lib/                  # 核心库
│   │   ├── auth.ts           # 鉴权 & token 文件缓存
│   │   ├── client.ts         # API 客户端（限流、重试、错误处理）
│   │   ├── context.ts        # 命令执行上下文创建
│   │   └── types.ts          # 共享 TypeScript 类型定义
│   └── utils/
│       └── output.ts         # 统一 JSON 输出工具
├── test/                     # E2E 测试
├── package.json
├── tsconfig.json
└── AGENTS.md                 # 本文件
```

## 开发命令

```bash
# 安装依赖
npm install

# 开发模式（直接运行 TS）
npm start -- --help

# 构建
npm run build

# 运行 E2E 测试
npm test

# 链接到全局（开发时方便测试）
npm link
trae-ent --help
```

## CLI 设计规范

### 命令结构

采用**资源导向**的命令层级：
```
trae-ent <resource> <action> [options]
```

**示例：**
```bash
trae-ent members list
trae-ent members invite user@example.com
trae-ent stats ai-usage --start-date 2024-01-01
trae-ent logs openapi --page 1
```

### 全局选项

| 选项 | 环境变量 | 说明 |
|------|---------|------|
| `--app-id <id>` | `TRAE_ENT_APP_ID` | TRAE 企业版应用 ID |
| `--app-secret <secret>` | `TRAE_ENT_APP_SECRET` | TRAE 企业版应用密钥 |
| `--base-url <url>` | `TRAE_ENT_BASE_URL` | API Base URL（可选，默认 https://console.enterprise.trae.cn） |

**优先级：** 命令行参数 > 环境变量 > 默认值

### 输出格式

**所有命令**（包括错误）SHALL 输出以下 JSON 结构到 stdout：

**成功响应：**
```json
{
  "success": true,
  "data": { ... }
}
```

**错误响应：**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

错误时进程退出码为非 0。

### Token 缓存

Access token 缓存到 `~/.trae-ent/token.json`，文件权限为 0600。token 过期前 60 秒自动刷新。

### 速率限制

客户端内置 QPS 限流：
- 读操作 (GET): 2 QPS
- 写操作 (POST/PUT/DELETE): 1 QPS
- 遇到 HTTP 429 时根据 `Retry-After` 头自动重试

## API 路径约定

所有 TRAE 企业版 OpenAPI 路径以 `/openapi/v1/` 为前缀。

## 代码约定

1. **Import 路径**: 使用 `.js` 扩展名（ES Modules 要求）
2. **类型**: 所有共享类型定义在 `src/lib/types.ts`
3. **错误处理**: 使用 `src/utils/output.ts` 中的 `error()` 函数，直接输出 JSON 并退出
4. **成功响应**: 使用 `src/utils/output.ts` 中的 `success()` 函数
5. **HTTP 客户端**: 使用 `src/lib/client.ts` 中的 `ApiClient` 类，不要直接使用 fetch
6. **命令注册**: 每个资源一个文件在 `src/commands/`，导出 `registerXxxCommands(program: Command)` 函数
7. **无注释**: 代码自解释，不需要注释（除非特别复杂的逻辑）

## 添加新命令

1. 在对应资源文件（或新文件）中添加命令
2. 使用 `createContext(cmd.optsWithGlobals())` 获取 API client
3. 通过 client 调用 API
4. 使用 `success(data)` 输出结果
5. 在 `src/index.ts` 中注册（如果是新资源）

## 相关文档

- TRAE 企业版 OpenAPI 文档: https://docs.trae.cn/enterprise_trae-cn-enterprise-api
