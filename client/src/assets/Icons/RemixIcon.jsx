const RemixIcon = ({ name, size = 18, }) => {
  if (!name) return null;

  return (
    <i
      className={`ri-${name}`}
      style={{ fontSize: size,  }}
      aria-hidden
    />
  );
};

export default RemixIcon;
