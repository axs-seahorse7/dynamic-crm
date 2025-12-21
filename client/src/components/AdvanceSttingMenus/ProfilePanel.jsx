import { useState } from 'react';
import {
  Card,
  Avatar,
  Button,
  Form,
  Input,
  Upload,
  Row,
  Col,
  Typography,
  Divider
} from 'antd';
import {
    BgColorsOutlined,
  EditOutlined,
  SaveOutlined,
  UploadOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ProfilePanel() {
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();

  const profile = {
    name: 'Sonu Kumar',
    email: 'sonu@example.com',
    phone: '+91 98765 43210',
    company: 'Zentro Tech',
    position: 'Software Engineer',
    location: 'Delhi, India',
  };

  return (
    <Card
      style={{ width: 600, }}
      bodyStyle={{ padding: 24 }}
    >
        <Row gutter={16} align="middle">
            <Col>
                <Avatar size={100} src="./images/profile.jpg" />
            </Col>
            <Col>
                <Title level={4}>{profile.name}</Title>
                <Text type="secondary">{profile.position} at {profile.company}</Text>
            </Col>
        </Row>
        <Row justify={"end"} style={{ marginTop: 16 }}>
            <Button style={{backgroundColor:'blue', color:'white'}} icon={<EditOutlined />}>Edit Profile</Button>
        </Row>
        <Divider/>
        <Row>
        <Col span={24} style={{ marginTop: 24 }}> this is
        </Col>
        </Row>

    </Card>
  );
}
