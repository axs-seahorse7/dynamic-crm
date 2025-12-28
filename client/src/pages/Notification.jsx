// src/pages/Notifications.jsx
import React, { useEffect, useState } from "react";
import { fetchNotifications, postMarkRead, postMarkAllRead, deleteNotificationApi, createNotificationApi } from "../services/NotificationService.js";
// import { useAuth } from "../contexts/AuthContext"; // assumes you have this

      const user = JSON.parse(localStorage.getItem('user'));
      // console.log("Logged in user:", user);

function NotificationItem({ n, onMarkRead, onDelete }) {
  return (
    <div className={`p-4 border rounded mb-2 flex justify-between ${n.read ? "bg-white" : "bg-gray-50"}`}>
      <div>
        <div className="text-sm font-semibold">{n.title}</div>
        <div className="text-xs text-gray-600">{n.body}</div>
        <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
      </div>

      <div className="flex items-start gap-2">
        {!n.read && (
          <button onClick={() => onMarkRead(n._id)} className="text-sm px-2 py-1 border rounded">Mark read</button>
        )}
        <button onClick={() => onDelete(n._id)} className="text-sm px-2 py-1 border rounded text-red-600">Delete</button>
      </div>
    </div>
  );
}

export default function Notifications() {
//   const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

//   useEffect(() => load(), [page]);

// useEffect(() => {
//     createNotificationApi({
//         // userId:user._id,
//         title: "Welcome to Zentro!",
//         body: "Thank you for joining Zentro CRM. We're excited to have you on board.",
//         userId: "all" // assuming "all" means all users
//     }).catch(err => console.error(err));
// }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetchNotifications({userId:user._id, page, limit: 25, read:true });
      setNotifications(res.data.notifications);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkRead(id) {
    try {
      await postMarkRead(id);
      setNotifications((s) => s.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) { console.error(err); }
  }

  async function handleMarkAll() {
    try {
      await postMarkAllRead();
      setNotifications((s) => s.map(n => ({ ...n, read: true })));
    } catch (err) { console.error(err); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete notification?")) return;
    try {
      await deleteNotificationApi(id);
      setNotifications((s) => s.filter(n => n._id !== id));
    } catch (err) { console.error(err); }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Notifications</h2>
        <div className="flex gap-2">
          <button onClick={handleMarkAll} className="px-3 py-1 border rounded">Mark all read</button>
          <button onClick={load} className="px-3 py-1 border rounded">Refresh</button>
        </div>
      </div>

      {loading ? <div>Loading...</div> : (
        <div>
          {notifications.length === 0 && <div className="text-gray-500">No notifications</div>}
          {notifications.map(n => (
            <NotificationItem key={n._id} n={n} onMarkRead={handleMarkRead} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 border rounded">Prev</button>
        <div>Page {page} / {pages}</div>
        <button disabled={page >= pages} onClick={() => setPage(p => Math.min(pages, p + 1))} className="px-3 py-1 border rounded">Next</button>
      </div>
    </div>
  );
}
