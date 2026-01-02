// middlewares/loadUser.js
import User from "../db/schemas/user.schema.js";

export const loadUser = async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Invalid token payload" });
  }

  const user = await User.findById(req.userId).populate("roleId");

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  req.user = user;
  next();
};
