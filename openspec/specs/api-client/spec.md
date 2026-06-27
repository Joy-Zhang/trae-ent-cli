## Purpose

定义 TRAE 企业版 OpenAPI 客户端，包括鉴权流程、token 管理、API 请求处理、错误重试与限流。

## Requirements

### Requirement: 鉴权与 Token 管理
API 客户端 SHALL 处理鉴权流程，使用 app_id 和 app_secret 获取 access_token，并支持文件缓存。

#### Scenario: 首次获取 Token
- **WHEN** 本地没有有效的 token 缓存
- **THEN** 系统 SHALL 调用鉴权接口获取 access_token
- **THEN** 系统 SHALL 将 token 和过期时间保存到 `~/.trae-ent/token.json`
- **THEN** token 文件权限 SHALL 设置为 0600（仅所有者可读写）

#### Scenario: 使用缓存的 Token
- **WHEN** 本地存在有效的 token 缓存（未过期）
- **THEN** 系统 SHALL 直接使用缓存的 token，不重新调用鉴权接口

#### Scenario: Token 过期刷新
- **WHEN** 本地缓存的 token 已过期
- **THEN** 系统 SHALL 重新调用鉴权接口获取新 token，并更新缓存文件

### Requirement: API 请求处理
API 客户端 SHALL 统一处理所有 API 请求，包含 Base URL 配置、Authorization 头注入、QPS 限流。

#### Scenario: 默认 Base URL
- **WHEN** 用户未指定 base-url
- **THEN** 系统 SHALL 使用 `https://console.enterprise.trae.cn` 作为 Base URL

#### Scenario: 自定义 Base URL
- **WHEN** 用户通过命令行参数或环境变量指定了 base-url
- **THEN** 系统 SHALL 使用指定的 URL 作为 Base URL

#### Scenario: 自动注入 Authorization 头
- **WHEN** 发送业务 API 请求
- **THEN** 请求头 SHALL 包含 `Authorization: Bearer <access_token>`

### Requirement: 错误处理与重试
API 客户端 SHALL 正确处理 API 错误，包括 HTTP 429 限流的自动重试。

#### Scenario: 普通 API 错误
- **WHEN** API 返回非 2xx 状态码（非 429）
- **THEN** 系统 SHALL 返回结构化的错误响应，包含 code、message

#### Scenario: 触发限流 (429)
- **WHEN** API 返回 HTTP 429 状态码
- **THEN** 系统 SHALL 根据响应头中的 `Retry-After` 字段等待后重试
- **THEN** 读接口限流为 2 QPS，写接口限流为 1 QPS
