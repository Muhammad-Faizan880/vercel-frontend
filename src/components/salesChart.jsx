import React from "react";
import Chart from "react-apexcharts";

const SalesChart = ({ salesChart, onPeriodChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Sales Overview
        </h2>
        <select
          className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white dark:bg-gray-700"
          onChange={(e) => onPeriodChange(e.target.value)}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
      <Chart
        options={salesChart.options}
        series={salesChart.series}
        type="area"
        height={300}
      />
    </div>
  );
};

export default SalesChart;