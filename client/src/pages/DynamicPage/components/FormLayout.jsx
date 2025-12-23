import React from "react";
import { Card, Row, Col, Input, Upload, Typography, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const FormLayout = ({ form }) => {
  if (!form) return null;

  // Convert width keywords to AntD span (12 grid)
  const getColSpan = (layout) => {
    if (layout?.fieldWidthPx) return null; // handled via style
    if (layout?.gridWidth === "full") return 24;
    if (layout?.gridWidth === "1/2") return 12;
    if (layout?.gridWidth === "1/3") return 8;
    if (layout?.gridWidth === "1/4") return 6;
    return layout?.colSpan ? layout.colSpan * 2 : 24;
  };

  const renderField = (field) => {
    const commonProps = {
      placeholder: field.placeholder,
      style: field.layout?.fieldWidthPx
        ? { width: field.layout.fieldWidthPx }
        : { width: "100%" },
    };

    switch (field.type) {
      case "email":
        return <Input type="email" {...commonProps} />;
      case "phone":
        return <Input type="tel" {...commonProps} />;
      case "upload":
        return (
          <Upload>
            <Input
              readOnly
              placeholder="Upload file"
              suffix={<UploadOutlined />}
            />
          </Upload>
        );
      default:
        return <Input {...commonProps} />;
    }
  };

  return (
    <Card
      variant={false}
      style={{
        background: "#fff",
        height: "100%",
        overflowY: "auto",
       
      }}
    >
      {/* HEADER */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          background: "#fff",
          paddingBottom: 12,
          marginBottom: 24,
          borderBottom: "1px solid #f0f0f0",
          display:'flex',
          justifyContent:'space-between'
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          {form.name}
        </Title>
        <Button>Edit Form</Button>
      </div>

      {/* SECTIONS */}
      {form.sections.map((section) => (
        <div key={section._id} style={{ marginBottom: 32 }}>
          <Title level={4}>{section.title}</Title>

          <Row gutter={[section.grid.gap, section.grid.gap]}>
            {section.fields.map((field) => {
              const span = getColSpan(field.layout);

              return (
                <Col
                  key={field._id}
                  span={span || 24}
                  style={
                    field.layout?.fieldWidthPx
                      ? { flex: "none" }
                      : undefined
                  }
                >
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>
                      {field.question}
                      {field.required && (
                        <Text type="danger"> *</Text>
                      )}
                    </Text>
                  </div>

                  {renderField(field)}
                </Col>
              );
            })}
          </Row>
        </div>
      ))}
    </Card>
  );
};

export default FormLayout;
