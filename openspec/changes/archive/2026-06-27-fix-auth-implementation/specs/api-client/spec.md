## MODIFIED Requirements

### Requirement: 鉴权与 Token 管理
API 客户端 SHALL 处理鉴权流程，使用 app_id 和 app_secret 获取 access_token，并支持文件缓存。

#### Scenario: 正确解析 Token 响应字段
- **WHEN** 调用鉴权接口成功返回
- **THEN** 系统 SHALL 从响应的 `expire` 字段读取过期时间（秒）
- **THEN** 如果响应中没有 `expire` 字段，SHALL 默认使用 7200 秒（2小时）
- **THEN** 兼容读取 `expires_in` 字段作为后备

#### Scenario: Token 提前刷新
- **WHEN** 保存 token 到缓存时
- **THEN** 缓存的 expiresAt  SHALL 设置为 `当前时间 + (expire - 300) * 1000`（提前 5 分钟过期）

### Requirement: 错误处理与重试
API 客户端 SHALL 正确处理 API 错误，包括 HTTP 429 限流的自动重试和 token 过期自动刷新。

#### Scenario: Token 过期（业务错误 code=1002）
- **WHEN** API 返回 HTTP 200 但响应体中 `code === 1002`（access token expired）
- **THEN** 系统 SHALL 清除当前缓存的 access_token
- **THEN** 系统 SHALL 重新调用鉴权接口获取新 token
- **THEN** 系统 SHALL 使用新 token 重试原请求 **一次**
- **THEN** 如果重试仍然返回 code=1002，则返回错误

#### Scenario: Token 过期（HTTP 401）
- **WHEN** API 返回 HTTP 401 状态码
- **THEN** 系统 SHALL 清除当前缓存的 access_token
- **THEN** 系统 SHALL 重新调用鉴权接口获取新 token
- **THEN** 系统 SHALL 使用新 token 重试原请求 **一次**
- **THEN** 如果重试仍然返回 401，则返回错误
