import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Layout,
  Menu,
  notification,
  Row,
  Typography,
  Image,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  SolutionOutlined,
  UnorderedListOutlined,
  PlusOutlined,
  ReadOutlined,
  UsergroupAddOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DollarOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

import { Footer } from "antd/es/layout/layout";
import "./appLayout.css";

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const [sidebarHidden, setSidebarhidden] = useState(window.innerWidth < 768);
  const [contentPadding, setContentPadding] = useState(
    window.innerWidth < 768 ? 8 : 24
  );

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarhidden(false);
        setCollapsed(false);
        setContentPadding(24);
      } else {
        setSidebarhidden(true);
        setCollapsed(true);
        setContentPadding(8);
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggle = () => {
    setSidebarhidden(!sidebarHidden);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const renderMenuItems = () => (
    <>
      <Menu.Item key="1" icon={<UsergroupAddOutlined />}>
        <Link to="/pacientes">Pacientes</Link>
      </Menu.Item>
    </>
  );

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {!sidebarHidden && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ background: "#fff" }}
          breakpoint="lg"
          onBreakpoint={(broken) => {
            setCollapsed(broken);
          }}
        >
          <div
            style={{
              padding: "10px 0 0 0",
              height: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <img
              src={""}
              alt="FSPP"
              style={{
                width: "50%",
                borderRadius: "50%",
                padding: "2px",
              }}
            />
          </div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{
              background: "#fff",
              fontSize: "1.1rem",
              margin: "20px 0",
            }}
          >
            {renderMenuItems()}
          </Menu>
          <div
            style={{
              position: "relative",
              bottom: 0,
              width: "100%",
              borderTop: "1px solid #f0f0f0",
              padding: "10px",
            }}
          >
            <Button block onClick={handleLogout} icon={<LogoutOutlined />}>
              Sair
            </Button>
          </div>
        </Sider>
      )}

      <Layout className="site-layout">
        <Header>
          <div
            style={{
              padding:0,
              color: "#FFF",
            }}
          >
            {React.createElement(
              sidebarHidden ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: toggle,
                style: { fontSize: "24px", marginLeft: 20 },
              }
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></div>
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: contentPadding,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
        <Footer
          style={{
            textAlign: "center",

            height: "8vh",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            color: "#FFFF",
          }}
        ></Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
