const LogTemplate = ({ data }) => (
  <div>
    {data.logs?.map((log, i) => (
      <div key={i} style={{ marginBottom: 12 }}>
        <b>{log.action}</b>
        <div>{log.timestamp}</div>
      </div>
    ))}
  </div>
);
export default LogTemplate;