import { Form, Input, Button, Select, Card, Row, Col, message } from "antd";
import { useState } from "react";
import axios from "axios";

const { Option } = Select;

const CreateCompany = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const url = import.meta.env.VITE_API_URI;

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      await axios.post(url+"/api/company/create", {
        company: {
          name: values.companyName,
          businessEmail: values.businessEmail,
          businessPhone: values.businessPhone,
          industry: values.industry,
        },
        admin: {
          name: values.adminName,
          email: values.adminEmail,
          password: values.adminPassword,
        },
      });

      message.success("Company created successfully 🎉");
      form.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Create Company"
      bordered={false}
      style={{ maxWidth: 900, margin: "auto" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {/* COMPANY DETAILS */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Company Name"
              name="companyName"
              rules={[{ required: true, message: "Company name is required" }]}
            >
              <Input placeholder="Acme Pvt Ltd" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Business Email"
              name="businessEmail"
              rules={[{ type: "email" }]}
            >
              <Input placeholder="info@company.com" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Business Phone" name="businessPhone">
              <Input placeholder="+91 9876543210" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Industry" name="industry">
              <Select placeholder="Select industry">
                <Option value="IT">IT</Option>
                <Option value="Finance">Finance</Option>
                <Option value="Real Estate">Real Estate</Option>
                <Option value="Education">Education</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* ADMIN DETAILS */}
        <Card
          type="inner"
          title="Admin User Details"
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Admin Name"
                name="adminName"
                rules={[{ required: true, message: "Admin name is required" }]}
              >
                <Input placeholder="John Doe" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Admin Email"
                name="adminEmail"
                rules={[
                  { required: true },
                  { type: "email", message: "Enter valid email" },
                ]}
              >
                <Input placeholder="admin@company.com" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Admin Password"
                name="adminPassword"
                rules={[{ required: true, min: 6 }]}
              >
                <Input.Password placeholder="Minimum 6 characters" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* SUBMIT */}
        <Form.Item style={{ marginTop: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            Create Company
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateCompany;
