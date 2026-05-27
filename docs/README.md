# MySoul.SKILL 文档

## 目录

### 入门
- [快速入门](./quickstart.md) - 5 分钟创建你的第一个数字克隆体
- [项目介绍](../README.md) - 了解 MySoul.SKILL 的理念和功能
- [常见问题](./faq.md) - FAQ
- [故障排除](./troubleshooting.md) - 问题排查指南

### 参考
- [技术规范](../SKILL.md) - 框架架构和标准说明
- [SKILL 本体](../SKILL/SKILL.md) - AI Agent 加载的核心指令
- [特征提取规则](../SKILL/extraction-rules.md) - 人格特征提取详细规则
- [系统提示词模板](../SKILL/system-prompt-template.md) - 产物系统提示词模板
- [记忆管理指南](../SKILL/memory-guide.md) - 记忆管理规范
- [一致性维护指南](../SKILL/consistency-guide.md) - 人格一致性维护
- [产物模板](../dist/template/README.md) - 产物 SKILL 标准模板
- [PLOSL 协议](../dist/template/LICENSE) - 产物协议

### 规范
- [SKILL 格式规范](./spec-skill-format.md) - 产物文件格式标准
- [人格模型规范](./spec-personality-model.md) - 8 维人格模型定义
- [数据安全规范](./data-security.md) - 数据安全要求

### 模板
- [日记模板](../templates/stream-diary.md)
- [价值观模板](../templates/stream-values.md)
- [对话示例模板](../templates/stream-conversation.md)
- [思维模式模板](../templates/stream-thinking.md)
- [博客文章模板](../templates/stream-blog.md)
- [访谈记录模板](../templates/stream-interview.md)
- [专业领域模板](../templates/stream-professional.md)
- [社交媒体模板](../templates/stream-social.md)

### 工具
- [构建脚本 (Unix)](../tools/buildNewSoul.sh)
- [构建脚本 (Windows)](../tools/buildNewSoul.cmd)
- [数据验证清单](../tools/validate-data.md)
- [一致性检查清单](../tools/check-consistency.md)
- [JSON Schema](../tools/meta.schema.json)

### 测试
- [SKILL 验证测试](../tests/skill-validation.md)
- [兼容性测试矩阵](../tests/compatibility-matrix.md)

### 平台指南
- [多平台加载指南](./platform-guide.md)
- [Claude Code 集成](./integration-claude-code.md) - 安装、使用、故障排除
- [ChatGPT 集成](./integration-chatgpt.md) - 自定义指令、GPTs 配置

### SDK 与 API
- [JavaScript SDK](./sdk-javascript.md) - Node.js/浏览器 SDK 规范
- [Python SDK](./sdk-python.md) - Python SDK 规范
- [REST API](./api-rest.md) - HTTP API 接口规范
- [SDK 实现指南](./sdk-implementation-guide.md) - 实现步骤和最佳实践

### 平台扩展
- [VS Code 扩展](./integration-vscode.md) - 编辑器集成规范
- [Web UI](./web-ui-spec.md) - 浏览器端界面规范
- [Web UI 实现](./web-ui-implementation.md) - React 实现指南
- [SKILL 市场](./marketplace-spec.md) - 共享交易平台规范

### 社区与匹配
- [人格匹配算法](./personality-matching.md) - 相似度、互补性、对抗性匹配
- [社区评分系统](./community-scoring.md) - 质量评分、用户评分、排行榜

### 研究创新
- [情感识别增强](./emotion-recognition.md) - 情感维度、识别、表达、调节
- [多文化人格适配](./multicultural-adaptation.md) - 文化维度、适配策略、语言支持
- [人格演化预测](./personality-prediction.md) - 演化检测、预测模型、干预策略
- [多人格系统](./multi-personality.md) - 子人格架构、触发切换、权重配置
- [安全研究](./security-research.md) - 伪造检测、隐私保护、对抗防御

### 工具与可视化
- [人格可视化规范](./visualization-spec.md) - 雷达图、覆盖度图表
- [数据匿名化指南](../tools/anonymize-data.md) - 匿名化规则和检查清单

### 高级
- [版本管理](./version-management.md) - 产物 SKILL 版本管理
- [人格演化](./personality-evolution.md) - 人格演化规范

### 社区
- [贡献指南](../CONTRIBUTING.md) - 如何参与贡献
- [安全策略](../SECURITY.md) - 安全漏洞报告

### 开发
- [开发日志](./devByClaude/) - Claude 辅助开发记录
- [长期路线图](./devByClaude/roadmap.md) - 项目发展规划

---

## 快速导航

**首次使用？** → [快速入门](./quickstart.md)

**想了解技术细节？** → [技术规范](../SKILL.md)

**想看示例？** → [示例产物](../dist/example/README.md)

**有想法？** → [GitHub Issues](https://github.com/WencueCryforme/MySoul.SKILL/issues)
