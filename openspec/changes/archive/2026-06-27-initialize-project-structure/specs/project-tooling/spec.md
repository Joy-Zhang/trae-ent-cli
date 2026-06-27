## ADDED Requirements

### Requirement: 项目配置文件
项目根目录 SHALL 包含必要的配置文件，用于 TypeScript 编译、npm 包管理和构建。

#### Scenario: package.json 存在
- **WHEN** 项目初始化完成
- **THEN** 根目录 SHALL 存在 `package.json` 文件
- **THEN** package.json SHALL 声明依赖：commander、typescript、ts-node、@types/node
- **THEN** package.json SHALL 要求 Node.js >= 18
- **THEN** package.json SHALL 包含 `build`、`start`、`test` 等脚本命令

#### Scenario: tsconfig.json 存在
- **WHEN** 项目初始化完成
- **THEN** 根目录 SHALL 存在 `tsconfig.json` 文件，配置 TypeScript 编译选项

#### Scenario: .gitignore 存在
- **WHEN** 项目初始化完成
- **THEN** 根目录 SHALL 存在 `.gitignore` 文件，忽略 node_modules、dist、.env 等文件

### Requirement: 源代码目录结构
项目 SHALL 按照分层架构创建 src/ 目录结构。

#### Scenario: src/ 目录结构完整
- **WHEN** 项目初始化完成
- **THEN** SHALL 存在 `src/index.ts`（CLI 入口）
- **THEN** SHALL 存在 `src/commands/` 目录，包含 members.ts、stats.ts、logs.ts
- **THEN** SHALL 存在 `src/lib/` 目录，包含 auth.ts、client.ts、types.ts
- **THEN** SHALL 存在 `src/utils/` 目录，包含 output.ts

### Requirement: AGENTS.md 项目指南
项目根目录 SHALL 存在完整的 AGENTS.md 文件，为 AI 助手提供项目指南。

#### Scenario: AGENTS.md 内容完整
- **WHEN** 项目初始化完成
- **THEN** 根目录 SHALL 存在 `AGENTS.md` 文件
- **THEN** AGENTS.md SHALL 包含项目结构说明
- **THEN** AGENTS.md SHALL 包含开发命令说明
- **THEN** AGENTS.md SHALL 包含代码风格和架构约定
- **THEN** AGENTS.md SHALL 包含 CLI 命令设计规范

### Requirement: E2E 测试配置
项目 SHALL 配置 node:test 作为 E2E 测试工具。

#### Scenario: 测试配置存在
- **WHEN** 项目初始化完成
- **THEN** SHALL 存在 `test/` 目录用于存放 E2E 测试
- **THEN** package.json 中的 test 脚本 SHALL 使用 node:test 运行测试
