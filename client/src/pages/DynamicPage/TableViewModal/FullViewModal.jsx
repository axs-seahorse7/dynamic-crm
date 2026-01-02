import { Modal, Button } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import PeopleTemplate from "../EntityViewTemplate/PeopleModal";
import ItemTemplate from "../EntityViewTemplate/ItemViewTemplate";
import TransactionTemplate from "../EntityViewTemplate/TransactionModal";
import DocumentTemplate from "../EntityViewTemplate/DocumentTemplate";
import LogTemplate from "../EntityViewTemplate/LogTemplate";

const FullViewModal = ({ open, onClose, record }) => {
  if (!record) return null;

  const openInNewTab = () => {
    const url = `/record/${record.formType}/${record._id}`;
    window.open(url, "_blank");
  };

  console.log(record);

  const RecordTemplate = ({ type, data }) => {
    console.log("Rendering template for type:", type, "with data:", data);
  switch (type) {
    case "people":
      return <PeopleTemplate data={data} />;

    case "item":
      return <ItemTemplate data={data} />;

    case "transaction":
      return <TransactionTemplate data={data} />;

    case "document":
      return <DocumentTemplate data={data} />;

    case "log":
      return <LogTemplate data={data} />;

    default:
      return <div>Unknown template</div>;
  }
};


  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="60vw"
      style={{ top: 0, height: "90vh", }}
      styles={{ body: {
        height: "90vh",
        padding: 0,
        overflow: "hidden",
      }}}
      closable={false}
    >
      {/* Header */}
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <strong>{record.formKey || "Details"}</strong>

        <div>
          <Button
            icon={<ExportOutlined />}
            onClick={openInNewTab}
            style={{ marginRight: 8 }}
          >
            Open in new tab
          </Button>

          <Button onClick={onClose}>Close</Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        style={{
          height: "calc(100vh - 65px)",
          overflowY: "auto",
          padding: 24,
        }}
      >
        <RecordTemplate type={record?.formId?.entityIntent} data={record?.data} />
      </div>
    </Modal>
  );
};

export default FullViewModal;
