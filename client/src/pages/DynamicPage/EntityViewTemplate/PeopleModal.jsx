import { useState } from "react";
import { Card, Row, Col, Typography, Image, Button, Space } from "antd";
import { FileOutlined, EyeOutlined } from "@ant-design/icons";
import FilePreview from "../Image-preview/ImagePreview";

const { Text } = Typography;

const PeopleTemplate = ({ data }) => {
  if (!data || typeof data !== "object") return null;
  const url = import.meta.env.VITE_API_URI
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);

  const formatLabel = (key) => key.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"];

const isImageFile = (file) => {
  const ext = file?.filename?.split(".").pop()?.toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
};


  const renderValue = (value) => {
  if (typeof value === "object" && value?.filename) {
    const isImage = isImageFile(value);

    return (
      <Space orientation="vertical" size={8}>
        {isImage ? (
           <>
      <img
        src={`${url}/${value.path}`}
        alt={value.filename}
        style={{ width: 80, cursor: "pointer" }}
        onClick={() => {
          setFile(value);
          setOpen(true);
        }}
      />

      <FilePreview
        open={open}
        file={file}
        baseUrl={url}
        onClose={() => {
          setOpen(false);
          setFile(null);
        }}
      />
    </>
        ) : (
          <Button
            type="link"
            icon={<EyeOutlined />}
            href={`${url}/${value.path}`}
            target="_blank"
          >
            View Document
          </Button>
        )}
      </Space>
    );
  }

  return String(value ?? "");
};


  return (
    <Card
      variant={false}
      // style={{ background: "#fff" }}
      styles={{ body: { padding: 24 } }}
    >
      <Row gutter={[24, 24]}>
        {Object.entries(data).map(([key, value]) => (
          <Col span={12} key={key}>
            <Space orientation="vertical" size={4} style={{ width: "100%" }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {formatLabel(key)}
              </Text>

              {renderValue(value)}
            </Space>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default PeopleTemplate;
