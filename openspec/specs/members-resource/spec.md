## Purpose

定义成员管理命令组，包括邀请、查询、移除成员功能。

## Requirements

### Requirement: members 命令组
CLI SHALL 提供 `trae-ent members` 命令组，用于管理企业成员，包含 invite、list、remove 子命令。

#### Scenario: members 命令存在
- **WHEN** 用户运行 `trae-ent members --help`
- **THEN** 系统 SHALL 输出包含 invite、list、remove 子命令的帮助信息，格式为 JSON

### Requirement: members list 命令
CLI SHALL 提供 `trae-ent members list` 命令用于查询成员列表。

#### Scenario: 命令定义存在
- **WHEN** 初始化项目结构完成
- **THEN** `src/commands/members.ts` 文件 SHALL 存在并定义 list 命令
- **THEN** 命令调用对应的 API 客户端方法并返回 JSON 结果

### Requirement: members invite 命令
CLI SHALL 提供 `trae-ent members invite <email>` 命令用于邀请新成员。

#### Scenario: 命令定义存在
- **WHEN** 初始化项目结构完成
- **THEN** `src/commands/members.ts` 文件 SHALL 存在并定义 invite 命令
- **THEN** 命令接受 email 参数并调用对应的 API

### Requirement: members remove 命令
CLI SHALL 提供 `trae-ent members remove <member-id>` 命令用于移除成员。

#### Scenario: 命令定义存在
- **WHEN** 初始化项目结构完成
- **THEN** `src/commands/members.ts` 文件 SHALL 存在并定义 remove 命令
- **THEN** 命令接受 member-id 参数并调用对应的 API
