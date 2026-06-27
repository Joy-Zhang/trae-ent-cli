## 1. 类型定义

- [x] 1.1 在 `src/lib/types.ts` 新增 `UserModelUsageParams`、`ModelUsageDetail`、`UserModelUsageItem` 接口

## 2. 命令实现

- [x] 2.1 在 `src/commands/stats.ts` 新增 `user-model-usage` 子命令，包含 `--start-time`、`--end-time`、`--emails`、`--user-ids` 选项
- [x] 2.2 在 action 回调中实现二选一校验（`--emails` 和 `--user-ids` 至少提供一个）
- [x] 2.3 在 action 回调中将逗号分隔字符串转换为数组，通过 `client.post()` 发送 POST 请求

## 3. 验证

- [x] 3.1 `npm run build` 编译通过
- [x] 3.2 将 `user-model-usage` 测试用例补充到 E2E 测试
- [x] 3.3 `npm test` 全部通过
