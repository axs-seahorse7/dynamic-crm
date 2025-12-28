import {React, useState, useEffect} from "react";
import { Card, Input, Typography, Button, Select, Radio, Checkbox, Space, Upload, message, } from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";

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
    flex: isFullWidth ? '1 1 100%' : '1 1 calc(50% - 20px)', 
    minWidth: '300px',
    marginBottom: '16px'
    };
  },
  label: { display: 'block', marginBottom: '8px', fontSize: '14px', color: '#434343' }
};

const FormLayout = ({ form }) => {
  if (!form) return null;
  const [formData, setFormData] = useState({});
  const url = import.meta.env.VITE_API_URI;

  useEffect(() => {
  if (!form?.fields) return;

  const initialState = {};
  form.fields.forEach(field => {
    initialState[field.name] = "";
  });

  setFormData(initialState);
}, [form]);

const handleChange = (name, value) => {
  setFormData(prev => ({
    ...prev,
    [name]: value,
  }));
};

const user = JSON.parse(localStorage.getItem('user'));
console.log("Logged user:", user);

const handleSubmit = async () => {
  try {
    const formDataToSend = new FormData();

    formDataToSend.append("formId", form._id);
    formDataToSend.append("formKey", form.name);
    formDataToSend.append("data", JSON.stringify(formData));
    formDataToSend.append("createdBy", user._id)

    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        formDataToSend.append(key, value);
      }
    });

    const res = await axios.post(`${url}/api/form/submit`,formDataToSend);

    message.success(res.data.message);
    setFormData({});

  } catch (err) {
    message.error(err.response?.data?.error || "Submission failed");
  }
};



function slugify(text) {
  return text
    .replace(/\s+/g, "-")      // replace spaces with -
    .replace(/\(.*?\)/g, "")   // remove (something)
    .replace(/-+/g, "-")       // cleanup extra dashes
    .toLowerCase()
    .trim();
}


const renderField = (field) => {
  const commonStyle = field?.fieldWidthPx
    ? { width: `${field.fieldWidthPx}px`, maxWidth: "100%" }
    : { width: "100%" };

  switch (field.type) {

    case "dropdown":
      return (
        <Select
          style={commonStyle}
          placeholder={field.placeholder || "Select"}
          options={field.options?.map(opt => ({
            label: opt,
            value: opt,
          }))}
          value={formData[slugify(field.question)]}
          onChange={(value) => handleChange(slugify(field.question), value)}
        />
      );

    case "radio":
      return (
        <Radio.Group
          style={commonStyle}
          value={formData[slugify(field.question)]}
          onChange={(e) => handleChange(slugify(field.question), e.target.value)}
        >
          <Space orientation="horizontal">
            {field.options?.map((opt, i) => (
              <Radio key={i} value={opt}>{opt}</Radio>
            ))}
          </Space>
        </Radio.Group>
      );

    case "checkbox":
      return (
        <Checkbox.Group
          style={commonStyle}
          options={field.options?.map(opt => ({
            label: opt,
            value: opt,
          }))}
          value={formData[slugify(field.question)] || []}
          onChange={(values) => handleChange(slugify(field.question), values)}
        />
      );

     case 'upload':
        return (
          <Upload.Dragger
            style={commonStyle}
            multiple={false}
            beforeUpload={(file) => {
              handleChange(slugify(field.question), file); 
              return false; 
            }}
            fileList={formData[slugify(field.question)] ? [formData[slugify(field.question)]] : []}
          >
            <UploadOutlined style={{ fontSize: 24, color: '#1677ff' }} />
            <p className="ant-upload-text">Click or drag to upload</p>
          </Upload.Dragger>
        );


    case "textarea":
      return (
        <Input.TextArea
          rows={4}
          placeholder={field.placeholder}
          value={formData[slugify(field.question)]}
          onChange={(e) => handleChange(slugify(field.question), e.target.value)}
          style={commonStyle}
        />
      );

    case "date":
      return (
        <Input
          type="date"
          value={formData[slugify(field.question)]}
          onChange={(e) => handleChange(slugify(field.question), e.target.value)}
          style={commonStyle}
        />
      );

    default:
      return (
        <Input
          type={field.type || "text"}
          placeholder={field.placeholder}
          value={formData[slugify(field.question)]}
          onChange={(e) => handleChange(slugify(field.question), e.target.value)}
          style={commonStyle}
        />
      );
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
      <Button type="primary" onClick={handleSubmit}>Submit</Button>
    </Card>
  ); 
};

export default FormLayout;