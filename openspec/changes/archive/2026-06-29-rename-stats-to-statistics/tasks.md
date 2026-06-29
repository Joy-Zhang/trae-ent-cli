## 1. 源文件重命名与更新

- [x] 1.1 将 `src/commands/stats.ts` 中的 `.command('stats')` 改为 `.command('statistics')`
- [x] 1.2 将文件重命名为 `src/commands/statistics.ts`，函数 `registerStatsCommands` 重命名为 `registerStatisticsCommands`
- [x] 1.3 更新 `src/index.ts`: import 路径改为 `./commands/statistics.js`，调用改为 `registerStatisticsCommands`
- [x] 1.4 更新 `AGENTS.md` 中的命令示例: `trae-ent stats` → `trae-ent statistics`

## 2. 测试文件更新

- [x] 2.1 将 `test/stats-active-users.test.ts` 中所有 `'stats'` 字符串替换为 `'statistics'`，文件重命名为 `test/statistics-active-users.test.ts`
- [x] 2.2 将 `test/stats-user-model-usage.test.ts` 中所有 `'stats'` 字符串替换为 `'statistics'`，文件重命名为 `test/statistics-user-model-usage.test.ts`

## 3. 验证

- [x] 3.1 执行 `npm run build` 确保编译通过
- [x] 3.2 执行 `npm test` 确保测试通过
