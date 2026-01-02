import RoleModule  from '../../db/schemas/Role-Schema/Role.schema.js';

export const createRole = async (req, res) => {
  try {
    const role = await RoleModule.create(req.body);
    res.status(201).json(role);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Role with this name already exists",
      });
    }
    res.status(500).json({ message: err.message });
  }
};
