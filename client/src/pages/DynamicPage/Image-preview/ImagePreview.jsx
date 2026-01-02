import { Modal, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

/** Supported image extensions */
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"];

const isImageFile = (file) => {
  const ext = file?.filename?.split(".").pop()?.toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
};

const FilePreview = ({ file, baseUrl, onClose, width = 900, open }) => {
  if (!file) return null;

  const isImage = isImageFile(file);
  const fileUrl = `${baseUrl}/${file.path}`;

  return (
    <Modal
      open={open}
      footer={null}
      width={width}
      onCancel={onClose}
      destroyOnHidden
      title={
        <div style={{ fontSize: 14, fontWeight: 600 }}>
          {file.filename || "File Preview"}
        </div>
      }
    >
      {isImage ? (
        <img
          src={fileUrl}
          alt={file.filename}
          style={{
            width: "100%",
            maxHeight: "70vh",
            objectFit: "contain",
            background: "#fafafa",
            borderRadius: 6
          }}
        />
      ) : (
        <iframe
          src={fileUrl}
          title="File Preview"
          style={{
            width: "100%",
            height: "70vh",
            border: "none",
            borderRadius: 6
          }}
        />
      )}

      {/* Optional actions */}
      <div style={{ marginTop: 14, textAlign: "right" }}>
        <Button
          type="link"
          icon={<DownloadOutlined />}
          href={fileUrl}
          target="_blank"
        >
          Download
        </Button>
      </div>
    </Modal>
  );
};

export default FilePreview;
