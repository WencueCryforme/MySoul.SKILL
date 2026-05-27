/**
 * MySoul.SKILL SDK 错误定义
 */

export class MySoulError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MySoulError';
  }
}

export class ValidationError extends MySoulError {
  public issues: string[];

  constructor(message: string, issues: string[] = []) {
    super(message);
    this.name = 'ValidationError';
    this.issues = issues;
  }
}

export class BuildError extends MySoulError {
  public stage: string;

  constructor(message: string, stage: string = '') {
    super(message);
    this.name = 'BuildError';
    this.stage = stage;
  }
}

export class ProjectNotFoundError extends MySoulError {
  constructor(projectId: string) {
    super(`项目不存在: ${projectId}`);
    this.name = 'ProjectNotFoundError';
  }
}

export class DataStreamError extends MySoulError {
  constructor(message: string) {
    super(message);
    this.name = 'DataStreamError';
  }
}

export class ApiError extends MySoulError {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}
