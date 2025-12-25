import React from 'react';
import { Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

const LoaderPage = ({ message = "Loading content..." }) => {
  // Custom icon for the spinner
  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <Spin indicator={antIcon} />
        <div style={{ marginTop: '20px' }}>
          <Text strong style={{ color: '#1677ff', fontSize: '16px' }}>
            {message}
          </Text>
        </div>
      </div>
    </div>
  );
};

// Styles to make it take up the whole screen
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  position: 'fixed',
  top: 0,
  left: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slight transparency
  zIndex: 9999, // Ensure it stays on top
};

const contentStyle = {
  textAlign: 'center',
};

export default LoaderPage;