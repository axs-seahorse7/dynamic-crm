// controllers/employeeController.js
import User from "../../../db/schemas/employee.schema.js";
import { validationResult } from "express-validator";

/**
 * POST /new/employee
 * Creates a new employee/user
 */
export const createEmployee = async (req, res) => {
  // Validate request inputs (provided by express-validator middleware)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      email,
      contact,
      password,
      role,
      address,
      salary,
      shift,
      company,
      permission,
      avatar
    } = req.body;

    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    // Create employee
    const newEmployee = await User.create({
      name,
      email,
      contact,
      passwordHash: password, // Will be hashed automatically by pre-save hook
      role: role || "employee",
      address,
      salary,
      shift,
      company,
      permission,
      avatar,
      createdBy: req.user?._id // Who created this employee
    });

    // Success response (do not return passwordHash)
    return res.status(201).json({
      message: "Employee created successfully.",
      employee: {
        id: newEmployee._id,
        name: newEmployee.name,
        email: newEmployee.email,
        role: newEmployee.role,
        company: newEmployee.company
      }
    });
  } catch (error) {
    console.error("Create Employee Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
