import * as Icons from 'lucide-react'

const getLucideIcon = (iconName, props = {}) => {
  if (!iconName || typeof iconName !== "string") {
    return <Icons.HelpCircle {...props} />;
  }

  const IconComponent = Icons[iconName];

  if (!IconComponent) {
    console.warn(`Lucide icon not found: ${iconName}`);
    return <Icons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};

export default getLucideIcon;
