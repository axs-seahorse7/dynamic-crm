import { Card, Avatar, Badge } from "antd";
import {
  HeartOutlined,
  EyeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  BookOutlined,
} from "@ant-design/icons";

const HorizontalPostCard = () => {
  return (
    <Card
      style={{
        maxWidth: 800,
        padding: 0,
        // border: "1px solid red",
        boxShadow: "0 2px 2px rgba(0, 0, 0, 0.1)",
      }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ display: "flex", height: 200, overflow: "hidden" }}>
        
        {/* Left Image */}
        <div style={{ width: "45%", overflow: "hidden" }}>
          <img
            src="https://picsum.photos/400/300"
            alt="post"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Right Content */}
        <div
          style={{
            width: "65%",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Top - User Info */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar src="https://i.pravatar.cc/150" />
            <div style={{ marginLeft: 10 }}>
              <div style={{ fontWeight: 600 }}>sonu_dev</div>
              <div style={{ fontSize: 12, color: "#888" }}>2 hr ago</div>
            </div>
          </div>

          {/* Center - Description */}
          <div style={{ margin: "12px 0", color: "#333" }}>
            Building a horizontal post layout using Ant Design 🚀  
            This feels clean and modern.
          </div>

          {/* Bottom Right - Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <div>
                1.2k views
            </div>
            <div className="flex gap-5">

            <MessageOutlined style={{ fontSize: 18 }} />
            <HeartOutlined style={{ fontSize: 18 }} /> 2k
            <BookOutlined style={{ fontSize: 18 }} />
            <ShareAltOutlined style={{ fontSize: 18 }} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HorizontalPostCard;
