/**
 * MySoul.SKILL SDK 类型定义
 */

// 配置
export interface SoulConfig {
  name: string;
  dataDir: string;
  outputDir: string;
  apiUrl?: string;
  apiKey?: string;
}

// 数据流类型
export type StreamType =
  | 'diary'
  | 'blog'
  | 'social'
  | 'interview'
  | 'conversation'
  | 'values'
  | 'thinking'
  | 'professional';

// 数据流
export interface DataStream {
  type: StreamType;
  content: string;
  metadata?: Record<string, any>;
}

// 项目
export interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  version: string;
  data_streams: number;
  total_words: number;
  quality_score: number;
  status: 'active' | 'archived';
}

// 验证结果
export interface ValidationResult {
  score: number;
  coverage: Record<string, number>;
  issues: string[];
  recommendations: string[];
}

// 构建选项
export interface BuildOptions {
  model?: string;
  language?: string;
  onProgress?: (stage: string, progress: number) => void;
}

// 构建结果
export interface BuildResult {
  version: string;
  score: number;
  outputPath: string;
  personality: PersonalityModel;
}

// 人格模型
export interface PersonalityModel {
  dimensions: PersonalityDimension[];
  overallScore: number;
}

// 人格维度
export interface PersonalityDimension {
  label: string;
  value: number;
  level: string;
}

// 对话响应
export interface ChatResponse {
  text: string;
  confidence: number;
  personalityMatch: number;
}

// 对话历史
export interface ChatHistory {
  messages: ChatMessage[];
  total: number;
}

// 对话消息
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// 构建状态
export interface BuildStatus {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: {
    total: number;
    current_stage: string;
    stages: {
      id: number;
      label: string;
      progress: number;
    }[];
  };
  estimated_remaining?: string;
  error?: string;
}

// 事件类型
export type SoulEvent =
  | 'data:added'
  | 'data:validated'
  | 'build:started'
  | 'build:progress'
  | 'build:completed'
  | 'build:failed'
  | 'error';

// 事件处理器
export type EventHandler = (...args: any[]) => void;
