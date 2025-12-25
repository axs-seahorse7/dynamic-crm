import React from "react";
import { Card, Input, Typography, Button, Select, Radio, Checkbox, Space, Upload } from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const styles = {
  cardWrapper: { height: "100%", borderRadius: "8px",  },
  cardBody: { height: "100%", padding: "24px", overflowY: "auto" },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingBottom: '16px', marginBottom: '24px', borderBottom: "1px solid #f0f0f0",
    position: "sticky", top: 0, zIndex: 10,
  },
  // Custom Flex Container for the section
  flexContainer: (gap) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: `${gap}px`, // Pulls from section.grid.gap
    width: '100%',
  }),
  // Logic for field item container
  fieldItem: (fieldType) => {
    const isFullWidth = fieldType === 'upload' || fieldType === 'textarea';
    return {
      // If Upload or TextArea, take 100%. Otherwise, take roughly half (minus gap)
      flex: isFullWidth ? '1 1 100%' : '1 1 calc(50% - 20px)', 
      minWidth: '300px', // Forces wrap to bottom when screen gets small
      marginBottom: '16px'
    };
  },
  label: { display: 'block', marginBottom: '8px', fontSize: '14px', color: '#434343' }
};

const FormLayout = ({ form }) => {
  if (!form) return null;

  const renderField = (field) => {
    // Access fieldWidthPx directly from the field
    const commonStyle = field?.fieldWidthPx 
      ? { width: `${field.fieldWidthPx}px`, maxWidth: "100%" } 
      : { width: "100%" };

    switch (field.type) {
      case 'dropdown':
        return (
          <Select 
            placeholder="Choose option" 
            style={commonStyle} 
            options={field.options?.map(opt => ({ label: opt, value: opt }))} 
          />
        );
      case 'radio':
        return (
          <Radio.Group style={commonStyle}>
            <Space direction="vertical">
              {field.options?.map((opt, i) => <Radio key={i} value={opt}>{opt}</Radio>)}
            </Space>
          </Radio.Group>
        );
      case 'checkbox':
        return (
          <Checkbox.Group 
            style={commonStyle} 
            options={field.options?.map(opt => ({ label: opt, value: opt }))} 
          />
        );
      case 'upload':
        return (
          <Upload.Dragger style={commonStyle}>
            <UploadOutlined style={{ fontSize: 24, color: '#1677ff' }} />
            <p className="ant-upload-text">Click or drag to upload</p>
          </Upload.Dragger>
        );
      case 'textarea':
        return <Input.TextArea rows={4} placeholder={field.placeholder} style={commonStyle} />;
      case 'date':
        return <Input type="date" style={commonStyle} />;
      default:
        return <Input type={field.type} placeholder={field.placeholder} style={commonStyle} />;
    }
  };


  return (
    <Card variant={false} style={styles.cardWrapper} styles={{ body: styles.cardBody }}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <Title level={3} style={{ margin: 0 }}>{form.name}</Title>
          <Text type="secondary">Layout Mode: {form.layoutType}</Text>
        </div>
        <Button type="primary" icon={<EditOutlined />}>Edit Form</Button>
      </div>

      {/* SECTIONS */}
      {form.sections.map((section) => (
        <div key={section._id} style={{ width: `${section.width}%`, marginBottom: '40px' }}>
          <Title level={4} style={{ marginBottom: '20px' }}>{section.title}</Title>

          {/* FLEXBOX IMPLEMENTATION */}
          <div style={styles.flexContainer(section.grid?.gap || 16)}>
            {section.fields.map((field) => (
              <div key={field._id} style={styles.fieldItem(field.type)}>
                <label style={styles.label}>
                  <Text strong>{field.question}</Text>
                  {field.required && <Text type="danger"> *</Text>}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </Card>
  );
};

export default FormLayout;