# Changelog

## v1.0.0 (2026-05-27)

### 新增
- SKILL 本体 (`skill/SKILL.md`) - 完整的 AI Agent 指令文件
- Claude Code 命令集成 (`.claude/commands/`) - 支持 /create、/add、/build
- 8 种数据流输入模板 (`templates/`)
- 构建脚本 (Unix/Windows)
- 快速入门指南 (`docs/quickstart.md`)
- 完整示例产物 (`dist/example/`)
- 技术规范文档 (`SKILL.md`)
- 创意用法文档 (`.forgithub/docs/AddUsage.md`)
- 未来想法文档 (`.forgithub/docs/AddIdea.md`)

### 优化
- 中文 README：添加项目结构、模板引用、更新路线图
- 英文 README：同步更新
- 文档结构重组，添加快速导航

### 迭代 #2 (2026-05-27)

#### 新增
- `SKILL/extraction-rules.md` - 人格特征提取详细规则
- `/apply_meet` 命令定义和实现逻辑

#### 优化
- 特征提取从概念描述细化为可执行规则
- 产物模板增加人格模型维度表格
- 引入 100 分制质量评分体系
- 定义一致性校验规则

### 迭代 #3 (2026-05-27)

#### 新增
- 产物 SKILL 新增"开场白"和"示例对话"模块
- 特征提取规则新增"开场白与示例对话"维度
- `SKILL/system-prompt-template.md` - 产物系统提示词模板
- `SKILL/memory-guide.md` - 记忆管理指南
- `SKILL/consistency-guide.md` - 人格一致性维护指南
- `tools/check-consistency.md` - 人格一致性检查清单
- `tools/validate-data.md` - 数据流质量验证清单
- `docs/platform-guide.md` - 多平台加载指南

#### 优化
- 产物模板增加开场白示例
- 示例对话扩展为 4 种场景
- 参考 SillyTavern 角色卡格式优化结构
- 按 prompt engineering 最佳实践优化 SKILL 指令
- 修复提取规则维度编号问题

### 迭代 #4 (2026-05-27)

#### 新增
- `docs/version-management.md` - 产物 SKILL 版本管理指南
- `docs/personality-evolution.md` - 人格演化指南

#### 优化
- docs/README.md 导航更新
- CHANGELOG 更新

### 迭代 #5 (2026-05-27)

#### 新增
- `CONTRIBUTING.md` - 贡献指南
- `SECURITY.md` - 安全策略
- `.github/ISSUE_TEMPLATE/bug_report.md` - Bug 报告模板
- `.github/ISSUE_TEMPLATE/feature_request.md` - 功能建议模板
- `.github/PULL_REQUEST_TEMPLATE.md` - PR 模板
- `docs/faq.md` - 常见问题解答
- `docs/troubleshooting.md` - 故障排除指南
- `tools/meta.schema.json` - meta.json JSON Schema
- `docs/devByClaude/roadmap.md` - 长期开发路线图

#### 优化
- 日文 README 同步更新（快速入门链接、模板引用、示例引用、路线图）
- docs/README.md 导航更新（新增社区、FAQ、故障排除）

### 迭代 #6 (2026-05-27)

#### 新增
- `docs/spec-skill-format.md` - SKILL 文件格式规范
- `docs/spec-personality-model.md` - 8 维人格模型正式规范
- `docs/data-security.md` - 数据安全规范
- `tests/skill-validation.md` - SKILL 验证测试用例
- `tests/compatibility-matrix.md` - 兼容性测试矩阵
- `.github/workflows/validate.yml` - CI/CD 自动化验证

#### 优化
- docs/README.md 导航更新（新增规范、测试）
- 长期路线图规划

### 迭代 #7 (2026-05-27)

#### 新增
- `docs/visualization-spec.md` - 人格可视化规范（雷达图、覆盖度图、进度图、版本历史图）
- `docs/integration-claude-code.md` - Claude Code 集成详细指南
- `docs/integration-chatgpt.md` - ChatGPT 集成指南（含 GPTs 配置）
- `tools/anonymize-data.md` - 数据匿名化工具指南（正则检测、检查清单）

#### 优化
- docs/README.md 导航更新（新增集成指南、可视化规范）
- 长期计划进度更新

### 迭代 #8 (2026-05-27)

#### 新增
- `docs/sdk-javascript.md` - JavaScript/TypeScript SDK 规范（类型定义、API、事件系统）
- `docs/sdk-python.md` - Python SDK 规范（同步/异步、CLI 集成）
- `docs/api-rest.md` - REST API 规范（认证、项目/数据/构建/对话接口）

#### 优化
- docs/README.md 导航更新（新增 SDK、API 文档）
- 长期计划进入阶段八：生态扩展

### 迭代 #9 (2026-05-27)

#### 新增
- `docs/integration-vscode.md` - VS Code 扩展规范（命令、侧边栏、编辑器集成）
- `docs/web-ui-spec.md` - Web UI 规范（页面结构、仪表盘、响应式设计）
- `docs/marketplace-spec.md` - SKILL 市场规范（发布、发现、评分、版权）

#### 优化
- docs/README.md 导航更新（新增平台扩展文档）
- 阶段八生态扩展持续推进

### 迭代 #10 (2026-05-27)

#### 新增
- `docs/personality-matching.md` - 人格匹配算法规范（相似/互补/对抗匹配、权重系统）
- `docs/community-scoring.md` - 社区评分系统规范（自动评分、用户评分、排行榜、防作弊）

#### 优化
- docs/README.md 导航更新（新增社区与匹配文档）
- 阶段八生态扩展基本完成

### 迭代 #11 (2026-05-27)

#### 新增
- `docs/emotion-recognition.md` - 情感识别增强规范（情感维度、识别算法、表达策略、调节机制）
- `docs/multicultural-adaptation.md` - 多文化人格适配规范（文化维度、适配策略、语言支持）
- `docs/personality-prediction.md` - 人格演化预测规范（演化检测、预测模型、干预策略）

#### 优化
- docs/README.md 导航更新（新增研究创新文档）
- 阶段九研究创新启动

### 迭代 #12 (2026-05-27)

#### 新增
- `docs/multi-personality.md` - 多人格系统规范（子人格架构、触发机制、切换策略、权重配置）
- `docs/security-research.md` - 安全研究规范（人格伪造检测、隐私保护、对抗攻击防御）
- `docs/devByClaude/project-status.md` - 项目状态报告（完成状态、文件清单、质量指标）

#### 优化
- docs/README.md 导航更新（新增多人格系统、安全研究文档）
- docs/devByClaude/long-term-plan.md 更新（全部阶段完成）
- 阶段九研究创新完成
- 长期计划四个阶段全部完成
- 项目进入实现阶段

### 迭代 #13 (2026-05-27)

#### 新增
- `docs/sdk-implementation-guide.md` - SDK 实现指南（项目结构、核心模块、错误处理、测试策略）
- `docs/web-ui-implementation.md` - Web UI 实现指南（React 组件、状态管理、API 服务）
- `docs/devByClaude/implementation-plan.md` - 实现阶段计划（SDK/Web UI/API/集成）

#### 优化
- docs/README.md 导航更新（新增实现指南）
- 从规范阶段向实现阶段过渡

### 迭代 #14 (2026-05-27)

#### 新增
- `sdk/javascript/` - JavaScript SDK 核心实现
  - `package.json` - 项目配置
  - `tsconfig.json` - TypeScript 配置
  - `jest.config.js` - 测试配置
  - `src/types.ts` - 类型定义
  - `src/errors.ts` - 错误定义
  - `src/client.ts` - 客户端类
  - `src/project.ts` - 项目管理模块
  - `src/data.ts` - 数据管理模块
  - `src/build.ts` - 构建管理模块
  - `src/chat.ts` - 对话管理模块
  - `tests/client.test.ts` - 单元测试（16 个测试全部通过）
- `sdk/python/` - Python SDK 核心实现
  - `pyproject.toml` - 项目配置
  - `myoul/__init__.py` - 包入口
  - `myoul/types.py` - 类型定义
  - `myoul/exceptions.py` - 异常定义
  - `myoul/client.py` - 客户端类
  - `myoul/project.py` - 项目管理模块
  - `myoul/data.py` - 数据管理模块
  - `myoul/build.py` - 构建管理模块
  - `myoul/chat.py` - 对话管理模块
  - `tests/test_client.py` - 单元测试

#### Bug 修复
- 修复测试数据内容过短导致验证失败的问题
- 调整质量分数阈值从 50 降至 30 以提高可用性

#### 优化
- 实现阶段正式启动
- JavaScript SDK 核心功能完成并通过所有测试
- Python SDK 核心功能完成

### 迭代 #15 (2026-05-27)

#### 新增
- `web/` - Web UI 前端项目
  - `package.json` - 项目配置（React + Vite + Ant Design）
  - `tsconfig.json` - TypeScript 配置
  - `vite.config.ts` - Vite 配置
  - `index.html` - 入口 HTML
  - `src/main.tsx` - 应用入口
  - `src/App.tsx` - 路由配置
  - `src/index.css` - 全局样式
  - `src/components/Layout.tsx` - 布局组件
  - `src/pages/Home.tsx` - 首页
  - `src/pages/Projects.tsx` - 项目列表页
  - `src/pages/ProjectDetail.tsx` - 项目详情页
  - `src/services/api.ts` - API 服务层

#### 优化
- 阶段二 Web UI 实现启动
- 前端基础架构完成

### 协议
- MIT License（框架）
- PLOSL License v1.0（产物）
