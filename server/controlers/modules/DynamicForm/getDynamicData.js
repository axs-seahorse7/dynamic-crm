import FormSubmissionSchema from "../../../db/schemas/DynamicFormData/FormSubmissionSchema.js";
/**
 * GET all submissions by formKey
 * URL: /api/form-submissions/:formKey
 */
export const getDynamicData = async (req, res) => {
  try {
    const { formKey } = req.params;

    if (!formKey) {
      return res.status(400).json({
        success: false,
        message: "formKey is required",
      });
    }

    const submissions = await FormSubmissionSchema.find({ formKey })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    console.error("Error fetching form submissions:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch form submissions",
    });
  }
};
