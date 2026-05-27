/**
 * 数据管理模块
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { SoulConfig, DataStream, ValidationResult } from './types';
import { ValidationError, DataStreamError } from './errors';
import { ProjectManager } from './project';

export class DataManager {
  private config: SoulConfig;
  private projectManager: ProjectManager;

  constructor(config: SoulConfig) {
    this.config = config;
    this.projectManager = new ProjectManager(config);
  }

  /**
   * 添加数据流
   */
  async add(projectId: string, stream: DataStream): Promise<void> {
    // 匿名化处理
    const anonymized = this.anonymize(stream);

    // 计算质量分数
    const quality = this.calculateQuality(anonymized);

    // 保存数据
    const dataDir = path.join(this.config.dataDir, projectId, 'data');
    await fs.mkdir(dataDir, { recursive: true });

    const filename = `${stream.type}-${Date.now()}.json`;
    const filePath = path.join(dataDir, filename);

    await fs.writeFile(filePath, JSON.stringify({
      ...anonymized,
      quality_score: quality,
      created_at: new Date().toISOString()
    }, null, 2));

    // 更新项目元数据
    await this.updateProjectMeta(projectId, stream, quality);
  }

  /**
   * 批量添加数据流
   */
  async addBulk(projectId: string, streams: DataStream[]): Promise<void> {
    for (const stream of streams) {
      await this.add(projectId, stream);
    }
  }

  /**
   * 验证数据质量
   */
  async validate(projectId: string): Promise<ValidationResult> {
    const dataDir = path.join(this.config.dataDir, projectId, 'data');
    const issues: string[] = [];
    const recommendations: string[] = [];
    const coverage: Record<string, number> = {
      diary: 0,
      blog: 0,
      social: 0,
      interview: 0,
      conversation: 0,
      values: 0,
      thinking: 0,
      professional: 0
    };

    try {
      const files = await fs.readdir(dataDir);
      let totalWords = 0;
      let totalScore = 0;
      let count = 0;

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const content = await fs.readFile(path.join(dataDir, file), 'utf-8');
        const data = JSON.parse(content);

        // 统计字数
        totalWords += data.content.length;

        // 统计质量分数
        totalScore += data.quality_score || 0;
        count++;

        // 统计覆盖度
        const type = data.type as keyof typeof coverage;
        if (type in coverage) {
          coverage[type] = Math.min(100, coverage[type] + 20);
        }
      }

      // 检查覆盖度
      const coveredTypes = Object.values(coverage).filter(v => v > 0).length;
      if (coveredTypes < 3) {
        issues.push('数据类型覆盖不足');
        recommendations.push('建议添加更多类型的数据流');
      }

      // 检查总字数
      if (totalWords < 1000) {
        issues.push('总字数不足');
        recommendations.push('建议添加更多内容，至少 1000 字');
      }

      // 计算总分
      const score = count > 0 ? Math.round(totalScore / count) : 0;

      return {
        score,
        coverage,
        issues,
        recommendations
      };
    } catch {
      return {
        score: 0,
        coverage,
        issues: ['未找到数据文件'],
        recommendations: ['请先添加数据流']
      };
    }
  }

  /**
   * 匿名化处理
   */
  private anonymize(stream: DataStream): DataStream {
    let content = stream.content;

    // 替换手机号
    content = content.replace(/1[3-9]\d{9}/g, '[手机号]');

    // 替换邮箱
    content = content.replace(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      '[邮箱]'
    );

    // 替换身份证号
    content = content.replace(
      /[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]/g,
      '[身份证号]'
    );

    return { ...stream, content };
  }

  /**
   * 计算质量分数
   */
  private calculateQuality(stream: DataStream): number {
    let score = 0;

    // 长度评分（最高 40 分）
    const length = stream.content.length;
    if (length > 2000) score += 40;
    else if (length > 1000) score += 30;
    else if (length > 500) score += 20;
    else if (length > 100) score += 10;

    // 类型评分（最高 30 分）
    const typeScores: Record<string, number> = {
      values: 30,
      conversation: 28,
      interview: 28,
      diary: 25,
      thinking: 25,
      blog: 20,
      professional: 20,
      social: 15
    };
    score += typeScores[stream.type] || 10;

    // 内容丰富度评分（最高 30 分）
    const sentences = stream.content.split(/[。！？.!?]/).length;
    if (sentences > 30) score += 30;
    else if (sentences > 20) score += 25;
    else if (sentences > 10) score += 20;
    else if (sentences > 5) score += 15;
    else score += 10;

    return Math.min(100, score);
  }

  /**
   * 更新项目元数据
   */
  private async updateProjectMeta(
    projectId: string,
    stream: DataStream,
    quality: number
  ): Promise<void> {
    const project = await this.projectManager.get(projectId);
    if (!project) return;

    // 计算新的平均质量分数
    const newScore = Math.round(
      (project.quality_score * project.data_streams + quality) /
      (project.data_streams + 1)
    );

    await this.projectManager.update(projectId, {
      data_streams: project.data_streams + 1,
      total_words: project.total_words + stream.content.length,
      quality_score: newScore
    });
  }
}
