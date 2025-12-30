import { Modal, Card } from "antd";
import { useState } from "react";

const SelectEntityIntentModal = ({ open, onConfirm }) => {
  const [selected, setSelected] = useState(null);
  const ENTITY_INTENTS = [
  {
    key: "people",
    title: "People / Organization",
    icon: "ri-user-3-line",
    description: "Customers, employees, vendors, partners"
  },
  {
    key: "item",
    title: "Item / Product",
    icon: "ri-box-3-line",
    description: "Products, services, assets, plans"
  },
  {
    key: "transaction",
    title: "Transaction / Activity",
    icon: "ri-repeat-line",
    description: "Orders, tickets, visits, payments"
  },
  {
    key: "document",
    title: "Document / Billing",
    icon: "ri-file-list-3-line",
    description: "Invoices, bills, contracts"
  },
  {
    key: "log",
    title: "Log / Timeline",
    icon: "ri-time-line",
    description: "History, audits, tracking logs"
  }
];


  return (
    <Modal
      open={open}
      title="What kind of form do you want to create?"
      footer={null}
      closable={false}
      width={720}
    >
      <p style={{ marginBottom: 16, color: "#666" }}>
       Selecting the right form type helps us tailor the experience to your needs.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16
        }}
      >
        {ENTITY_INTENTS.map((item) => (
          <Card
            key={item.key}
            hoverable
            onClick={() => setSelected(item.key)}
            style={{
              border:
                selected === item.key
                  ? "2px solid #1677ff"
                  : "1px solid #f0f0f0",
              cursor: "pointer"
            }}
          >
            <div style={{ display: "flex", gap: 12 }}>
              <i
                className={`${item.icon}`}
                style={{ fontSize: 22, color: "#1677ff" }}
              />
              <div>
                <h4 style={{ marginBottom: 4 }}>{item.title}</h4>
                <p style={{ fontSize: 12, color: "#666" }}>
                  {item.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 24
        }}
      >
        <button
          disabled={!selected}
          className={`px-4 py-2 rounded ${
            selected
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          onClick={() => onConfirm(selected)}
        >
          Continue
        </button>
      </div>
    </Modal>
  );
};

export default SelectEntityIntentModal;
