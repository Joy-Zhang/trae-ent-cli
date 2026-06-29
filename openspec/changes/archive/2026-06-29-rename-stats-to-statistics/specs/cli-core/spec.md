## MODIFIED Requirements

### Requirement: CLI 入口和基础命令结构
CLI 工具 SHALL 提供 `trae-ent` 命令，采用资源导向的命令结构，包含 `members`、`statistics`、`logs` 三个顶级资源子命令。

#### Scenario: 执行帮助命令
- **WHEN** 用户运行 `trae-ent --help`
- **THEN** 系统 SHALL 输出包含 members、statistics、logs 子命令的帮助信息，格式为 JSON

#### Scenario: 无参数执行
- **WHEN** 用户直接运行 `trae-ent` 不带任何参数
- **THEN** 系统 SHALL 输出帮助信息或错误提示，格式为 JSON
