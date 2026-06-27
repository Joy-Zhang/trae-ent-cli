# user-model-usage

## Purpose

提供企业内成员的模型使用消耗明细查询，按成员 × 模型维度返回 input/output token 用量，用于收费监控和成本分析。

## Requirements

### Requirement: 查询成员模型使用消耗

系统 SHALL 支持通过 `trae-ent stats user-model-usage` 命令查询指定成员在指定时间范围内的模型使用消耗明细。

命令 SHALL 接受以下参数：
- `--start-time <ts>`: 开始时间（秒时间戳），必填
- `--end-time <ts>`: 结束时间（秒时间戳），必填
- `--emails <emails>`: 成员邮箱列表，逗号分隔，与 `--user-ids` 二选一必填
- `--user-ids <ids>`: 成员 ID 列表，逗号分隔，与 `--emails` 二选一必填

命令 SHALL 发送 POST 请求至 `/openapi/v1/statistics/user-model-usage`，参数放在 request body 中。

#### Scenario: 通过邮箱查询

- **WHEN** 用户执行 `trae-ent stats user-model-usage --start-time 1704067200 --end-time 1706745600 --emails a@example.com`
- **THEN** 系统发送 POST 请求，body 为 `{"start_time":1704067200,"end_time":1706745600,"emails":["a@example.com"]}`
- **AND** 系统以 JSON 格式输出 API 响应数据

#### Scenario: 通过用户 ID 查询

- **WHEN** 用户执行 `trae-ent stats user-model-usage --start-time 1704067200 --end-time 1706745600 --user-ids 1001,1002`
- **THEN** 系统发送 POST 请求，body 为 `{"start_time":1704067200,"end_time":1706745600,"user_ids":[1001,1002]}`
- **AND** 系统以 JSON 格式输出 API 响应数据

#### Scenario: 缺少成员筛选参数

- **WHEN** 用户执行 `trae-ent stats user-model-usage --start-time 1704067200 --end-time 1706745600`（未提供 `--emails` 或 `--user-ids`）
- **THEN** 系统输出错误 JSON `{"success":false,"error":{"code":"MISSING_PARAM","message":"At least one of --emails or --user-ids is required"}}`
- **AND** 进程退出码为非 0
