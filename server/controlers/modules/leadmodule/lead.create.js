import { body, validationResult } from "express-validator";
import Lead from '../../../db/models/leads.schema.js';

// body("name").notEmpty().withMessage("Name required"),
//   body("email").optional().isEmail().withMessage("Invalid email"),

async function leadCreate(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const lead = await Lead.create({
        ...req.body,
        // createdBy: req.user.id,
      });
      res.status(201).json(lead);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
    // async (req, res) => {
    // };
}

export default leadCreate;
