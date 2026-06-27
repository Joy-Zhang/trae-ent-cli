## Context

现有 `stats` 命令组的三个子命令（`active-users`、`ai-usage`、`mcp-usage`）均通过 `client.get()` 以 GET + query string 方式调用 API。新对接的 `/openapi/v1/statistics/user-model-usage` API 接受数组参数且仅支持 POST + request body，需要引入新的调用模式。

## Goals / Non-Goals

**Goals:**
- 新增 `stats user-model-usage` 子命令，可查询指定成员的模型使用消耗明细
- 用户可通过 `--emails` 或 `--user-ids`（二选一）筛选目标成员
- 使用 POST 请求，参数放在 request body 中

**Non-Goals:**
- 不修改旧的 `ai-usage` 命令
- 不做日期字符串与时间戳的互转（CLI 直接接收秒级时间戳）
- 不新增文件，仅在现有 `stats.ts` 和 `types.ts` 中修改

## Decisions

### 1. POST 而非 GET

API 参数包含数组（`emails`、`user_ids`），且文档仅支持 POST body 传参。调用 `client.post()` 而非 `client.get()`。

### 2. 时间参数使用秒级时间戳

API 要求 `start_time` 和 `end_time` 为 int 时间戳。CLI 选项直接接收时间戳，不做日期格式转换，保持机器友好。

### 3. CLI 选项校验

`--emails` 和 `--user-ids` 二选一必填。Commander.js 的 `requiredOption` 无法直接支持二选一逻辑，在 action 回调中手动校验。

### 4. 逗号分隔数组

选项值格式为 `a,b,c`，在 action 回调中 `.split(',').map(...)` 转换为数组，传入 request body。

## Risks / Trade-offs

- **与现有命令风格不一致**: 现有 stats 子命令均用 GET，新命令用 POST。→ 接受，因为 API 不支持 GET。
- **无输入校验**: 不校验时间戳合理性、邮箱格式、ID 合法性。→ 接受，CLI 作为透传层，校验由 API 服务端负责。
