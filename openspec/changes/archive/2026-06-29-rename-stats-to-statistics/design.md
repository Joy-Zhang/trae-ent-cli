## Context

当前 CLI 顶层命令 `trae-ent stats` 与 API 路径 `/openapi/v1/statistics/` 命名不一致。变更需求表明应统一使用 `statistics` 作为资源名称。这是一个纯重命名操作，不涉及 API 路径、业务逻辑、或命令行为的任何变化。

## Goals / Non-Goals

**Goals:**
- CLI 资源命令从 `stats` 重命名为 `statistics`
- 源文件名、函数名、测试文件和 spec 文档同步更新

**Non-Goals:**
- 不修改 API 路径（`/openapi/v1/statistics/` 和 `/openapi/v1/stats/` 保持不变）
- 不修改任何业务逻辑
- 不添加或删除任何命令功能

## Decisions

- **文件重命名策略**: 直接重命名 `src/commands/stats.ts` → `src/commands/statistics.ts`，同步更新 import 引用
- **函数命名**: `registerStatsCommands` → `registerStatisticsCommands`，遵循 PascalCase 命名惯例
- **向后兼容**: 不做。这是一个 **BREAKING** 变更，`trae-ent stats` 将不再可用

## Risks / Trade-offs

- [Breaking change] 现有脚本和 AI agent 引用 `trae-ent stats` 的地方需要同步更新 → 这是预期行为，对齐 API 文档定义
- [潜在冲突] 如果有其他代码动态调用 `stats` 命令（如测试框架外的集成脚本）→ 搜索代码库确认只有测试文件中有硬编码引用
