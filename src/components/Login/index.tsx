import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message, Space, Avatar } from "antd";
import axios from "axios";
import "./login.css";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post("https://fspp-api.onrender.com/api/v1/login", {
        email: values.email,
        password: values.password,
      });
      message.success(response.data.message);
    } catch (error) {
      message.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space className="container-login">
      <Form
        className="container-form_login"
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        {" "}
        <div className="container-logo">
          
        <Avatar
          style={{ padding: 100, alignItems: 'center' }}
          size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
        >
          FSPP
        </Avatar>
        </div>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input placeholder="Email" size="large" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" size="large" />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Form.Item style={{ marginTop: "16px" }}>
          <Button
            className="btn-login"
            htmlType="submit"
            loading={loading}
            size="large"
            block
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default Login;
