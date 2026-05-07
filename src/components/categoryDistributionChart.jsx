import React from "react";
import Chart from "react-apexcharts";

const CategoryDistributionChart = ({ donutChart }) => {
  const total = donutChart.series.reduce((a, b) => a + b, 0);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Category Distribution
        </h2>
        <div className="text-sm text-gray-500">
          Total: {total} products
        </div>
      </div>
      <Chart
        options={donutChart.options}
        series={donutChart.series}
        type="donut"
        height={300}
      />
    </div>
  );
};

export default CategoryDistributionChart;