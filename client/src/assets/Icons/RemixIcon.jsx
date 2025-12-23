const RemixIcon = ({ name, size = 18, margin }) => {
  if (!name) return null;

  return (
    <i
      className={`ri-${name}`}
      style={{ fontSize: size, marginRight: margin, }}
      aria-hidden
    />
  );
};

export default RemixIcon;
