## Why

当前鉴权实现与 TRAE 企业版官方文档不一致，存在字段名错误、过期时间不对、token 过期处理逻辑缺失等问题，会导致实际调用 API 时鉴权失败。需要按照官方文档修正鉴权实现。

## What Changes

- 修正 token 响应字段名：从 `expires_in` 改为官方文档的 `expire`
- 修正默认 token 过期时间：从 3600 秒改为 7200 秒（2小时）
- 调整提前刷新时间：从提前 60 秒改为提前 5 分钟（300秒），符合官方最佳实践
- 完善 token 过期处理：除了 HTTP 401，还要处理 HTTP 200 但响应体 `code: 1002` 的业务错误，自动刷新 token 并重试请求

## Capabilities

### New Capabilities

### Modified Capabilities
- `api-client`: 修正鉴权流程，包括 token 字段解析、过期时间处理、code=1002 时自动刷新重试

## Impact

- 修改 `src/lib/auth.ts`：token 缓存逻辑、字段解析、刷新时机
- 修改 `src/lib/client.ts`：处理业务层 token 过期错误（code=1002），自动刷新重试
- 不影响 CLI 接口和其他命令
