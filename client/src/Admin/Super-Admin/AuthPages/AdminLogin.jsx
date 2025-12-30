import { Card, Form, Input, Button, message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../store/superAdminAuthSlice";
import { useNavigate } from "react-router-dom";

const SuperAdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_ADMIN_API_URI;

  const onFinish = async (values) => {
    try {
      const res = await axios.post(`${url}/login`, values);
      dispatch(
        loginSuccess({
          admin: res.data.admin,
          token: res.data.token,
        })
      );
      localStorage.setItem("superAdminToken", res.data.token);
      message.success("Welcome Author 👑");
      navigate("/admin/dashboard");
    } catch (err) {
      message.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card title="CRM Super Admin Login" style={{ width: 380 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input placeholder="superautheradmin@gmail.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Login as Author
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default SuperAdminLogin;
