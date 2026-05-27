/**
 * 项目管理模块
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { SoulConfig, Project } from './types';
import { ValidationError, ProjectNotFoundError } from './errors';

export class ProjectManager {
  private config: SoulConfig;

  constructor(config: SoulConfig) {
    this.config = config;
  }

  /**
   * 创建项目
   */
  async create(name: string): Promise<Project> {
    // 验证项目名称
    this.validateProjectName(name);

    // 检查项目是否已存在
    const existing = await this.get(name);
    if (existing) {
      throw new ValidationError(`项目已存在: ${name}`);
    }

    // 创建项目目录
    const projectDir = path.join(this.config.dataDir, name);
    await fs.mkdir(projectDir, { recursive: true });
    await fs.mkdir(path.join(projectDir, 'data'), { recursive: true });

    // 创建 meta.json
    const now = new Date().toISOString();
    const meta: Project = {
      id: name,
      name,
      created_at: now,
      updated_at: now,
      version: '1.0.0',
      data_streams: 0,
      total_words: 0,
      quality_score: 0,
      status: 'active'
    };

    await fs.writeFile(
      path.join(projectDir, 'meta.json'),
      JSON.stringify(meta, null, 2)
    );

    return meta;
  }

  /**
   * 列出所有项目
   */
  async list(): Promise<Project[]> {
    try {
      const dirs = await fs.readdir(this.config.dataDir);
      const projects: Project[] = [];

      for (const dir of dirs) {
        const metaPath = path.join(this.config.dataDir, dir, 'meta.json');
        try {
          const content = await fs.readFile(metaPath, 'utf-8');
          const meta = JSON.parse(content) as Project;
          projects.push(meta);
        } catch {
          // 跳过没有 meta.json 的目录
        }
      }

      return projects;
    } catch {
      return [];
    }
  }

  /**
   * 获取项目信息
   */
  async get(projectId: string): Promise<Project | null> {
    const metaPath = path.join(this.config.dataDir, projectId, 'meta.json');
    try {
      const content = await fs.readFile(metaPath, 'utf-8');
      return JSON.parse(content) as Project;
    } catch {
      return null;
    }
  }

  /**
   * 更新项目信息
   */
  async update(projectId: string, updates: Partial<Project>): Promise<Project> {
    const project = await this.get(projectId);
    if (!project) {
      throw new ProjectNotFoundError(projectId);
    }

    const updated = {
      ...project,
      ...updates,
      updated_at: new Date().toISOString()
    };

    const metaPath = path.join(this.config.dataDir, projectId, 'meta.json');
    await fs.writeFile(metaPath, JSON.stringify(updated, null, 2));

    return updated;
  }

  /**
   * 删除项目
   */
  async delete(projectId: string): Promise<void> {
    const projectDir = path.join(this.config.dataDir, projectId);
    try {
      await fs.rm(projectDir, { recursive: true, force: true });
    } catch {
      throw new ProjectNotFoundError(projectId);
    }
  }

  /**
   * 验证项目名称
   */
  private validateProjectName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('项目名称不能为空');
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      throw new ValidationError('项目名称只能包含字母、数字、下划线和连字符');
    }

    if (name.length > 64) {
      throw new ValidationError('项目名称不能超过 64 个字符');
    }
  }
}
