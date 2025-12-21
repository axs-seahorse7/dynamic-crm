import { Card } from 'antd';
import { Table, Tag, Space, Button } from 'antd';

const CustomerDashboard = () => {

const columns = [
  {
    title: 'Customer Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Contact',
    dataIndex: 'contact',
    key: 'contact',
  },
  {
    title: 'Company',
    dataIndex: 'company',
    key: 'company',
  },
  {
    title: 'Position',
    dataIndex: 'position',
    key: 'position',
  },
  {
    title: 'Product',
    dataIndex: 'product',
    key: 'product',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      const color =
        status === 'Active'
          ? 'green'
          : status === 'Pending'
          ? 'orange'
          : 'blue';
      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    title: 'Join Date',
    dataIndex: 'joinDate',
    key: 'joinDate',
  },
  {
    title: 'Estimated Date',
    dataIndex: 'estimatedDate',
    key: 'estimatedDate',
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <Space>
        <Button type="link">View</Button>
        <Button type="link">Edit</Button>
      </Space>
    ),
  },
];

const customers = [
  {
    key: '1',
    name: 'Rahul Sharma',
    email: 'rahul@techcorp.com',
    contact: '+91 98765 43210',
    company: 'TechCorp Pvt Ltd',
    position: 'Product Manager',
    product: 'CRM System',
    status: 'Active',
    joinDate: '2024-01-15',
    estimatedDate: '2024-02-10',
  },
  {
    key: '2',
    name: 'Ananya Verma',
    email: 'ananya@finwise.com',
    contact: '+91 91234 56789',
    company: 'FinWise Solutions',
    position: 'HR Lead',
    product: 'HRMS',
    status: 'Pending',
    joinDate: '2024-01-20',
    estimatedDate: '2024-02-25',
  },
  {
    key: '3',
    name: 'Amit Patel',
    email: 'amit@buildex.in',
    contact: '+91 99887 66554',
    company: 'BuildEx Ltd',
    position: 'Operations Head',
    product: 'Inventory Tool',
    status: 'Completed',
    joinDate: '2023-12-10',
    estimatedDate: '2024-01-05',
  },
];


  return (
    <Card
      title="Customer Dashboard"
      style={{ margin: 16 }}
      bordered={false}
    >
      <Table
        columns={columns}
        dataSource={customers}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1200 }}
      />
    </Card>
  );
};

export default CustomerDashboard;
