import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import FormLayout from "./components/FormLayout";
import LoaderPage from "../../components/Loading/Loading.jsx";
import {useQuery} from '@tanstack/react-query'
import {useSelector} from 'react-redux';
import NotFound from "../NotFound.jsx";
import DynamicEntityPage from "./components/DynamicEntity.jsx";
import { Button } from "antd";

const DynamicPage = () => {
  const appMenus = useSelector((state) => state.sidebar.apps);
  const mainMenu = useSelector((state) => state.sidebar.menus);
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname; 
  const url = import.meta.env.VITE_API_URI;
  const [isFormSubmissionPageVisible, setisFormSubmissionPageVisible] = useState(false);

  // 1. Normalize the path (ensure it looks like /path)
  const cleanPath = pathname.replace(/\/$/, "") || "/";

  // 2. Identify static paths
  const menuPaths = mainMenu.filter(menu => menu.source === 'static').map(menu => menu.path);
  const appPaths = appMenus.filter(app => app.source === 'static').map(app => app.path);
  const combinedMenus = [...menuPaths, ...appPaths];
  const isStaticPath = combinedMenus.includes(cleanPath);

  const { data, isLoading, isError, status } = useQuery({
    queryKey: ['form', cleanPath],
    queryFn: async () => {
    const res = await axios.get(`${url}/api/form`, {
    params: { path: cleanPath },
    });
    return res.data.data;
    },
    enabled: !isStaticPath && !!cleanPath,
    staleTime: 1000 * 60 * 5,
  });

  const handleToogleFormSubmissionPage = (state) => {
  setisFormSubmissionPageVisible(!isFormSubmissionPageVisible);
  }

  const handleIsFormSubmit = (value) => {
   return value === 'submit' ? true : false;
  }
    
  if (isStaticPath) return null;
  if (isLoading) return <LoaderPage />;
  if ((status === "success" && !data) || isError) return <NotFound />; 
  
  return (
    <div>
      {!isFormSubmissionPageVisible && <DynamicEntityPage label={data.name} handleTooglePage={handleToogleFormSubmissionPage} currentState={isFormSubmissionPageVisible} handleIsFormSubmit={handleIsFormSubmit} />}
      {isFormSubmissionPageVisible && data && <FormLayout form={data} handleTooglePage={handleToogleFormSubmissionPage}  currentState={isFormSubmissionPageVisible} handleIsFormSubmit={handleIsFormSubmit} />}
    </div>
  );
};

export default DynamicPage;

