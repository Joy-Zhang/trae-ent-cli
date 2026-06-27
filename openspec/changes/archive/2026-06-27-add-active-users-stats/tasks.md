## 1. 类型定义更新

- [x] 1.1 在 src/lib/types.ts 中添加 ActiveUsersStats 接口，包含 total_active_users、ide_active_users、plugin_active_users、cli_active_users 字段
- [x] 1.2 更新 UsageStats 接口，添加 activeUsers?: ActiveUsersStats 字段（或保持现有结构，根据实际情况调整）

## 2. 命令实现

- [x] 2.1 在 src/commands/stats.ts 中删除错误的 active-members 命令实现
- [x] 2.2 新增 active-users 命令，定义 --start-date 和 --end-date 可选选项
- [x] 2.3 正确调用 GET /openapi/v1/statistics/active-users 端点，传递 start_date 和 end_date 查询参数
- [x] 2.4 使用 success() 函数输出响应，确保类型安全

## 3. E2E 测试

- [x] 3.1 创建 test/stats-active-users.test.ts 测试文件
- [x] 3.2 测试无参数调用 active-users 命令，验证成功响应格式和必要字段存在
- [x] 3.3 测试带日期参数调用 active-users 命令，验证参数正确传递
- [x] 3.4 运行 npm test 验证测试通过（需要环境变量配置）

## 4. 验证

- [x] 4.1 运行 npm run build 确保 TypeScript 编译通过
- [x] 4.2 运行 npm start -- stats --help 确认帮助信息显示 active-users 命令
- [x] 4.3 手动测试命令（如果环境配置允许）
