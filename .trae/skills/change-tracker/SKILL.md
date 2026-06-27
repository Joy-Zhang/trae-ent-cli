---
name: change-tracker
description: 在openspec-propose和openspec-archive-change时，触发该技能，修改tracker.md中变更状态
compatibility: Requires openspec CLI.
metadata:
  author: zhangyijun
---

# change-tracker

在 openspec 提案或归档变更时，自动更新 `product/changes/tracker.md` 中的变更状态。

**触发时机**：
- `openspec-propose` 完成后 → 将对应变更状态设为 **WIP**
- `openspec-archive-change` 完成后 → 将对应变更状态设为 **DONE**

---

**输入**：
- `ch`：变更文档，从上下文读取
- `action`：操作类型，值为 `"propose"` 或 `"archive"`

---

**Steps**

1. **读取 tracker 文件**

   读取 `product/changes/tracker.md`，解析其中的变更追踪表格。

   表格格式：
   ```
   | 变更 | 状态 | 摘要 |
   | CH-XXXX | TODO/WIP/DONE | 摘要描述 |
   ```

2. **匹配变更条目**

   - 读取 `product/changes/cards/` 目录下的所有 `CH-XXXX.md` 文件
   - 在每个卡片文件中搜索与 `change_name` 的关联（卡片内容中可能包含 openspec 变更名称的引用）
   - 如果无法自动匹配，使用 **AskUserQuestion tool** 让用户选择要更新的 CH-XXXX 条目（列出 tracker.md 中所有条目供选择）

   如果仍然无法确定：提示用户手动指定 CH-XXXX，并 STOP。

3. **确定目标状态**

   | action | 目标状态 |
   |--------|---------|
   | `"propose"` | WIP |
   | `"archive"` | DONE |

4. **更新 tracker.md**

   使用 SearchReplace 工具将 tracker.md 中对应行的状态列从当前状态替换为目标状态。

   示例：将 `| CH-0001 | TODO | xxx |` 更新为 `| CH-0001 | WIP | xxx |`

5. **显示更新结果**

   ```
   ## Tracker 状态已更新

   **变更:** CH-XXXX
   **操作:** propose / archive
   **状态:** TODO → WIP / WIP → DONE
   ```

---

**Guardrails**
- 仅修改 tracker.md 中匹配的 CH-XXXX 行，不修改其他行
- 如果当前状态已经与目标状态一致，跳过更新并提示用户
- 如果找不到匹配的 CH-XXXX 条目，必须提示用户确认，不得自行创建
- 状态流转规则：
  - `TODO → WIP`（propose 时）
  - `WIP → DONE`（archive 时）
  - 如果 archive 时状态为 `TODO`，仍然允许更新为 `DONE`，但提示用户状态跳过了 WIP
