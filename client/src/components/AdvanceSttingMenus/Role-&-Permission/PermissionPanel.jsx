import { Collapse, Row, Col, Switch, Typography, Form } from "antd";

const { Panel } = Collapse;
const { Text } = Typography;

const MenuPermissionPanel = ({ menus }) => {
  return (
    <Collapse
      destroyInactivePanel={false}   // 👈 keep state
      defaultActiveKey={[]}
    >
      {menus.map((menu) => (
        <Panel header={menu.label} key={menu.key}>
          {/* VIEW (MASTER SWITCH) */}
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 12 }}
          >
            <Text strong>View</Text>

            <Form.Item
            name={["menuPermissions", menu.key, "view"]}
            valuePropName="checked"
            noStyle
            >
            <Switch
                onChange={(checked) => {
                if (!checked) {
                    ["create", "update", "delete"].forEach((action) => {
                    form.setFieldValue(
                        ["menuPermissions", menu.key, action],
                        false
                    );
                    });
                }
                }}
            />
            </Form.Item>
          </Row>

          {/* CRUD – DEPENDS ON VIEW */}
         <Form.Item
            shouldUpdate={(prev, cur) =>
            prev?.menuPermissions?.[menu.key]?.view !==
            cur?.menuPermissions?.[menu.key]?.view
            }
            noStyle
        >

            {({ getFieldValue }) => {
              const canView =
                getFieldValue(["menuPermissions", menu.key, "view"]);

              return (
                <>
                  {["create", "update", "delete"].map((action) => (
                    <Row
                      key={action}
                      justify="space-between"
                      align="middle"
                      style={{
                        paddingLeft: 24,
                        marginBottom: 8,
                        opacity: canView ? 1 : 0.4,
                      }}
                    >
                      <Text>
                        {action.charAt(0).toUpperCase() + action.slice(1)} Entries
                      </Text>

                      <Form.Item
                        name={[
                          "menuPermissions",
                          menu.key,
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
      ))}
    </Collapse>
  );
};

export default MenuPermissionPanel;
