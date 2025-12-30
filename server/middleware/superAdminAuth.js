import jwt from "jsonwebtoken";

const superAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.SUPER_ADMIN_JWT_SECRET
    );

    if (decoded.type !== "super-admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.superAdmin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default superAdminAuth;
