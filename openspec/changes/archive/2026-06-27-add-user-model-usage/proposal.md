## Why

对接企业级收费监控和成本分析场景，需要查询企业内各成员的模型使用消耗明细（按成员 × 模型维度），用于生成用量报表、成本归因和资源优化决策。

## What Changes

- 新增 `trae-ent stats user-model-usage` 子命令，通过 POST 请求调用 `/openapi/v1/statistics/user-model-usage` API
- 支持 `--start-time` / `--end-time` 秒级时间戳参数，跨度最大 180 天
- 支持 `--emails` 或 `--user-ids` 筛选目标成员（二选一必填）
- 这是 stats 命令组中首个 POST 请求命令，参数通过 request body 传递

## Capabilities

### New Capabilities

- `user-model-usage`: 查询指定成员在指定时间范围内的模型使用消耗明细，返回每个成员在每个模型上的 input/output token 用量

### Modified Capabilities

（无）

## Impact

- `src/commands/stats.ts` — 新增 `user-model-usage` 子命令
- `src/lib/types.ts` — 新增 `UserModelUsageParams`、`ModelUsageDetail`、`UserModelUsageItem` 类型
- API: `POST /openapi/v1/statistics/user-model-usage`
