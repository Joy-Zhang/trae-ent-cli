## Purpose

定义 trae-ent-cli 的 CLI 核心框架，包括命令结构、全局凭证选项、统一 JSON 输出格式。

## Requirements

### Requirement: CLI 入口和基础命令结构
CLI 工具 SHALL 提供 `trae-ent` 命令，采用资源导向的命令结构，包含 `members`、`stats`、`logs` 三个顶级资源子命令。

#### Scenario: 执行帮助命令
- **WHEN** 用户运行 `trae-ent --help`
- **THEN** 系统 SHALL 输出包含 members、stats、logs 子命令的帮助信息，格式为 JSON

#### Scenario: 无参数执行
- **WHEN** 用户直接运行 `trae-ent` 不带任何参数
- **THEN** 系统 SHALL 输出帮助信息或错误提示，格式为 JSON

### Requirement: 全局凭证选项
CLI SHALL 支持以下全局选项用于配置凭证：
- `--app-id <id>`: TRAE 企业版应用 ID
- `--app-secret <secret>`: TRAE 企业版应用密钥
- `--base-url <url>`: API 基础 URL（可选）

这些选项的优先级 SHALL 高于环境变量。

#### Scenario: 使用命令行参数提供凭证
- **WHEN** 用户运行 `trae-ent --app-id xxx --app-secret yyy members list`
- **THEN** 系统 SHALL 使用命令行参数中的凭证进行 API 调用

#### Scenario: 使用环境变量提供凭证
- **WHEN** 用户设置了 `TRAE_ENT_APP_ID` 和 `TRAE_ENT_APP_SECRET` 环境变量，且未通过命令行参数指定
- **THEN** 系统 SHALL 使用环境变量中的凭证进行 API 调用

#### Scenario: 缺少凭证
- **WHEN** 用户未通过命令行参数或环境变量提供 app-id 和 app-secret
- **THEN** 系统 SHALL 返回 success: false 的 JSON 响应，包含明确的错误信息

### Requirement: 统一 JSON 输出格式
所有命令的输出（包括成功和错误情况）SHALL 严格遵循统一的 JSON 结构，不输出任何非 JSON 内容到 stdout。

#### Scenario: 成功响应
- **WHEN** 命令执行成功
- **THEN** 输出 SHALL 为 `{ "success": true, "data": <响应数据> }` 格式的 JSON

#### Scenario: 错误响应
- **WHEN** 命令执行失败
- **THEN** 输出 SHALL 为 `{ "success": false, "error": { "code": "<错误码>", "message": "<错误消息>" } }` 格式的 JSON
- **THEN** 进程退出码 SHALL 为非 0 值
