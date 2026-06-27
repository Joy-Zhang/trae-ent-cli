## 1. 修正 Auth 模块

- [x] 1.1 修改 src/lib/auth.ts，正确解析 token 响应的 `expire` 字段（兼容 `expires_in`）
- [x] 1.2 修改 src/lib/auth.ts，将默认过期时间改为 7200 秒，提前刷新时间改为 300 秒（5分钟）
- [x] 1.3 为 getAccessToken 添加强制刷新选项，支持跳过缓存重新获取 token

## 2. 修正 API Client 错误处理

- [x] 2.1 修改 src/lib/client.ts，在收到 HTTP 200 响应时检查是否有 `code === 1002` 的 token 过期错误
- [x] 2.2 修改 src/lib/client.ts，处理 code=1002 时清除 token 并强制刷新重试一次
- [x] 2.3 确保 HTTP 401 和 code=1002 的重试逻辑一致（都只重试一次）

## 3. 验证

- [x] 3.1 运行 TypeScript 编译，确保没有类型错误（npm run build）
- [x] 3.2 验证 CLI 帮助命令仍然正常输出 JSON
