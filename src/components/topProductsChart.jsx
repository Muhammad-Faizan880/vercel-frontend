import React from "react";
import { Award } from "lucide-react";

const TopProductsChart = ({ topProducts }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Top Products
        </h2>
        <Award size={20} className="text-yellow-500" />
      </div>
      <div className="space-y-4">
        {topProducts.map((product, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-sm font-bold">
                #{idx + 1}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {product.name}
                </p>
                <p className="text-xs text-gray-400">
                  {product.sales} sales
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">
                +{product.growth}%
              </p>
              <p className="text-xs text-gray-400">
                ${product.revenue}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProductsChart;