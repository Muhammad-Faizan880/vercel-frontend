import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  Package,
  ChevronLeft,
  ChevronDown,
  X,
  User,
  Shield,
  HelpCircle,
  LogOut,
} from "lucide-react";

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
  activeTab,
  setActiveTab,
  user,
  stats,
  selectedCategory,
  selectedSubcategory,
  expandedCategory,
  setExpandedCategory,
  setSelectedCategory,
  setSelectedSubcategory,
  setPage,
  handleLogout,
  showUserMenu,
  setShowUserMenu,
  clearCategoryFilters,
}) => {
  // Categories with subcategories for Sidebar
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

  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, badge: null },
    { name: "Products", icon: FolderKanban, badge: stats.totalProducts },
    { name: "Users", icon: Users, badge: stats.totalUsers },
    { name: "Orders", icon: ShoppingBag, badge: stats.pendingOrders },
    { name: "Analytics", icon: BarChart3, badge: null },
    { name: "Settings", icon: Settings, badge: null },
  ];

  return (
    <aside
      className={`fixed lg:relative z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 transition-all duration-300 transform shadow-xl ${
        sidebarOpen ? "w-72" : "w-20"
      } ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } h-full flex flex-col overflow-y-auto`}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-white font-bold text-sm">AD</span>
          </div>
          {sidebarOpen && (
            <div>
              <span className="font-bold text-gray-800 dark:text-white text-lg">
                AdminPanel
              </span>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                Ultimate Dashboard
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:block text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-transform duration-300"
        >
          <ChevronLeft
            className={`w-5 h-5 transition-transform duration-300 ${
              !sidebarOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 py-4 space-y-1">
        {sidebarItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          return (
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.name);
                // Clear category filters when switching tabs
                if (item.name !== "Products" && clearCategoryFilters) {
                  clearCategoryFilters();
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
              } ${!sidebarOpen && "justify-center"} animate-slideIn`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <Icon size={20} className="flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="font-medium text-sm flex-1 text-left">
                    {item.name}
                  </span>
                  {item.badge && (
                    <span
                      className={`${
                        isActive
                          ? "bg-white/20"
                          : "bg-blue-100 dark:bg-blue-900/30"
                      } text-xs px-2 py-0.5 rounded-full font-medium`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Categories Section in Sidebar - Only visible when Products tab is active */}
      {activeTab === "Products" && sidebarOpen && (
        <div className="mt-4 px-3 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between mb-3 px-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <FolderKanban size={14} /> Categories
            </h3>
            {selectedCategory !== "all" && clearCategoryFilters && (
              <button
                onClick={clearCategoryFilters}
                className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          {/* All Categories Option */}
          <button
            onClick={() => {
              if (setSelectedCategory && typeof setSelectedCategory === 'function') {
                setSelectedCategory("all");
              }
              if (setSelectedSubcategory && typeof setSelectedSubcategory === 'function') {
                setSelectedSubcategory("all");
              }
              if (setExpandedCategory) {
                setExpandedCategory(null);
              }
              if (setPage) {
                setPage(1);
              }
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all mb-1 ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Package size={18} />
            <span className="text-sm font-medium flex-1 text-left">
              All Products
            </span>
            <span className="text-xs px-1.5 py-0.5 bg-white/20 rounded-full">
              {stats.totalProducts}
            </span>
          </button>

          {/* Category List with Subcategories */}
          {productCategories.map((category) => (
            <div key={category.id} className="mb-1">
              <button
                onClick={() => {
                  if (setSelectedCategory && typeof setSelectedCategory === 'function') {
                    setSelectedCategory(category.id);
                  }
                  if (setExpandedCategory) {
                    setExpandedCategory(
                      expandedCategory === category.id ? null : category.id
                    );
                  }
                  if (setSelectedSubcategory && typeof setSelectedSubcategory === 'function') {
                    setSelectedSubcategory("all");
                  }
                  if (setPage) {
                    setPage(1);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    expandedCategory === category.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Subcategories Dropdown */}
              {expandedCategory === category.id && selectedCategory === category.id && (
                <div className="ml-9 mt-1 space-y-1 border-l-2 border-blue-200 dark:border-blue-800 pl-3 animate-slideDown">
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => {
                        if (setSelectedSubcategory && typeof setSelectedSubcategory === 'function') {
                          setSelectedSubcategory(sub);
                        }
                        if (setExpandedCategory) {
                          setExpandedCategory(null);
                        }
                        if (setPage) {
                          setPage(1);
                        }
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedSubcategory === sub
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* User Profile */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 relative user-menu bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 mt-auto">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
          {sidebarOpen && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
              >
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                />
              </button>
            </>
          )}
        </div>

        {showUserMenu && sidebarOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-slideUp">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 sm:hidden">
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || "admin@example.com"}
              </p>
            </div>
            <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors group">
              <User
                size={16}
                className="group-hover:scale-110 transition-transform"
              />
              <span>Profile Settings</span>
            </button>
            <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors group">
              <Shield
                size={16}
                className="group-hover:scale-110 transition-transform"
              />
              <span>Security</span>
            </button>
            <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors group">
              <HelpCircle
                size={16}
                className="group-hover:scale-110 transition-transform"
              />
              <span>Help & Support</span>
            </button>
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors group"
            >
              <LogOut
                size={16}
                className="group-hover:scale-110 transition-transform"
              />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;