import React from 'react'
import { Layout as AntLayout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  HomeOutlined,
  ProjectOutlined,
  SettingOutlined
} from '@ant-design/icons'

const { Header, Content, Sider } = AntLayout

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页'
    },
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: '项目'
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '设置'
    }
  ]

  const handleMenuClick = (info: { key: string }) => {
    navigate(info.key)
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
            MySoul.SKILL
          </h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <AntLayout>
        <Header style={{
          background: 'white',
          padding: '0 24px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div />
          <div>
            <span style={{ marginRight: 16 }}>文档</span>
            <span>GitHub</span>
          </div>
        </Header>
        <Content style={{ padding: 24 }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout
