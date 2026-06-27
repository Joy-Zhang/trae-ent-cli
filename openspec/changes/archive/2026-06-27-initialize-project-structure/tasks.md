## 1. 项目配置初始化

- [x] 1.1 初始化 package.json，声明必要依赖（commander、typescript、ts-node、@types/node），配置 Node.js >= 18 要求
- [x] 1.2 创建 tsconfig.json，配置 TypeScript 编译选项
- [x] 1.3 创建 .gitignore 文件，忽略 node_modules、dist、环境变量文件等
- [x] 1.4 创建项目目录结构（src/commands、src/lib、src/utils、test）

## 2. 核心工具模块实现

- [x] 2.1 实现 src/lib/types.ts，定义共享类型（CliResponse、凭证配置、API 响应类型等）
- [x] 2.2 实现 src/utils/output.ts，提供统一的 JSON 输出和错误处理函数
- [x] 2.3 实现 src/lib/auth.ts，处理鉴权流程、token 文件缓存、凭证读取（环境变量 + 命令行参数）
- [x] 2.4 实现 src/lib/client.ts，实现统一 API 客户端、Base URL 处理、Authorization 头注入、QPS 限流、429 重试

## 3. CLI 命令框架搭建

- [x] 3.1 实现 src/index.ts，初始化 Commander，配置全局选项（--app-id、--app-secret、--base-url）
- [x] 3.2 实现 src/commands/members.ts，定义 members 命令组及 invite/list/remove 子命令骨架
- [x] 3.3 实现 src/commands/stats.ts，定义 stats 命令组骨架
- [x] 3.4 实现 src/commands/logs.ts，定义 logs 命令组骨架

## 4. 文档与收尾

- [x] 4.1 编制 AGENTS.md，包含项目结构、开发命令、架构约定、CLI 设计规范
- [x] 4.2 在 package.json 中配置 build、start、test 脚本
- [x] 4.3 验证项目能正常构建（npm run build）
- [x] 4.4 验证 CLI 帮助命令正常输出 JSON 格式
