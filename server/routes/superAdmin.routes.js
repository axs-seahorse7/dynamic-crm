import express from "express";
import { loginSuperAdmin } from "../controlers/SuperAdmin/superAdmin.controller.js";
import companyModel from "../db/schemas/Company/company.schema.js";
import userModel from "../db/schemas/user.schema.js";
import Role from "../db/schemas/Role-Schema/Role.schema.js"
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/login", loginSuperAdmin);

router.post("/company/create", async (req, res) =>{
    try {
        console.log(req.body);
        const {company, admin} = req.body;

        const hashedPassword = await bcrypt.hash(admin.password, 10);
        const newCompany = new companyModel({ 
                name: company.name,
                businessEmail: company.businessEmail,
                businessPhone: company.businessPhone,
                industry: company.industry,
                website: company.website,
                size: company.size,

            });

        const newRole = new Role({
                companyId: newCompany._id,
                name: "admin",
                permissions: [{
                    module: "all",
                    actions: ['*']
                }],
                isSystemRole: true
            });

           const newAdmin = new userModel({
                companyId: newCompany._id,
                name: admin.name,
                email: admin.email,
                password: hashedPassword,
                roleId: newRole._id,
           })

        await newCompany.save();
        await newRole.save();
        await newAdmin.save();
        res.status(201).send({ message: "Company created successfully", company: newCompany });
    } catch (error) {
        res.status(500).send({ message: "Failed to create company", error });
        console.error("Error creating company:", error.message);
    }
})

export default router;
