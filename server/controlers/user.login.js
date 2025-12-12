import userModel from "../db/schemas/user.schema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

async function userLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password." });
    }
    const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
    const token = jwt.sign(
      { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: "8h" }
    );
    res.status(200).json({
      message: "Login successful",
        user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      token,
      success: true,
    });
  } catch (error) {
    console.error("userLogin error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default userLogin;