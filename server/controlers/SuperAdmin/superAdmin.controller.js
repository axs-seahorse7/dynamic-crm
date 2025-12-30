import bcrypt from "bcryptjs";
import SuperAdmin from "../../db/models/SystemAdmin/systemAdmin.schema.js";
import generateToken from "../../utils/SystemAdmin/generateToken.js";

export const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
    return res.status(400).json({message: "Email and password are required"});
    }

    const admin = await SuperAdmin.findOne({ email }).select("+password");

    if (!admin) {
    return res.status(401).json({message: "Invalid credentials"});
    }

    if (!admin.isActive) {
    return res.status(403).json({message: "Account is disabled"});
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
    return res.status(401).json({message: "Invalid credentials"});
    }

    const token = generateToken({
    id: admin._id,
    role: admin.role,
    type: "super-admin",
    });

    admin.lastLoginAt = new Date();
    await admin.save();

    res.status(200).json({message: "Login successful",
    admin: {
    id: admin._id,
    username: admin.username,
    email: admin.email,
    role: admin.role,
    },
    token,
    });
  } catch (error) {
    console.error("Super Admin Login Error:", error);
    res.status(500).json({
    message: "Server error",
    });
  }
};
