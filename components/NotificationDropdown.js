"use client";
import { Fragment, useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { pusherClient } from "@/lib/pusher";
import Link from "next/link";

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    subscribeToNotifications();

    return () => {
      pusherClient.unsubscribe("private-notifications");
    };
  }, []);

  const subscribeToNotifications = () => {
    const channel = pusherClient.subscribe("private-notifications");
    channel.bind("new-notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (ids) => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: ids }),
      });
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return (
    <Menu as="div" className="relative ml-3">
      <Menu.Button className="relative rounded-full p-1 text-gray-400 hover:text-gray-500">
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={() =>
                    markAsRead(
                      notifications.filter((n) => !n.isRead).map((n) => n.id)
                    )
                  }
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <Menu.Item key={notification.id}>
                  {({ active }) => (
                    <Link
                      href={notification.link || "#"}
                      className={`${
                        active ? "bg-gray-50" : ""
                      } block px-4 py-3 ${
                        !notification.isRead ? "bg-indigo-50" : ""
                      }`}
                      onClick={() => {
                        if (!notification.isRead) {
                          markAsRead([notification.id]);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        {notification.fromUser?.profileImage ? (
                          <img
                            src={notification.fromUser.profileImage}
                            alt=""
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200" />
                        )}
                        <div className="ml-3 flex-1">
                          <p className="text-sm text-gray-900">
                            {notification.content}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(
                              new Date(notification.createdAt),
                              "MMM d, h:mm a"
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )}
                </Menu.Item>
              ))
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
