import FormSubmissionSchema from "../../../db/schemas/DynamicFormData/FormSubmissionSchema.js";
/**
 * GET all submissions by formKey
 * URL: /api/form-submissions/:formKey
 */
export const getDynamicData = async (req, res) => {
  try {
    const { formId } = req.params;

    if (!formId) {
      return res.status(400).json({
        success: false,
        message: "formId is required",
      });
    }

    const submissions = await FormSubmissionSchema.find({ formId })
      .sort({ createdAt: -1 }).populate('formId');

    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    console.error("Error fetching form submissions:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch form submissions",
    });
  }
};
