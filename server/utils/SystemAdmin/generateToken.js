import jwt from "jsonwebtoken";

const generateToken = (payload) => {
  const secretKey = process.env.JWT_SECRET;
  return jwt.sign(payload, secretKey, {
    expiresIn: "1d",
  });
};

export default generateToken;
