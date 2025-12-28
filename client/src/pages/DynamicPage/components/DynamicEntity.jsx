import React, { useEffect, useState } from "react";
import { Button, Spin, Result, Table, Modal , ConfigProvider } from "antd";
import axios from "axios";

const DynamicEntityPage = ({ label, handleTooglePage, currentState }) => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const pathlabel = window.location.pathname.split("/").pop();
  const [state, setState] = useState(currentState);  
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const url = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const loadData = async (formKey) => {
    try {
      setLoading(true);
      const response = await axios.get(
      `${url}/api/form-submissions/${formKey}`
      );
      setRecords(response.data.data || []);
      console.log("Fetched records:", response.data.data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const isFileObject = (value) => {
  return (
    value &&
    typeof value === "object" &&
    value.path &&
    value.mimetype
  );
};

  useEffect(() => {
    if (!label) return;
    loadData(label);
  }, [label]);

  const generateColumns = () => {
  if (!records.length) return [];

  const dataColumns = Object.keys(records[0].data).map((key) => ({
    title: key
      .replaceAll("-", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    dataIndex: key,
    key,
    render: (value) => {
      // 📁 File field
      if (isFileObject(value)) {
        return (
        <Button
          type="link"
          onClick={() => {
          setPreviewFile(value);
          setPreviewOpen(true);
          }}
        >
        View File
        </Button>
        );
      }
      if (Array.isArray(value)) {
      return value.join(", ");
      }
      return value ?? "-";
    },
  }));

  // ⚡ Actions column
  const actionColumn = {
    title: "Actions",
    key: "actions",
    fixed: "right",
    render: (_, record) => (
      <div style={{ display: "flex", gap: 2, borderLeft: "1px solid #f0f0f0", paddingLeft: 8 }}>
        <button className="h-8 w-8 text-lg rounded-full hover:bg-gray-300 cursor-pointer text-cyan-600" ><i class="ri-eye-line"></i></button> 
        <button className="h-8 w-8 text-lg rounded-full hover:bg-gray-300 cursor-pointer text-emerald-600" ><i class="ri-pencil-fill"></i></button>
        <button className="h-8 w-8 text-lg rounded-full hover:bg-gray-300 cursor-pointer text-red-600" ><i class="ri-delete-bin-line"></i></button>
      </div>
    ),
  };

  return [...dataColumns, actionColumn];
};


  const normalizeData = () =>
    Array.isArray(records) && records.map((item) => ({
    key: item._id,
    ...item.data,
    }));

  const handleTooglePageClick = () => {
      handleTooglePage(!state);
  };


  return (
    <div style={{ height: "calc(100vh - 68px)", display: "flex", flexDirection: "column" }}>
      <div
      style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 16,
      padding: "30px 24px",
      borderBottom: "1px solid #f0f0f0",
      }}
      >
      <p className="text-cyan-600 text-2xl tracking-wider">{label}</p>
      <Button onClick={() => handleTooglePageClick()} type="primary">+ Create {label}</Button>
      </div>

      <div className=" h-full w-full overflow-x-scroll" style={{scrollbarWidth:"thin"}}>

      {loading ? (
        <div style={{ width: "100%", height: "70vh", display: "flex", justifyContent: "center", alignItems: "center", }}>
          <Spin size="large" />
        </div>
      ) : records.length === 0 ? (
       <Table
        columns={generateColumns() || []}
        dataSource={[]}
        pagination={false}
        locale={{
        emptyText: (
        <div style={{ padding: "40px 0", textAlign: "center" }}>
        <h3 style={{ marginBottom: 8 }}>No data created</h3>
        <p style={{ color: "#999", marginBottom: 16 }}>
        Create your first {label?.toLowerCase()} to see it here.
        </p>
        </div>
        ),
        }}
      />

      ) : (
        <ConfigProvider
          theme={{
          components: {
          Table: {
            fontSize: 12,
            cellPaddingBlock: 6,
            cellPaddingInline: 24,
          },
          },
          }}
        >
        <Table
          columns={generateColumns()}
          dataSource={normalizeData()}
          pagination={{ pageSize: 10 }}
        />
        </ConfigProvider>
      )}

      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => {
          setPreviewOpen(false);
          setPreviewFile(null);
        }}
        width={800}
      >
        {previewFile?.mimetype?.startsWith("image") ? (
          <img
            src={`${url}/${previewFile.path}`}
            alt={previewFile?.filename}
            style={{ width: "100%" }}
          />
        ) : (
          <iframe
            src={`${url}/${previewFile?.path}`}
            title="Document Preview"
            style={{ width: "100%", height: "70vh", border: "none" }}
          />
        )}
      </Modal>
      </div>


    </div>
  );
};

export default DynamicEntityPage;
