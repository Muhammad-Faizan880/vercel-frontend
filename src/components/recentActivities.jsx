import React from "react";
import { MessageCircle, MoreVertical } from "lucide-react";

const RecentActivities = ({ activities }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Recent Activities
            </h2>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto">
        {activities.map((activity, idx) => (
          <div
            key={activity.id}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 animate-slideIn"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                  activity.type === "success"
                    ? "bg-green-100 text-green-600"
                    : activity.type === "warning"
                    ? "bg-yellow-100 text-yellow-600"
                    : activity.type === "danger"
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {activity.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{activity.user}</span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium text-blue-600">
                    {activity.target}
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-400">{activity.time}</p>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <button className="text-xs text-blue-500 hover:text-blue-600">
                    View details
                  </button>
                </div>
              </div>
              <button className="text-gray-300 hover:text-gray-500">
                <MoreVertical size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;