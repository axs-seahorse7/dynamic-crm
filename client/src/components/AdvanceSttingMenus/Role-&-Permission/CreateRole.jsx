import {
  Card,
  Form,
  Input,
  Button,
  Collapse,
  Switch,
  Row,
  Typography,
  Divider,
  message,
} from "antd";
import { useSelector } from "react-redux";
import axios from "axios";

const { Panel } = Collapse;
const { Text } = Typography;

const ACTIONS = ["create", "update", "delete"];

const CreateRole = ({ companyId }) => {
  const [form] = Form.useForm();
  const url = import.meta.env.VITE_API_URI;

  // menus (NO duplication)
  const menus = useSelector((s) => s.sidebar.menus || []);
  const apps = useSelector((s) => s.sidebar.apps || []);
  const allMenus = [...menus, ...apps];

  const onFinish = async (values) => {
    try {
      const permissions = [];
      const menuPermissions = values.menuPermissions || {};

      Object.entries(menuPermissions).forEach(([menuKey, perms]) => {
        const actions = [];

        if (perms.view) actions.push("view");
        if (perms.create) actions.push("create");
        if (perms.update) actions.push("update");
        if (perms.delete) actions.push("delete");

        if (actions.length) {
          permissions.push({
            module: "menu",
            menuKey,
            actions,
          });
        }
      });

      await axios.post(`${url}/api/roles`, {
        companyId,
        name: values.name,
        description: values.description,
        permissions,
        isActive: true,
      });

      message.success("Role created successfully");
      form.resetFields();
    } catch (err) {
      message.error("Failed to create role");
    }
  };

  return (
    <Card
      title="Create Role & Permissions"
      style={{ width: "100%", height: "95vh", overflowY: "auto" }}
      className="hide-scrollbar"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 1200 }}
      >
        {/* BASIC INFO */}
        <Form.Item
          label="Role Name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Manager, HR, Sales" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Divider />

        {/* MENU PERMISSIONS */}
        <Collapse destroyInactivePanel={false}>
          {allMenus.map((menu) => {
            const menuKey = menu.key || menu.name || menu.label;

            return (
              <Panel header={menu.label} key={menuKey}>
                {/* VIEW (MASTER) */}
                <Row justify="space-between" align="middle">
                  <Text strong>View</Text>

                  <Form.Item
                    name={["menuPermissions", menuKey, "view"]}
                    valuePropName="checked"
                    noStyle
                  >
                    <Switch
                      onChange={(checked) => {
                        if (!checked) {
                          ["allowAll", ...ACTIONS].forEach((a) =>
                            form.setFieldValue(
                              ["menuPermissions", menuKey, a],
                              false
                            )
                          );
                        }
                      }}
                    />
                  </Form.Item>
                </Row>

                {/* DEPENDENT OPTIONS */}
                <Form.Item
                  shouldUpdate={(prev, cur) =>
                    prev?.menuPermissions?.[menuKey]?.view !==
                    cur?.menuPermissions?.[menuKey]?.view
                  }
                  noStyle
                >
                  {({ getFieldValue }) => {
                    const canView = getFieldValue([
                      "menuPermissions",
                      menuKey,
                      "view",
                    ]);

                    return (
                      <>
                        {/* ALLOW ALL */}
                        <Row
                          justify="space-between"
                          align="middle"
                          style={{
                            paddingLeft: 24,
                            marginTop: 12,
                            opacity: canView ? 1 : 0.4,
                          }}
                        >
                          <Text strong>Allow All</Text>

                          <Form.Item
                            name={[
                              "menuPermissions",
                              menuKey,
                              "allowAll",
                            ]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Switch
                              disabled={!canView}
                              onChange={(checked) => {
                                ACTIONS.forEach((action) => {
                                  form.setFieldValue(
                                    ["menuPermissions", menuKey, action],
                                    checked
                                  );
                                });
                              }}
                            />
                          </Form.Item>
                        </Row>

                        {/* CRUD */}
                        {ACTIONS.map((action) => (
                          <Row
                            key={action}
                            justify="space-between"
                            align="middle"
                            style={{
                              paddingLeft: 48,
                              marginTop: 8,
                              opacity: canView ? 1 : 0.4,
                            }}
                          >
                            <Text>
                              {action.charAt(0).toUpperCase() +
                                action.slice(1)}{" "}
                              Entries
                            </Text>

                            <Form.Item
                              name={[
                                "menuPermissions",
                                menuKey,
                                action,
                              ]}
                              valuePropName="checked"
                              noStyle
                            >
                              <Switch disabled={!canView} />
                            </Form.Item>
                          </Row>
                        ))}
                      </>
                    );
                  }}
                </Form.Item>
              </Panel>
            );
          })}
        </Collapse>

        <Divider />

        <Button type="primary" size="large" htmlType="submit">
          Save Role
        </Button>
      </Form>
    </Card>
  );
};

export default CreateRole;
