/**
 * 对话管理模块
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { SoulConfig, ChatResponse, ChatHistory, ChatMessage } from './types';

export class ChatManager {
  private config: SoulConfig;

  constructor(config: SoulConfig) {
    this.config = config;
  }

  /**
   * 发送消息
   */
  async send(projectId: string, message: string, version?: string): Promise<ChatResponse> {
    // 加载克隆体
    const clone = await this.loadClone(projectId, version);

    // 生成响应
    const response = this.generateResponse(clone, message);

    // 保存对话历史
    await this.saveMessage(projectId, {
      id: this.generateId(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });

    await this.saveMessage(projectId, {
      id: this.generateId(),
      role: 'assistant',
      content: response.text,
      timestamp: new Date().toISOString()
    });

    return response;
  }

  /**
   * 获取对话历史
   */
  async getHistory(projectId: string): Promise<ChatHistory> {
    const historyPath = path.join(this.config.dataDir, projectId, 'chat-history.json');

    try {
      const content = await fs.readFile(historyPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return { messages: [], total: 0 };
    }
  }

  /**
   * 加载克隆体
   */
  private async loadClone(projectId: string, version?: string): Promise<any> {
    const outputDir = path.join(this.config.outputDir, projectId);

    try {
      const files = await fs.readdir(outputDir);
      const skillFiles = files.filter(f => f.endsWith('.md'));

      if (skillFiles.length === 0) {
        return null;
      }

      // 获取最新版本或指定版本
      const targetFile = version
        ? `v${version}.md`
        : skillFiles[skillFiles.length - 1];

      const content = await fs.readFile(path.join(outputDir, targetFile), 'utf-8');
      return { content, projectId };
    } catch {
      return null;
    }
  }

  /**
   * 生成响应
   */
  private generateResponse(clone: any, message: string): ChatResponse {
    if (!clone) {
      return {
        text: '抱歉，我还没有被构建。请先构建数字克隆体。',
        confidence: 0,
        personalityMatch: 0
      };
    }

    // 简化实现：基于关键词生成响应
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('你好') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
      return {
        text: '你好！我是你的数字克隆体，很高兴和你聊天。',
        confidence: 0.9,
        personalityMatch: 0.85
      };
    }

    if (lowerMessage.includes('你是谁') || lowerMessage.includes('who are you')) {
      return {
        text: '我是基于你的真实数据构建的数字克隆体，代表你的思维方式和表达风格。',
        confidence: 0.85,
        personalityMatch: 0.9
      };
    }

    if (lowerMessage.includes('谢谢') || lowerMessage.includes('thank')) {
      return {
        text: '不客气！如果还有其他问题，随时可以问我。',
        confidence: 0.95,
        personalityMatch: 0.88
      };
    }

    // 默认响应
    return {
      text: `收到你的消息："${message}"。我会根据我的人格特征来回应你。`,
      confidence: 0.7,
      personalityMatch: 0.75
    };
  }

  /**
   * 保存消息
   */
  private async saveMessage(projectId: string, message: ChatMessage): Promise<void> {
    const history = await this.getHistory(projectId);
    history.messages.push(message);
    history.total = history.messages.length;

    const historyPath = path.join(this.config.dataDir, projectId, 'chat-history.json');
    await fs.writeFile(historyPath, JSON.stringify(history, null, 2));
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
