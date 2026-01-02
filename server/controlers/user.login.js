import userModel from "../db/schemas/user.schema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import generateToken from "../utils/SystemAdmin/generateToken.js";

async function userLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email, password );
    if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
    }
    const user = await userModel.findOne({ email }).select("+password").populate(["roleId", "companyId"]);
    if (!user) {
    return res.status(400).json({ error: "Invalid email or password." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid email or password." });
    }
    const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
    const token = generateToken({ userId: user._id });
    res.status(200).json({message: "Login successful",user, token, success: true});
  } catch (error) {
    console.error("userLogin error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default userLogin;