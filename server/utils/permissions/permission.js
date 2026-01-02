export const getAllowedMenuKeys = (role) => {
  if (!role) return [];

  if (role.isSystemRole) {
    return "*"; // admin sees all
  }

  return role.permissions
    .filter(
      (p) =>
        p.module === "menu" &&
        p.actions.includes("view")
    )
    .map((p) => p.menuKey);
};
