/**
 * MySoul.SKILL SDK 客户端
 */

import { EventEmitter } from 'events';
import {
  SoulConfig,
  Project,
  DataStream,
  ValidationResult,
  BuildOptions,
  BuildResult,
  ChatResponse,
  ChatHistory,
  BuildStatus,
  SoulEvent,
  EventHandler
} from './types';
import {
  MySoulError,
  ValidationError,
  BuildError,
  ProjectNotFoundError
} from './errors';
import { ProjectManager } from './project';
import { DataManager } from './data';
import { BuildManager } from './build';
import { ChatManager } from './chat';

export class MySoul extends EventEmitter {
  private config: SoulConfig;
  private projectManager: ProjectManager;
  private dataManager: DataManager;
  private buildManager: BuildManager;
  private chatManager: ChatManager;

  constructor(config: SoulConfig) {
    super();
    this.config = config;
    this.projectManager = new ProjectManager(config);
    this.dataManager = new DataManager(config);
    this.buildManager = new BuildManager(config);
    this.chatManager = new ChatManager(config);
  }

  /**
   * 创建项目
   */
  async createProject(name: string): Promise<Project> {
    this.emit('project:creating', name);
    const project = await this.projectManager.create(name);
    this.emit('project:created', project);
    return project;
  }

  /**
   * 列出所有项目
   */
  async listProjects(): Promise<Project[]> {
    return this.projectManager.list();
  }

  /**
   * 获取项目信息
   */
  async getProject(projectId: string): Promise<Project> {
    const project = await this.projectManager.get(projectId);
    if (!project) {
      throw new ProjectNotFoundError(projectId);
    }
    return project;
  }

  /**
   * 删除项目
   */
  async deleteProject(projectId: string): Promise<void> {
    this.emit('project:deleting', projectId);
    await this.projectManager.delete(projectId);
    this.emit('project:deleted', projectId);
  }

  /**
   * 添加数据流
   */
  async addData(projectId: string, stream: DataStream): Promise<void> {
    // 验证项目存在
    await this.getProject(projectId);

    // 验证数据流
    this.validateStream(stream);

    this.emit('data:adding', stream);
    await this.dataManager.add(projectId, stream);
    this.emit('data:added', stream);
  }

  /**
   * 批量添加数据流
   */
  async addBulkData(projectId: string, streams: DataStream[]): Promise<void> {
    // 验证项目存在
    await this.getProject(projectId);

    // 验证所有数据流
    streams.forEach(stream => this.validateStream(stream));

    this.emit('data:adding:bulk', streams);
    await this.dataManager.addBulk(projectId, streams);
    this.emit('data:added:bulk', streams);
  }

  /**
   * 验证数据质量
   */
  async validateData(projectId: string): Promise<ValidationResult> {
    // 验证项目存在
    await this.getProject(projectId);

    return this.dataManager.validate(projectId);
  }

  /**
   * 构建克隆体
   */
  async build(projectId: string, options?: BuildOptions): Promise<BuildResult> {
    // 验证项目存在
    await this.getProject(projectId);

    // 验证数据质量
    const validation = await this.validateData(projectId);
    if (validation.score < 30) {
      throw new BuildError('数据质量不足，请添加更多数据', 'validation');
    }

    this.emit('build:started', projectId);

    // 包装进度回调
    const wrappedOptions: BuildOptions = {
      ...options,
      onProgress: (stage: string, progress: number) => {
        this.emit('build:progress', { stage, progress });
        options?.onProgress?.(stage, progress);
      }
    };

    try {
      const result = await this.buildManager.build(projectId, wrappedOptions);
      this.emit('build:completed', result);
      return result;
    } catch (error) {
      this.emit('build:failed', error);
      throw error;
    }
  }

  /**
   * 获取构建状态
   */
  async getBuildStatus(projectId: string, buildId: string): Promise<BuildStatus> {
    return this.buildManager.getStatus(projectId, buildId);
  }

  /**
   * 发送对话消息
   */
  async chat(projectId: string, message: string, version?: string): Promise<ChatResponse> {
    return this.chatManager.send(projectId, message, version);
  }

  /**
   * 获取对话历史
   */
  async getChatHistory(projectId: string): Promise<ChatHistory> {
    return this.chatManager.getHistory(projectId);
  }

  /**
   * 注册事件处理器
   */
  onEvent(event: SoulEvent, handler: EventHandler): this {
    return this.on(event, handler);
  }

  /**
   * 验证数据流
   */
  private validateStream(stream: DataStream): void {
    const validTypes = [
      'diary', 'blog', 'social', 'interview',
      'conversation', 'values', 'thinking', 'professional'
    ];

    if (!validTypes.includes(stream.type)) {
      throw new ValidationError(`无效的数据类型: ${stream.type}`, [
        `有效类型: ${validTypes.join(', ')}`
      ]);
    }

    if (!stream.content || stream.content.trim().length === 0) {
      throw new ValidationError('数据内容不能为空');
    }

    if (stream.content.length < 50) {
      throw new ValidationError('数据内容过短', [
        '建议至少 50 个字符'
      ]);
    }
  }
}
