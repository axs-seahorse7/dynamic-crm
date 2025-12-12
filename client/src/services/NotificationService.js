// src/services/notificationService.js
// import axios from "../utils/axiosInstance"; 

const url = import.meta.env.VITE_API_URI || "";

import axios from "axios";

// const data = {
//     title: "New Notification",
//     body: "You have a new notification.",
//     link: "/notifications",
//     type: "info",
//     meta: { someKey: "someValue" },
// }

export const fetchNotifications = (params) => axios.get(url + "/api/notifications", { params });
export const postMarkRead = (id) => axios.post(url+`/api/notifications/mark-read/${id}`);
export const postMarkAllRead = () => axios.post(url + `/api/notifications/mark-all-read`);
export const deleteNotificationApi = (id) => axios.delete(url + `/api/notifications/${id}`);
export const createNotificationApi = (data) => axios.post(url + `/api/notifications/create`, data);

