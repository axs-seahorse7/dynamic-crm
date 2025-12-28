import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const fetchSubmissionsByFormKey = async (formKey) => {
  const response = await axios.get(
    `${API_BASE}/api/form-submissions/${formKey}`
  );
  return response.data;
};
