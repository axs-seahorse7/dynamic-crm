import express from "express";
import { loginSuperAdmin } from "../controlers/SuperAdmin/superAdmin.controller.js";

const router = express.Router();

/**
 * @route   POST /api/super-admin/login
 * @desc    Login CRM Super Admin (Author)
 * @access  Public
 */
router.post("/login", loginSuperAdmin);

export default router;
