import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Row, Col, Statistic, Button, Space, message } from 'antd'
import { projectService, Project } from '../services/api'

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      loadProject(id)
    }
  }, [id])

  const loadProject = async (projectId: string) => {
    setLoading(true)
    try {
      const data = await projectService.get(projectId)
      setProject(data)
    } catch (error) {
      message.error('加载项目失败')
    } finally {
      setLoading(false)
    }
  }

  if (loading || !project) {
    return <div>加载中...</div>
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>{project.name}</h2>
        <Space>
          <Button>添加数据</Button>
          <Button>验证数据</Button>
          <Button type="primary">构建</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="质量评分"
              value={project.quality_score}
              suffix="/100"
              valueStyle={{ color: project.quality_score >= 70 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="数据流" value={project.data_streams} suffix="/8" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="版本" value={project.version} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="人格雷达图">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#999' }}>构建后显示</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="数据覆盖度">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#999' }}>添加数据后显示</p>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="项目信息" style={{ marginTop: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <p><strong>项目 ID:</strong> {project.id}</p>
            <p><strong>创建时间:</strong> {project.created_at}</p>
          </Col>
          <Col xs={24} sm={12}>
            <p><strong>最后更新:</strong> {project.updated_at}</p>
            <p><strong>总字数:</strong> {project.total_words}</p>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default ProjectDetail
