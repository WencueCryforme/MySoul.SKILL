import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      if (status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }

      throw new Error(data.error?.message || '请求失败')
    }

    throw new Error('网络错误')
  }
)

// 类型定义
export interface Project {
  id: string
  name: string
  created_at: string
  updated_at: string
  version: string
  data_streams: number
  total_words: number
  quality_score: number
  status: 'active' | 'archived'
}

export interface DataStream {
  type: string
  content: string
  metadata?: Record<string, any>
}

export interface ValidationResult {
  score: number
  coverage: Record<string, number>
  issues: string[]
  recommendations: string[]
}

export interface BuildResult {
  version: string
  score: number
  output_path: string
  personality: {
    dimensions: { label: string; value: number }[]
    overall_score: number
  }
}

export interface ChatResponse {
  text: string
  confidence: number
  personality_match: number
}

// 项目服务
export const projectService = {
  list: (): Promise<Project[]> => api.get('/projects'),
  get: (id: string): Promise<Project> => api.get(`/projects/${id}`),
  create: (name: string): Promise<Project> => api.post('/projects', { name }),
  delete: (id: string): Promise<void> => api.delete(`/projects/${id}`)
}

// 数据服务
export const dataService = {
  add: (projectId: string, stream: DataStream): Promise<void> =>
    api.post(`/projects/${projectId}/data`, stream),
  validate: (projectId: string): Promise<ValidationResult> =>
    api.post(`/projects/${projectId}/data/validate`)
}

// 构建服务
export const buildService = {
  build: (projectId: string): Promise<BuildResult> =>
    api.post(`/projects/${projectId}/build`),
  status: (projectId: string, buildId: string): Promise<any> =>
    api.get(`/projects/${projectId}/builds/${buildId}`)
}

// 对话服务
export const chatService = {
  send: (projectId: string, message: string): Promise<ChatResponse> =>
    api.post(`/projects/${projectId}/chat`, { message }),
  history: (projectId: string): Promise<any> =>
    api.get(`/projects/${projectId}/chat/history`)
}

export default api
