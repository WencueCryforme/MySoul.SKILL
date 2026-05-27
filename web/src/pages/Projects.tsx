import React, { useEffect, useState } from 'react'
import { Card, Button, List, Tag, Modal, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { PlusOutlined } from '@ant-design/icons'
import { projectService, Project } from '../services/api'

const Projects: React.FC = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const data = await projectService.list()
      setProjects(data)
    } catch (error) {
      message.error('加载项目失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (values: { name: string }) => {
    try {
      await projectService.create(values.name)
      message.success('项目创建成功')
      setModalVisible(false)
      form.resetFields()
      loadProjects()
    } catch (error) {
      message.error('创建项目失败')
    }
  }

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个项目吗？此操作不可恢复。',
      onOk: async () => {
        try {
          await projectService.delete(id)
          message.success('项目已删除')
          loadProjects()
        } catch (error) {
          message.error('删除项目失败')
        }
      }
    })
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>我的项目</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          创建项目
        </Button>
      </div>

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
        dataSource={projects}
        loading={loading}
        renderItem={(project) => (
          <List.Item>
            <Card
              title={project.name}
              hoverable
              onClick={() => navigate(`/projects/${project.id}`)}
              extra={
                <Button
                  type="text"
                  danger
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(project.id)
                  }}
                >
                  删除
                </Button>
              }
            >
              <p>数据流: {project.data_streams}/8</p>
              <p>质量评分: {project.quality_score}/100</p>
              <p>版本: {project.version}</p>
              <Tag color={project.status === 'active' ? 'green' : 'default'}>
                {project.status === 'active' ? '活跃' : '已归档'}
              </Tag>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title="创建项目"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreate} layout="vertical">
          <Form.Item
            name="name"
            label="项目名称"
            rules={[
              { required: true, message: '请输入项目名称' },
              { pattern: /^[a-zA-Z0-9_-]+$/, message: '只能包含字母、数字、下划线和连字符' }
            ]}
          >
            <Input placeholder="输入项目名称" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              创建
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Projects
