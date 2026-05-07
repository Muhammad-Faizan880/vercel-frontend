import React from "react";
import { AlertCircle, Clock, CheckCircle, Truck, Star } from "lucide-react";

const SecondRowCard = ({ type, value, title, description, extra }) => {
  const getIcon = () => {
    switch (type) {
      case "lowStock":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "pendingOrders":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "completedOrders":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "averageRating":
        return <Star className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "lowStock":
        return "bg-yellow-100 dark:bg-yellow-900/30";
      case "pendingOrders":
        return "bg-blue-100 dark:bg-blue-900/30";
      case "completedOrders":
        return "bg-green-100 dark:bg-green-900/30";
      case "averageRating":
        return "bg-red-100 dark:bg-red-900/30";
      default:
        return "bg-yellow-100 dark:bg-yellow-900/30";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-10 h-10 ${getBgColor()} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
        >
          {getIcon()}
        </div>
        <span className="text-2xl font-bold text-gray-800 dark:text-white">
          {value}
        </span>
      </div>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {title}
      </p>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
      {extra && (
        <div className="mt-3">
          {type === "lowStock" && (
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full"
                style={{ width: "15%" }}
              ></div>
            </div>
          )}
          {type === "pendingOrders" && (
            <div className="flex items-center justify-between text-xs">
              <span>Need to ship</span>
              <span className="text-blue-600 font-medium">{extra}</span>
            </div>
          )}
          {type === "completedOrders" && (
            <div className="flex items-center gap-2">
              <Truck size={14} className="text-green-500" />
              <span className="text-xs text-gray-500">{extra}</span>
            </div>
          )}
          {type === "averageRating" && (
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  className={`${
                    star <= Math.floor(value)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SecondRowCard;