import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Bell,
  Search,
  PlusCircle,
  Settings,
  LogOut,
  ShoppingBag,
  Package,
  Menu,
  X,
  Filter,
  Star,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  ShoppingCart,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle,
  Truck,
  Grid,
  List,
  Maximize2,
  Minimize2,
} from "lucide-react";
import axios from "../api/axios";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import ProductModal from "../admin/productModal";
import Sidebar from "../admin/adminSidebar";
import DeleteModal from "../admin/deleteModal";
import StatCard from "../components/statCards";
import SecondRowCard from "../components/secondRowCard";
import SalesChart from "../components/SalesChart";
import CategoryDistributionChart from "../components/CategoryDistributionChart";
import TopProductsChart from "../components/topProductsChart";
import RecentProducts from "../components/recentProducts";
import RecentActivities from "../components/recentActivities";
import WelcomeSection from "../components/welcomeSection";

// ============================================
// MAIN ADMIN DASHBOARD COMPONENT
// ============================================
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  // State Management
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(5);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fullScreenMode, setFullScreenMode] = useState(false);

  // Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Products State
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // Category state for sidebar selection
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [dateRange, setDateRange] = useState("week");

  // Categories with subcategories for product display
  const productCategories = [
    {
      id: "mobiles",
      name: "Mobiles",
      icon: "📱",
      subcategories: [
        "Vivo",
        "Infinix",
        "Samsung",
        "Apple",
        "Xiaomi",
        "OnePlus",
        "Realme",
        "Google Pixel",
        "Nokia",
      ],
    },
    {
      id: "laptops",
      name: "Laptops",
      icon: "💻",
      subcategories: [
        "MacBook",
        "HP",
        "Dell",
        "Lenovo",
        "Asus",
        "Acer",
        "MSI",
        "Razer",
        "Microsoft Surface",
      ],
    },
    {
      id: "electronics",
      name: "Electronics",
      icon: "🔌",
      subcategories: [
        "Headphones",
        "Speakers",
        "Watches",
        "Cameras",
        "Gaming",
        "TVs",
        "Monitors",
        "Keyboards",
        "Mice",
      ],
    },
    {
      id: "fashion",
      name: "Fashion",
      icon: "👕",
      subcategories: [
        "Men",
        "Women",
        "Kids",
        "Accessories",
        "Footwear",
        "Sportswear",
        "Bags",
        "Jewelry",
      ],
    },
    {
      id: "home",
      name: "Home & Living",
      icon: "🏠",
      subcategories: [
        "Furniture",
        "Decor",
        "Kitchen",
        "Bedding",
        "Lighting",
        "Garden",
        "Storage",
        "Bath",
      ],
    },
  ];

  // Stats State
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
    lowStock: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageRating: 0,
    monthlyGrowth: 23,
    weeklySales: 12450,
    conversionRate: 3.2,
  });

  // Recent Activities
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      user: "John Doe",
      action: "added new product",
      target: "Gaming Mouse",
      time: "2 minutes ago",
      type: "success",
      avatar: "JD",
    },
    {
      id: 2,
      user: "Sarah Smith",
      action: "updated order status",
      target: "#ORD-1234",
      time: "15 minutes ago",
      type: "info",
      avatar: "SS",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "deleted product",
      target: "Old Keyboard",
      time: "1 hour ago",
      type: "warning",
      avatar: "MJ",
    },
    {
      id: 4,
      user: "Emma Wilson",
      action: "processed refund",
      target: "$89.99",
      time: "3 hours ago",
      type: "danger",
      avatar: "EW",
    },
    {
      id: 5,
      user: "Admin",
      action: "updated system settings",
      target: "Security",
      time: "5 hours ago",
      type: "success",
      avatar: "AD",
    },
    {
      id: 6,
      user: "Alex Chen",
      action: "added new review",
      target: "5 stars on Product X",
      time: "6 hours ago",
      type: "info",
      avatar: "AC",
    },
  ]);

  // Top Products
  const [topProducts, setTopProducts] = useState([
    {
      name: "Gaming Mouse",
      sales: 1245,
      revenue: 24890,
      growth: 15,
      image: null,
    },
    {
      name: "Mechanical Keyboard",
      sales: 892,
      revenue: 35680,
      growth: 22,
      image: null,
    },
    { name: "4K Monitor", sales: 567, revenue: 113400, growth: 8, image: null },
    {
      name: "Wireless Headphones",
      sales: 2341,
      revenue: 70230,
      growth: 31,
      image: null,
    },
  ]);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      let params = { keyword, minPrice, maxPrice, page, limit: 9, sortBy };
      if (selectedCategory !== "all") params.category = selectedCategory;
      if (selectedSubcategory !== "all")
        params.subcategory = selectedSubcategory;
      const response = await axios.get("/products", { params });
      setProducts(response.data.products);
      setPages(response.data.pages);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    try {
      const productsRes = await axios.get("/products", {
        params: { limit: 100 },
      });
      setStats((prev) => ({
        ...prev,
        totalProducts: productsRes.data.total || 156,
        totalUsers: 1248,
        totalOrders: 892,
        revenue: 45780,
        lowStock: 23,
        pendingOrders: 45,
        completedOrders: 847,
        averageRating: 4.5,
      }));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // Delete Product
  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      setDeleteLoading(true);
      await axios.delete(`/products/${selectedProduct._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== selectedProduct._id));
      toast.success("Product deleted successfully");
      setShowDeleteModal(false);
      setSelectedProduct(null);
      fetchDashboardData();
      fetchProducts();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Reset filters
  const resetFilters = () => {
    setKeyword("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
    setSortBy("newest");
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setExpandedCategory(null);
    toast.success("Filters reset successfully");
  };

  const openAddModal = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const openEditModal = (product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchProducts();
    fetchDashboardData();
  };

  const refreshData = () => {
    fetchProducts();
    fetchDashboardData();
    toast.success("Data refreshed successfully");
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullScreenMode(true);
    } else {
      document.exitFullscreen();
      setFullScreenMode(false);
    }
  };

  const getCurrentCategory = () => {
    return productCategories.find((cat) => cat.id === selectedCategory);
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchProducts(), 500);
    return () => clearTimeout(delay);
  }, [
    keyword,
    minPrice,
    maxPrice,
    page,
    sortBy,
    selectedCategory,
    selectedSubcategory,
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        !event.target.closest(".notifications-dropdown")
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  // Sales Chart State
  const [salesChart, setSalesChart] = useState({
    series: [
      {
        name: "Sales",
        data: [12500, 14200, 13800, 16500, 18900, 21000, 24500],
      },
    ],
    options: {
      chart: {
        type: "area",
        height: 350,
        toolbar: { show: false },
        zoom: { enabled: false },
        background: "transparent",
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2, colors: ["#3b82f6"] },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
        },
      },
      colors: ["#3b82f6"],
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        labels: { style: { colors: "#9ca3af" } },
      },
      yaxis: {
        labels: {
          formatter: (value) => `$${value.toLocaleString()}`,
          style: { colors: "#9ca3af" },
        },
      },
      grid: { borderColor: "#e5e7eb", strokeDashArray: 5 },
      tooltip: {
        theme: "dark",
        y: { formatter: (value) => `$${value.toLocaleString()}` },
      },
    },
  });

  // Donut Chart State
  const [donutChart, setDonutChart] = useState({
    series: [45, 32, 28, 15],
    options: {
      chart: { type: "donut", height: 350, background: "transparent" },
      labels: ["Electronics", "Fashion", "Home & Living", "Accessories"],
      colors: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"],
      legend: { position: "bottom", labels: { colors: "#6b7280" } },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
            labels: {
              show: true,
              name: { show: true, fontSize: "16px" },
              value: {
                show: true,
                fontSize: "24px",
                color: "#3b82f6",
                formatter: (value) => `${value}%`,
              },
              total: {
                show: true,
                label: "Categories",
                fontSize: "14px",
                color: "#6b7280",
              },
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: { chart: { width: "100%" }, legend: { position: "bottom" } },
        },
      ],
    },
  });

  const handleSalesPeriodChange = (period) => {
    if (period === "week") {
      setSalesChart({
        ...salesChart,
        series: [{ data: [12500, 14200, 13800, 16500, 18900, 21000, 24500] }],
        options: {
          ...salesChart.options,
          xaxis: {
            ...salesChart.options.xaxis,
            categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          },
        },
      });
    } else if (period === "month") {
      setSalesChart({
        ...salesChart,
        series: [
          {
            data: [
              45000, 52000, 48000, 56000, 61000, 58000, 67000, 72000, 69000,
              78000, 82000, 89000,
            ],
          },
        ],
        options: {
          ...salesChart.options,
          xaxis: {
            ...salesChart.options.xaxis,
            categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
          },
        },
      });
    } else {
      setSalesChart({
        ...salesChart,
        series: [{ data: [450000, 520000, 580000, 620000] }],
        options: {
          ...salesChart.options,
          xaxis: {
            ...salesChart.options.xaxis,
            categories: ["2023", "2024", "2025", "2026"],
          },
        },
      });
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <Toaster position="top-right" />

        <ProductModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          productToEdit={productToEdit}
          onSuccess={handleModalSuccess}
          token={token}
        />

        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedProduct(null);
          }}
          onConfirm={handleDelete}
          productName={selectedProduct?.name || ""}
          isLoading={deleteLoading}
        />

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          stats={stats}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          expandedCategory={expandedCategory}
          setExpandedCategory={setExpandedCategory}
          setSelectedCategory={setSelectedCategory}
          setSelectedSubcategory={setSelectedSubcategory}
          setPage={setPage}
          handleLogout={handleLogout}
          showUserMenu={showUserMenu}
          setShowUserMenu={setShowUserMenu}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
              >
                <Menu size={22} />
              </button>
              <div className="relative flex-1 max-w-md mr-2">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search products, orders, users..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-900 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={toggleFullscreen}
                className="hidden sm:flex p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {fullScreenMode ? (
                  <Minimize2 size={18} />
                ) : (
                  <Maximize2 size={18} />
                )}
              </button>
              <button
                onClick={refreshData}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <RefreshCw
                  size={16}
                  className={isLoading ? "animate-spin" : ""}
                />
              </button>
              <div className="relative notifications-dropdown">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Bell size={18} />
                  {notifications > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 animate-slideDown">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        Notifications
                      </h3>
                      <span className="text-xs text-blue-600 cursor-pointer">
                        Mark all read
                      </span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer group">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <ShoppingBag size={14} className="text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800 dark:text-gray-300">
                              New order{" "}
                              <span className="font-semibold">#ORD-1234</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              5 minutes ago
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer group">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle size={14} className="text-red-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800 dark:text-gray-300">
                              Product{" "}
                              <span className="font-semibold">
                                "Gaming Mouse"
                              </span>{" "}
                              out of stock
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              1 hour ago
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer group">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Users size={14} className="text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800 dark:text-gray-300">
                              New user{" "}
                              <span className="font-semibold">registered</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              3 hours ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {activeTab === "Dashboard" && (
              <>
                <WelcomeSection
                  userName={user?.name}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                  <StatCard
                    title="Total Revenue"
                    value={stats.revenue}
                    icon={DollarSign}
                    color="bg-gradient-to-br from-green-500 to-emerald-600"
                    trend={12.5}
                    subtitle="+$5,234 from last month"
                  />
                  <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingCart}
                    color="bg-gradient-to-br from-blue-500 to-cyan-600"
                    trend={8.2}
                    subtitle="+67 new orders"
                  />
                  <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    color="bg-gradient-to-br from-purple-500 to-pink-600"
                    trend={-3.1}
                    subtitle="12 out of stock"
                  />
                  <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="bg-gradient-to-br from-orange-500 to-red-600"
                    trend={15.3}
                    subtitle="+189 new users"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                  <SecondRowCard
                    type="lowStock"
                    value={stats.lowStock}
                    title="Low Stock Items"
                    description="Need immediate attention"
                  />
                  <SecondRowCard
                    type="pendingOrders"
                    value={stats.pendingOrders}
                    title="Pending Orders"
                    description="Awaiting processing"
                    extra="15 orders"
                  />
                  <SecondRowCard
                    type="completedOrders"
                    value={stats.completedOrders}
                    title="Completed Orders"
                    description="Successfully delivered"
                    extra="Delivery rate: 94%"
                  />
                  <SecondRowCard
                    type="averageRating"
                    value={stats.averageRating}
                    title="Average Rating"
                    description="Based on 2,345 reviews"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <SalesChart
                    salesChart={salesChart}
                    onPeriodChange={handleSalesPeriodChange}
                  />
                  <CategoryDistributionChart donutChart={donutChart} />
                  <TopProductsChart topProducts={topProducts} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RecentProducts
                    products={products}
                    isLoading={isLoading}
                    onViewAll={() => setActiveTab("Products")}
                    onEdit={openEditModal}
                    onDelete={(product) => {
                      setSelectedProduct(product);
                      setShowDeleteModal(true);
                    }}
                  />
                  <RecentActivities activities={recentActivities} />
                </div>
              </>
            )}

            {activeTab === "Products" && (
              <div className="animate-fadeIn">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                      Products Management
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      {selectedCategory !== "all"
                        ? `Showing ${getCurrentCategory()?.name} products${selectedSubcategory !== "all" ? ` › ${selectedSubcategory}` : ""}`
                        : "Manage your product inventory"}
                    </p>
                  </div>
                  <button
                    onClick={openAddModal}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
                  >
                    <PlusCircle size={18} /> Add New Product
                  </button>
                </div>

                {selectedCategory !== "all" && (
                  <div className="mb-4 flex items-center gap-2 flex-wrap p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Active Filter:
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                      <span className="text-lg">
                        {getCurrentCategory()?.icon}
                      </span>
                      {getCurrentCategory()?.name}
                      {selectedSubcategory !== "all" && (
                        <span className="mx-1">›</span>
                      )}
                      {selectedSubcategory !== "all" && (
                        <span>{selectedSubcategory}</span>
                      )}
                      <button
                        onClick={() => {
                          setSelectedCategory("all");
                          setSelectedSubcategory("all");
                          setExpandedCategory(null);
                          setPage(1);
                        }}
                        className="ml-2 hover:text-blue-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="relative">
                        <Search
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                          className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm w-48 sm:w-64 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                      >
                        <option value="newest">Newest First</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                      </select>
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm"
                      >
                        <Filter size={14} /> Filters{" "}
                        {(minPrice || maxPrice) && (
                          <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                            1
                          </span>
                        )}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-1 ${viewMode === "grid" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}
                      >
                        <Grid size={14} /> Grid
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-1 ${viewMode === "list" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}
                      >
                        <List size={14} /> List
                      </button>
                    </div>
                  </div>
                  {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-slideDown">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Min Price
                          </label>
                          <input
                            type="number"
                            placeholder="$0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Max Price
                          </label>
                          <input
                            type="number"
                            placeholder="$1000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                          />
                        </div>
                      </div>
                      {(keyword ||
                        minPrice ||
                        maxPrice ||
                        selectedCategory !== "all") && (
                        <button
                          onClick={resetFilters}
                          className="mt-4 text-red-600 hover:text-red-700 text-sm flex items-center gap-1 transition-colors"
                        >
                          <X size={14} /> Reset all filters
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package
                          size={24}
                          className="text-blue-600 animate-pulse"
                        />
                      </div>
                    </div>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl animate-fadeIn">
                    <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {selectedCategory !== "all"
                        ? `No products found in ${getCurrentCategory()?.name}${selectedSubcategory !== "all" ? ` › ${selectedSubcategory}` : ""}`
                        : "Try adjusting your search or filters"}
                    </p>
                    <button
                      onClick={openAddModal}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all inline-flex items-center gap-2"
                    >
                      <PlusCircle size={18} /> Add your first product
                    </button>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product, idx) => (
                      <div
                        key={product._id}
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-scaleIn"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                          {product.image ? (
                            <img
                              src={`http://localhost:5000${product.image}`}
                              alt={product.name}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Package size={48} className="text-gray-400" />
                            </div>
                          )}
                          {product.category && (
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <span className="text-sm">
                                {productCategories.find(
                                  (c) => c.id === product.category,
                                )?.icon || "📦"}
                              </span>
                              <span>{product.category}</span>
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-1">
                            <button
                              onClick={() => openEditModal(product)}
                              className="p-1.5 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-all hover:scale-110"
                            >
                              <Edit size={14} className="text-blue-600" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowDeleteModal(true);
                              }}
                              className="p-1.5 bg-white rounded-lg shadow-md hover:bg-red-50 transition-all hover:scale-110"
                            >
                              <Trash2 size={14} className="text-red-600" />
                            </button>
                          </div>
                          {product.price < 50 && (
                            <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                              Best Deal
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 dark:text-white mb-1 line-clamp-1">
                            {product.name}
                          </h3>
                          {product.subcategory && (
                            <p className="text-xs text-gray-500 mb-1">
                              {product.subcategory}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                            {product.description || "No description available"}
                          </p>
                          <div className="flex justify-between items-center mt-3">
                            <div>
                              <span className="text-xl font-bold text-blue-600">
                                ${product.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {products.map((product) => (
                      <div
                        key={product._id}
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center">
                              {product.image ? (
                                <img
                                  src={`http://localhost:5000${product.image}`}
                                  alt={product.name}
                                  className="w-full h-full object-contain rounded-xl"
                                />
                              ) : (
                                <Package size={24} className="text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 dark:text-white">
                                {product.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                {product.category && (
                                  <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full flex items-center gap-1">
                                    <span>
                                      {
                                        productCategories.find(
                                          (c) => c.id === product.category,
                                        )?.icon
                                      }
                                    </span>
                                    {product.category}
                                  </span>
                                )}
                                {product.subcategory && (
                                  <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                                    {product.subcategory}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                                {product.description || "No description"}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-lg font-bold text-blue-600">
                                  ${product.price}
                                </span>
                                <span className="text-xs text-gray-400">
                                  SKU: PROD-{product._id?.slice(-6)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link to={`/productDetail/${product._id}`}>
                              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-1">
                                <Eye size={14} /> View
                              </button>
                            </Link>
                            <button
                              onClick={() => openEditModal(product)}
                              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1"
                            >
                              <Edit size={14} /> Edit
                            </button>
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowDeleteModal(true);
                              }}
                              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-1"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    {[...Array(Math.min(5, pages))].map((_, i) => {
                      let pageNum;
                      if (pages <= 5) pageNum = i + 1;
                      else if (page <= 3) pageNum = i + 1;
                      else if (page >= pages - 2) pageNum = pages - 4 + i;
                      else pageNum = page - 2 + i;
                      return (
                        <button
                          key={i}
                          onClick={() => setPage(pageNum)}
                          className={`w-9 h-9 rounded-xl transition-all ${page === pageNum ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md" : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage((p) => Math.min(pages, p + 1))}
                      disabled={page === pages}
                      className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
