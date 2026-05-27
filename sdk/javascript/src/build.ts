/**
 * 构建管理模块
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import {
  SoulConfig,
  BuildOptions,
  BuildResult,
  BuildStatus,
  PersonalityModel,
  PersonalityDimension
} from './types';
import { BuildError } from './errors';
import { ProjectManager } from './project';
import { DataManager } from './data';

export class BuildManager {
  private config: SoulConfig;
  private projectManager: ProjectManager;
  private dataManager: DataManager;

  constructor(config: SoulConfig) {
    this.config = config;
    this.projectManager = new ProjectManager(config);
    this.dataManager = new DataManager(config);
  }

  /**
   * 执行构建
   */
  async build(projectId: string, options?: BuildOptions): Promise<BuildResult> {
    const project = await this.projectManager.get(projectId);
    if (!project) {
      throw new BuildError('项目不存在', 'init');
    }

    // 读取所有数据
    const data = await this.loadAllData(projectId);

    // 执行构建阶段
    const stages = [
      { name: '数据预处理', weight: 15, handler: () => this.preprocessData(data) },
      { name: '特征提取', weight: 35, handler: () => this.extractFeatures(data) },
      { name: '人格建模', weight: 20, handler: () => this.buildPersonality(data) },
      { name: 'SKILL 生成', weight: 20, handler: () => this.generateSkill(projectId, data) },
      { name: '验证输出', weight: 10, handler: () => this.validateOutput(projectId) }
    ];

    let totalProgress = 0;
    let personality: PersonalityModel | null = null;

    for (const stage of stages) {
      options?.onProgress?.(stage.name, totalProgress);

      try {
        const result = await stage.handler();
        if (result && 'dimensions' in result) {
          personality = result as PersonalityModel;
        }
      } catch (error) {
        throw new BuildError(
          `构建失败: ${error instanceof Error ? error.message : '未知错误'}`,
          stage.name
        );
      }

      totalProgress += stage.weight;
    }

    options?.onProgress?.('完成', 100);

    // 更新版本号
    const newVersion = this.incrementVersion(project.version);
    await this.projectManager.update(projectId, { version: newVersion });

    // 生成输出路径
    const outputPath = path.join(
      this.config.outputDir,
      projectId,
      `v${newVersion}.md`
    );

    return {
      version: newVersion,
      score: project.quality_score,
      outputPath,
      personality: personality || this.getDefaultPersonality()
    };
  }

  /**
   * 获取构建状态
   */
  async getStatus(projectId: string, buildId: string): Promise<BuildStatus> {
    // 简化实现：返回模拟状态
    return {
      id: buildId,
      status: 'completed',
      progress: {
        total: 100,
        current_stage: '完成',
        stages: [
          { id: 1, label: '数据预处理', progress: 100 },
          { id: 2, label: '特征提取', progress: 100 },
          { id: 3, label: '人格建模', progress: 100 },
          { id: 4, label: 'SKILL 生成', progress: 100 },
          { id: 5, label: '验证输出', progress: 100 }
        ]
      }
    };
  }

  /**
   * 加载所有数据
   */
  private async loadAllData(projectId: string): Promise<any[]> {
    const dataDir = path.join(this.config.dataDir, projectId, 'data');
    const data: any[] = [];

    try {
      const files = await fs.readdir(dataDir);
      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const content = await fs.readFile(path.join(dataDir, file), 'utf-8');
        data.push(JSON.parse(content));
      }
    } catch {
      // 数据目录不存在
    }

    return data;
  }

  /**
   * 数据预处理
   */
  private async preprocessData(data: any[]): Promise<any> {
    // 清洗和标准化数据
    return data.map(item => ({
      ...item,
      content: item.content.trim(),
      processed: true
    }));
  }

  /**
   * 特征提取
   */
  private async extractFeatures(data: any[]): Promise<any> {
    // 分析数据中的特征
    const features: Record<string, number> = {
      diary: 0,
      blog: 0,
      social: 0,
      interview: 0,
      conversation: 0,
      values: 0,
      thinking: 0,
      professional: 0
    };

    data.forEach(item => {
      if (item.type in features) {
        features[item.type] += item.content.length;
      }
    });

    return features;
  }

  /**
   * 人格建模
   */
  private async buildPersonality(data: any[]): Promise<PersonalityModel> {
    // 简化实现：基于数据生成人格模型
    const dimensions: PersonalityDimension[] = [
      { label: '核心价值观', value: this.calculateDimensionScore(data, 'values'), level: '良好' },
      { label: '思维模式', value: this.calculateDimensionScore(data, 'thinking'), level: '良好' },
      { label: '表达风格', value: this.calculateDimensionScore(data, 'conversation'), level: '良好' },
      { label: '知识体系', value: this.calculateDimensionScore(data, 'professional'), level: '良好' },
      { label: '人际关系', value: this.calculateDimensionScore(data, 'social'), level: '良好' },
      { label: '情感特征', value: this.calculateDimensionScore(data, 'diary'), level: '良好' },
      { label: '生活态度', value: this.calculateDimensionScore(data, 'blog'), level: '良好' },
      { label: '开场白与示例', value: 75, level: '良好' }
    ];

    const overallScore = Math.round(
      dimensions.reduce((sum, d) => sum + d.value, 0) / dimensions.length
    );

    return {
      dimensions,
      overallScore
    };
  }

  /**
   * 计算维度分数
   */
  private calculateDimensionScore(data: any[], type: string): number {
    const typeData = data.filter(d => d.type === type);
    if (typeData.length === 0) return 50;

    const totalLength = typeData.reduce((sum, d) => sum + d.content.length, 0);
    const avgQuality = typeData.reduce((sum, d) => sum + (d.quality_score || 50), 0) / typeData.length;

    // 基于长度和质量计算分数
    let score = 50;
    if (totalLength > 2000) score += 20;
    else if (totalLength > 1000) score += 15;
    else if (totalLength > 500) score += 10;

    score += (avgQuality - 50) * 0.5;

    return Math.min(100, Math.max(0, Math.round(score)));
  }

  /**
   * 生成 SKILL 文件
   */
  private async generateSkill(projectId: string, data: any[]): Promise<void> {
    const project = await this.projectManager.get(projectId);
    if (!project) return;

    const outputDir = path.join(this.config.outputDir, projectId);
    await fs.mkdir(outputDir, { recursive: true });

    const content = `# ${project.name} 的数字克隆体

## 身份声明
我是 ${project.name} 的数字克隆体，基于真实数据构建。

## 核心人格
基于 ${project.data_streams} 个数据流构建，总字数 ${project.total_words}。

## 对话指南
- 保持人格一致性
- 尊重用户边界
- 提供有价值的对话

## 版本信息
- 版本: ${project.version}
- 质量评分: ${project.quality_score}/100
- 构建时间: ${new Date().toISOString()}
`;

    const outputPath = path.join(outputDir, `v${project.version}.md`);
    await fs.writeFile(outputPath, content);
  }

  /**
   * 验证输出
   */
  private async validateOutput(projectId: string): Promise<void> {
    const project = await this.projectManager.get(projectId);
    if (!project) return;

    const outputPath = path.join(
      this.config.outputDir,
      projectId,
      `v${project.version}.md`
    );

    try {
      await fs.access(outputPath);
    } catch {
      throw new BuildError('输出文件不存在', '验证输出');
    }
  }

  /**
   * 递增版本号
   */
  private incrementVersion(version: string): string {
    const parts = version.split('.').map(Number);
    parts[2] = (parts[2] || 0) + 1;
    return parts.join('.');
  }

  /**
   * 获取默认人格模型
   */
  private getDefaultPersonality(): PersonalityModel {
    return {
      dimensions: [
        { label: '核心价值观', value: 50, level: '基本' },
        { label: '思维模式', value: 50, level: '基本' },
        { label: '表达风格', value: 50, level: '基本' },
        { label: '知识体系', value: 50, level: '基本' },
        { label: '人际关系', value: 50, level: '基本' },
        { label: '情感特征', value: 50, level: '基本' },
        { label: '生活态度', value: 50, level: '基本' },
        { label: '开场白与示例', value: 50, level: '基本' }
      ],
      overallScore: 50
    };
  }
}
