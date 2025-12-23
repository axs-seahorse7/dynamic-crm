import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import FormLayout from "./components/FormLayout";

const DynamicPage = () => {
  const location = useLocation();
  const pathname = location.pathname; 
  const url = import.meta.env.VITE_API_URI;
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForm(pathname);
  }, [pathname]);

const fetchForm = async (path) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `${url}/api/form`,
      {
        params: {
          path: path,
        },
      }
    );

    setForm(res.data.data);   // 👈 backend returns { data: form }
    console.log("Form PSL -", res.data.data);

  } catch (err) {
    console.error(
      err.response?.data?.message || err.message
    );
  }finally {
    setLoading(false);
  }
};

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!form) return <p>Form not found</p>;

  return (
    <div>
      <FormLayout form={form} />
    </div>
  );
};

export default DynamicPage;
