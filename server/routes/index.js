import express from 'express'
import Form from '../db/schemas/form.schema.js';
import { validateFormPayload } from '../controlers/modules/validator/formValidator.js';
import FormSubmission from '../db/schemas/DynamicFormData/FormSubmissionSchema.js';
import { submitForm } from '../controlers/modules/DynamicForm/FormSubmission.js';
import { upload } from '../Multer/multer.js';
import { getDynamicData } from '../controlers/modules/DynamicForm/getDynamicData.js';
var router = express.Router();

router.get('/ai/prompt', function(req, res, next) {
  res.json({ message: 'Create Element Endpoint' }); 
});

router.post("/form/create", validateFormPayload, async (req, res) => {
    try {
      const path = req.body.name.toLowerCase().replace(/\s+/g, '-');

      const form = new Form(req.body);

      form.path = `/dashboard/${path}/${form._id}`;

      await form.save();
      res.status(201).json({message: "Form created", data: form});
    } catch (err) {
      res.status(500).json({
        message: "Failed to create form",
        error: err.message
      });
      console.log(err.message);
    }
  }
);

router.get("/sidebar/menus", async (req, res) => { 
    try {
      const forms = await Form.find();
      res.status(200).json({
        message: "Forms retrieved successfully",
        forms
      });
    } catch (err) {
      res.status(500).json({
        message: "Failed to retrieve forms",
        error: err.message
      });
      console.log(err.message);
    }
  }
);

router.get("/api/form", async (req, res) => {
  try {
    const { path } = req.query;

    if (!path) {
      return res.status(400).json({ message: "Path is required" });
    }

    const form = await Form.findOne({ path });

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json({
      message: "Form retrieved successfully",
      data: form,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Failed to retrieve form",
      error: err.message,
    });
  }
});

router.post("/api/form/submit", upload.any(), submitForm)
router.get("/api/form-submissions/:formKey", getDynamicData);

export default router;
