import React from 'react'
import { Card, Row, Col, Button, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  ProjectOutlined,
  PlusOutlined,
  RocketOutlined
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

const Home: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="page-container">
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <Title level={1}>MySoul.SKILL</Title>
        <Paragraph style={{ fontSize: 18, color: '#666' }}>
          构建你的数字克隆体
        </Paragraph>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate('/projects')}
        >
          开始创建
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <Card hoverable onClick={() => navigate('/projects')}>
            <ProjectOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
            <Card.Meta
              title="项目管理"
              description="创建和管理你的数字克隆体项目"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <RocketOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
            <Card.Meta
              title="快速构建"
              description="一键构建你的数字克隆体"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <ProjectOutlined style={{ fontSize: 48, color: '#722ed1', marginBottom: 16 }} />
            <Card.Meta
              title="人格可视化"
              description="查看人格特征雷达图"
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 48 }}>
        <Title level={2}>快速开始</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card>
              <Title level={4}>1. 创建项目</Title>
              <Paragraph>
                创建一个新的数字克隆体项目，设置项目名称和参数。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Title level={4}>2. 添加数据</Title>
              <Paragraph>
                添加各种类型的数据流，如日记、对话、价值观等。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Title level={4}>3. 构建克隆体</Title>
              <Paragraph>
                一键构建你的数字克隆体，生成完整的 SKILL 文件。
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Home
