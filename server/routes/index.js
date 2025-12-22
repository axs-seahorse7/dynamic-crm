import express from 'express'
import Form from '../db/schemas/form.schema.js';
import { validateFormPayload } from '../controlers/modules/validator/formValidator.js';
var router = express.Router();


router.get('/ai/prompt', function(req, res, next) {
  res.json({ message: 'Create Element Endpoint' }); 
});

router.post("/form/create", validateFormPayload, async (req, res) => {
    try {
      const path = req.body.name.toLowerCase().replace(/\s+/g, '-');
      const form = new Form(req.body);
      form.path = path;
      await form.save();

      res.status(201).json({
        message: "Form created",
        data: form
      });
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


export default router;
