// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

/**
 * Permission flags sub-schema:
 * - keep boolean flags for very frequent checks
 * - keep them optional — main source of truth can be role.scopes
 */
const PermissionFlags = new Schema({
  canCreateLead: { type: Boolean, default: true },
  canEditLead: { type: Boolean, default: true },
  canDeleteLead: { type: Boolean, default: false },
  canManageUsers: { type: Boolean, default: false },
  canViewReports: { type: Boolean, default: true },
  canViewMenu :[{ type: String }]
}, { _id: false });

/**
 * Company passthrough (light) — link to companies collection
 */
const CompanyRef = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: "Company" },
  companyName: String,
  department: String,
  position: String,
  officeLocation: String,
  managerId: { type: Schema.Types.ObjectId, ref: "User" }
}, { _id: false });

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  phone: { type: String, trim: true },
  avatarUrl: { type: String },

  // Auth fields
  passwordHash: { type: String, required: true },

  // Role & permission system
  role: { type: String, default: "employee" }, // simple role name for quick checks
  roleRef: { type: Schema.Types.ObjectId, ref: "Role" }, // optional role document
  permissions: { type: PermissionFlags, default: () => ({}) }, // boolean flags for quick checks
  scopes: [{ type: String }], // flexible string-based permissions, e.g. ['leads:create']

  // Company & job info
  company: { type: CompanyRef, default: () => ({}) },

  // Admin & status
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  lastLogin: { type: Date },

  // Generic metadata for imported fields / third-party ids
  meta: { type: Schema.Types.Mixed, default: {} },

  // audit
  createdBy: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

/**
 * Text index to support searching
 */
UserSchema.index({ name: "text", email: "text" });

/**
 * Hash password when passwordHash is new or modified
 * NOTE: In many flows you would accept a plain `password` then hash and set `passwordHash`.
 * This implementation hashes when passwordHash changes (adapt to your flow).
 */
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("passwordHash")) {
    const saltRounds = Number(process.env.BCRYPT_ROUNDS) || 10;
    user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds);
  }
  next();
});

/**
 * Instance helpers
 */
UserSchema.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

/**
 * hasPermission: checks in this order:
 * 1) explicit flags in user.permissions
 * 2) scopes array on user
 * 3) roleRef -> role.scopes (if populated)
 * 4) fallback to role name === 'admin' (superuser)
 */
UserSchema.methods.hasPermission = function (permissionKey) {
  // 1) boolean flags (e.g. 'canEditLead')
  if (this.permissions && typeof this.permissions[permissionKey] !== "undefined") {
    if (this.permissions[permissionKey] === true) return true;
  }

  // 2) user scopes
  if (Array.isArray(this.scopes) && this.scopes.includes(permissionKey)) return true;

  // 3) roleRef scopes (if the roleRef has been populated)
  if (this.roleRef && this.roleRef.scopes && Array.isArray(this.roleRef.scopes)) {
    if (this.roleRef.scopes.includes(permissionKey)) return true;
  }

  // 4) admin shortcut
  if (this.role === "admin") return true;

  return false;
};

export default mongoose.model("Employee", UserSchema);
