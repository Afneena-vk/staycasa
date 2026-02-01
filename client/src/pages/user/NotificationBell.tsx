

import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { Check, Trash2 } from "lucide-react"; // icons for mark read and delete

interface NotificationBellProps {
  role?: "User" | "Owner" | "Admin";
}

export const NotificationBell = ({ role = "User" }: NotificationBellProps) => {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useAuthStore();

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"All" | "Unread">("All");

  useEffect(() => {
    fetchNotifications(role);
  }, [fetchNotifications, role]);

  const filteredNotifications =
    filter === "Unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative text-xl p-2 hover:bg-gray-100 rounded-full transition"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        // <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-md max-h-96 overflow-y-auto z-50 border border-gray-200">
          <div className="absolute left-full ml-2 mt-2 w-96 bg-white shadow-lg rounded-md max-h-96 overflow-y-auto z-[9999] border border-gray-200">

          {/* Header with Tabs */}
          <div className="flex border-b border-gray-200">
            {["All", "Unread"].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-2 text-center font-medium transition ${
                  filter === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
                onClick={() => setFilter(tab as "All" | "Unread")}
              >
                {tab}
              </button>
            ))}
                        {unreadCount > 0 && (
              <button
                className="ml-2 px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                onClick={() => markAllAsRead(role)}
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification List */}
          {filteredNotifications.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">No notifications</p>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start justify-between p-4 border-b transition ${
                  n.read ? "bg-white" : "bg-blue-50"
                } hover:bg-gray-50`}
              >
                <div className="flex-1 pr-2">
                  <p className="font-semibold text-gray-800">{n.title}</p>
                  <p className="text-gray-600 text-sm">{n.message}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center space-y-1">
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id, role)}
                      title="Mark as read"
                      className="p-1 rounded-full hover:bg-gray-200 transition"
                    >
                      <Check className="w-4 h-4 text-green-600" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id, role)}
                    title="Delete"
                    className="p-1 rounded-full hover:bg-gray-200 transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};


