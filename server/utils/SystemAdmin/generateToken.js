import jwt from "jsonwebtoken";

const generateToken = (payload) => {
  const secretKey = "default_secret_key";
  return jwt.sign(payload, secretKey, {
    expiresIn: "1d",
  });
};

export default generateToken;
