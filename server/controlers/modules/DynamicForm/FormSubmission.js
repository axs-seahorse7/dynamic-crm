import FormSubmissionSchema from "../../../db/schemas/DynamicFormData/FormSubmissionSchema.js";

export const submitForm = async (req, res) => {
  try {
    const { formId, formKey, createdBy } = req.body;
    const data = JSON.parse(req.body.data || "{}");
    const files = req.files;

    console.log("Received form submission:", { formId, formKey, createdBy, data, files });

     files?.forEach(file => {
      data[file.fieldname] = {
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
      };
    });

    const submission = await FormSubmissionSchema.create({
      formId,
      formKey,
      data,
      createdBy,
    });

    res.json({
      success: true,
      message: "Form submitted successfully",
      submission,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error("Error submitting form:", err.message);
  }
};