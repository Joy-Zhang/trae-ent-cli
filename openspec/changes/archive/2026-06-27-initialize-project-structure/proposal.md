## Why

需要一个基于 Commander.js 的 TypeScript CLI 工具，用于封装 TRAE 企业版 OpenAPI，主要供 AI agent（如 trae work）调用，提供成员管理、数据统计、审计日志等能力。项目目前为空，需要从零初始化完整的项目结构、开发配置和基础架构。

## What Changes

- 初始化 Node.js + TypeScript 项目结构和配置文件
- 配置 Commander.js CLI 框架，采用资源导向的命令结构
- 实现基础的鉴权模块，支持环境变量和命令行参数配置凭证
- 实现统一的 API 客户端，包含 token 文件缓存、QPS 限流、错误处理
- 实现统一的 JSON 输出格式，机器友好
- 配置 E2E 测试框架（node:test）
- 编制 AGENTS.md 项目指南

## Capabilities

### New Capabilities
- `cli-core`: CLI 核心框架、命令解析、配置管理
- `api-client`: TRAE 企业版 OpenAPI 客户端、鉴权、token 管理
- `members-resource`: 成员管理命令（invite/list/remove）
- `stats-resource`: 使用数据统计命令
- `logs-resource`: 审计与日志命令
- `project-tooling`: TypeScript 配置、构建脚本、E2E 测试配置、AGENTS.md

### Modified Capabilities

## Impact

- 新增项目依赖：commander、typescript、ts-node 等
- 新增项目配置文件：package.json、tsconfig.json、.gitignore 等
- 创建 src/ 目录结构及核心代码文件
- 创建 AGENTS.md 供 AI 助手使用
