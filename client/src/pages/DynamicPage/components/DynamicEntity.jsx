import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Spin,
  Table,
  Modal,
  Checkbox,
  ConfigProvider
} from "antd";
import axios from "axios";
import {
  DndContext,
  closestCenter
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* =========================
   Sortable Row (Modal)
========================= */
const SortableItem = ({ column }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: column.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "8px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    marginBottom: 8,
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "grab"
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <span>☰ {column.title}</span>
      <Checkbox checked={column.visible} />
    </div>
  );
};

/* =========================
   Main Page
========================= */

const DynamicEntityPage = ({ label, handleTooglePage, currentState }) => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [columnsConfig, setColumnsConfig] = useState([]);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [tempColumns, setTempColumns] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  // console.log("DynamicEntityPage records:", records);

  const url = import.meta.env.VITE_API_URL || "http://localhost:3000";

  /* =========================
     Helpers
  ========================= */

  const isFileObject = (value) =>
    value &&
    typeof value === "object" &&
    value.path &&
    value.mimetype;

  const buildColumnsFromData = (dataObj) =>
    Object.keys(dataObj).map((key, index) => ({
      key,
      dataIndex: key,
      title: key
        .replaceAll("-", " ")
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      visible: true,
      order: index
    }));

  /* =========================
     Fetch Data
  ========================= */

  const loadData = async (formKey) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${url}/api/form-submissions/${formKey}`
      );
      setRecords(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (label) loadData(label);
  }, [label]);

  /* =========================
     Init Columns
  ========================= */

  useEffect(() => {
    if (!records.length) return;

    const serverSchema = buildColumnsFromData(records[0].data);
    const saved = localStorage.getItem("table-columns"+records[0]._id);
    const savedSchema = saved ? JSON.parse(saved) : [];

    const map = new Map(savedSchema.map((c) => [c.key, c]));

    const merged = serverSchema.map((c) =>
      map.has(c.key) ? { ...c, ...map.get(c.key) } : c
    );

    setColumnsConfig(merged);
  }, [records]);

  useEffect(() => {
    if (columnsConfig.length) {
      localStorage.setItem(
        "table-columns",
        JSON.stringify(columnsConfig)
      );
    }
  }, [columnsConfig]);

  /* =========================
     Modal Drag Logic
  ========================= */

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTempColumns((prev) => {
      const oldIndex = prev.findIndex((c) => c.key === active.id);
      const newIndex = prev.findIndex((c) => c.key === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const openLayoutModal = () => {
    setTempColumns([...columnsConfig]);
    setLayoutOpen(true);
  };

  const saveLayout = () => {
    const updated = tempColumns.map((c, index) => ({
      ...c,
      order: index
    }));
    setColumnsConfig(updated);
    setLayoutOpen(false);
  };

  /* =========================
     Table Columns
  ========================= */

  const tableColumns = useMemo(() => {
    const cols = columnsConfig
      .filter((c) => c.visible)
      .sort((a, b) => a.order - b.order)
      .map((col) => ({
        title: col.title,
        dataIndex: col.dataIndex,
        key: col.key,
        render: (value) => {
          if (value && typeof value === "object" &&
          value.path &&value.mimetype
        ) {
          return (
          <Button
            type="link"
            size="small"
            onClick={() => {
            setPreviewFile(value);
            setPreviewOpen(true);
            }}
            >
            View File
            </Button>
          );
        }
        return value ?? "-";
        }

      }));

    cols.push({
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: () => (
        <div style={{ display: "flex", gap: 8 }}>
          <i className="ri-eye-line text-cyan-600" />
          <i className="ri-pencil-fill text-emerald-600" />
          <i className="ri-delete-bin-line text-red-600" />
        </div>
      )
    });

    return cols;
  }, [columnsConfig]);

  const dataSource = records.map((r) => ({
    key: r._id,
    ...r.data
  }));

 
  console.log("DynamicEntityPage records:", records);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #eee"
        }}
      >
        <h2>{label}</h2>

        <div style={{ display: "flex", gap: 8 }}>
          <Button
            size="small"
            type="primary"
            onClick={() => handleTooglePage(!currentState)}
          >
            + Create {label}
          </Button>
          <Button size="small" onClick={openLayoutModal}>
            <i className="ri-equalizer-3-fill text-xl text-emerald-600"></i>
          </Button>
        </div>
      </div>

      {/* Table */}
      <ConfigProvider
        theme={{
          components: {
            Table: {
              fontSize: 12,
              cellPaddingBlock: 6
            }
          }
        }}
      >
        <Table
          loading={loading}
          columns={tableColumns}
          dataSource={dataSource}
          size="small"
          pagination={{ pageSize: 10 }}
        />
      </ConfigProvider>

      {/* Adjust Layout Modal */}
      <Modal
        title="Adjust Table Layout"
        open={layoutOpen}
        onCancel={() => setLayoutOpen(false)}
        onOk={saveLayout}
        okText="Save Layout"
      >
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tempColumns.map((c) => c.key)}
            strategy={verticalListSortingStrategy}
          >
            {tempColumns.map((col) => (
              <div key={col.key}>
                <SortableItem
                  column={col}
                />
                <Checkbox
                  checked={col.visible}
                  onChange={(e) =>
                    setTempColumns((prev) =>
                      prev.map((c) =>
                        c.key === col.key
                          ? { ...c, visible: e.target.checked }
                          : c
                      )
                    )
                  }
                >
                  Show
                </Checkbox>
              </div>
            ))}
          </SortableContext>
        </DndContext>
      </Modal>

      <Modal
      open={previewOpen}
      footer={null}
      width={900}
      onCancel={() => {
        setPreviewOpen(false);
        setPreviewFile(null);
      }}
      title={
        <div style={{ fontSize: 14, fontWeight: 600 }}>
          {previewFile?.filename || "File Preview"}
        </div>
      }
    >
      {previewFile?.mimetype?.startsWith("image") ? (
        <img
          src={`${url}/${previewFile.path}`}
          alt={previewFile?.filename}
          style={{
            width: "100%",
            maxHeight: "70vh",
            objectFit: "contain"
          }}
        />
      ) : (
        <iframe
          src={`${url}/${previewFile?.path}`}
          title="File Preview"
          style={{
            width: "100%",
            height: "70vh",
            border: "none"
          }}
        />
      )}
    </Modal>

    </div>
  );
};

export default DynamicEntityPage;
