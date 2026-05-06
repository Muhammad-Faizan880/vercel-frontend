import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CalendarDays,
  FileText,
  BarChart3,
  ChevronDown,
  Bell,
  Search,
  PlusCircle,
  Settings,
  LogOut,
  ShoppingBag,
  TrendingUp,
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
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  ShoppingCart,
  Archive,
  Gift,
  Zap,
  Moon,
  Sun,
  Download,
  Printer,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreVertical,
  Heart,
  Share2,
  ExternalLink,
  CreditCard,
  Truck,
  MessageCircle,
  HelpCircle,
  Shield,
  Award,
  Target,
  Globe,
  Layers,
  Grid,
  List,
  Maximize2,
  Minimize2,
} from "lucide-react";
import axios from "../api/axios";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import Chart from "react-apexcharts";

// ============================================
// PRODUCT MODAL COMPONENT (ADD/EDIT)
// ============================================
const ProductModal = ({ isOpen, onClose, productToEdit, onSuccess, token }) => {
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Product basic info
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  // Variants state
  const [variants, setVariants] = useState([]);
  const [size, setSize] = useState("");
  const [colors, setColors] = useState([]);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");
  const [colorStock, setColorStock] = useState("");

  // Set edit mode when productToEdit changes
  useEffect(() => {
    if (productToEdit) {
      setIsEditMode(true);
      loadProductForEdit(productToEdit);
    } else {
      setIsEditMode(false);
      resetForm();
    }
  }, [productToEdit]);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      image: null,
    });
    setPreview(null);
    setExistingImage(null);
    setVariants([]);
    setColors([]);
    setSize("");
    setColorName("");
    setColorHex("#000000");
    setColorStock("");
  };

  const loadProductForEdit = async (product) => {
    try {
      setLoading(true);

      // If product is already passed with full data
      if (product.name) {
        setForm({
          name: product.name,
          description: product.description || "",
          price: product.price,
          image: null,
        });

        if (product.image) {
          setExistingImage(product.image);
          setPreview(`http://localhost:5000${product.image}`);
        }

        // Transform variants data
        if (product.variants && product.variants.length > 0) {
          const groupedVariants = {};
          product.variants.forEach((variant) => {
            if (!groupedVariants[variant.size]) {
              groupedVariants[variant.size] = {
                size: variant.size,
                colors: [],
                totalStock: 0,
              };
            }

            groupedVariants[variant.size].colors.push({
              name: variant.color.name,
              hex: variant.color.hex,
              stock: variant.stock,
              image: variant.image || null,
              preview: variant.image
                ? `http://localhost:5000${variant.image}`
                : null,
              _id: variant._id,
            });

            groupedVariants[variant.size].totalStock += variant.stock;
          });
          setVariants(Object.values(groupedVariants));
        }
      } else {
        // Fetch full product details if only ID is passed
        const response = await axios.get(`/products/${product._id || product}`);
        const productData = response.data;

        setForm({
          name: productData.name,
          description: productData.description || "",
          price: productData.price,
          image: null,
        });

        if (productData.image) {
          setExistingImage(productData.image);
          setPreview(`http://localhost:5000${productData.image}`);
        }

        if (productData.variants && productData.variants.length > 0) {
          const groupedVariants = {};
          productData.variants.forEach((variant) => {
            if (!groupedVariants[variant.size]) {
              groupedVariants[variant.size] = {
                size: variant.size,
                colors: [],
                totalStock: 0,
              };
            }

            groupedVariants[variant.size].colors.push({
              name: variant.color.name,
              hex: variant.color.hex,
              stock: variant.stock,
              image: variant.image || null,
              preview: variant.image
                ? `http://localhost:5000${variant.image}`
                : null,
              _id: variant._id,
            });

            groupedVariants[variant.size].totalStock += variant.stock;
          });
          setVariants(Object.values(groupedVariants));
        }
      }
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
      setExistingImage(null);
    }
  };

  const addColorToSize = () => {
    if (!colorName || !colorStock) {
      toast.error("Please fill color name and stock");
      return;
    }

    const newColor = {
      name: colorName,
      hex: colorHex,
      stock: Number(colorStock),
      image: null,
      preview: null,
    };

    setColors([...colors, newColor]);
    setColorName("");
    setColorHex("#000000");
    setColorStock("");
  };

  const handleColorImage = (file, index) => {
    if (!file) return;
    const updated = [...colors];
    updated[index].image = file;
    updated[index].preview = URL.createObjectURL(file);
    setColors(updated);
  };

  const handleExistingColorImage = (file, variantIndex, colorIndex) => {
    if (!file) return;
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].colors[colorIndex].image = file;
    updatedVariants[variantIndex].colors[colorIndex].preview =
      URL.createObjectURL(file);
    setVariants(updatedVariants);
  };

  const removeColor = (index) => {
    const updatedColors = [...colors];
    updatedColors.splice(index, 1);
    setColors(updatedColors);
  };

  const addVariant = () => {
    if (!size) {
      toast.error("Please enter size");
      return;
    }

    if (colors.length === 0) {
      toast.error("Please add at least one color for this size");
      return;
    }

    const existingSize = variants.find((v) => v.size === size);
    if (existingSize) {
      toast.error(`Size ${size} already exists!`);
      return;
    }

    setVariants([
      ...variants,
      {
        size: size,
        colors: colors.map((c) => ({ ...c })),
        totalStock: colors.reduce((sum, c) => sum + c.stock, 0),
      },
    ]);

    setSize("");
    setColors([]);
    toast.success(`Size ${size} added`);
  };

  const removeVariant = (index) => {
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);
  };

  const removeColorFromVariant = (variantIndex, colorIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].colors.splice(colorIndex, 1);
    updatedVariants[variantIndex].totalStock = updatedVariants[
      variantIndex
    ].colors.reduce((sum, c) => sum + c.stock, 0);

    if (updatedVariants[variantIndex].colors.length === 0) {
      updatedVariants.splice(variantIndex, 1);
    }
    setVariants(updatedVariants);
  };

  const updateColorStock = (variantIndex, colorIndex, newStock) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].colors[colorIndex].stock = Number(newStock);
    updatedVariants[variantIndex].totalStock = updatedVariants[
      variantIndex
    ].colors.reduce((sum, c) => sum + c.stock, 0);
    setVariants(updatedVariants);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, description, price, image } = form;

    if (!name || !description || !price) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!image && !existingImage && !isEditMode) {
      toast.error("Please add a product image");
      return;
    }

    if (variants.length === 0) {
      toast.error("Add at least one size with colors");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", Number(price));

      if (image) {
        formData.append("image", image);
      }

      const apiVariants = [];
      variants.forEach((variant) => {
        variant.colors.forEach((color, colorIndex) => {
          apiVariants.push({
            size: variant.size,
            color: {
              name: color.name,
              hex: color.hex,
            },
            stock: color.stock,
            colorIndex: colorIndex,
            _id: color._id,
          });

          if (color.image && typeof color.image !== "string") {
            formData.append(
              `colorImage_${variant.size}_${color.name}_${colorIndex}`,
              color.image,
            );
          }
        });
      });
      formData.append("variants", JSON.stringify(apiVariants));

      if (isEditMode && productToEdit?._id) {
        await axios.put(`/products/${productToEdit._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Product updated successfully");
      } else {
        await axios.post("/products", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Product added successfully");
      }

      resetForm();
      onSuccess(); // Refresh product list
      onClose(); // Close modal
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} product`,
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Basic Information
                </h3>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Image {!isEditMode && "*"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="modalImageUpload"
                  />
                  <label
                    htmlFor="modalImageUpload"
                    className="w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors overflow-hidden"
                  >
                    {preview ? (
                      <img
                        src={preview}
                        className="h-full object-contain"
                        alt="Preview"
                      />
                    ) : (
                      <div className="text-center">
                        <Package
                          size={40}
                          className="mx-auto text-gray-400 mb-2"
                        />
                        <p className="text-gray-500">Click to upload image</p>
                        {existingImage && !preview && (
                          <p className="text-xs text-gray-400 mt-1">
                            Current image will be kept
                          </p>
                        )}
                      </div>
                    )}
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Product Name *
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g., Premium Cotton T-Shirt"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price ($) *
                    </label>
                    <input
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="29.99"
                      type="number"
                      step="0.01"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your product..."
                    rows="3"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Variants Builder */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Sizes & Colors
                </h3>

                {/* Add New Size */}
                <div className="border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900/20">
                  <h4 className="font-semibold text-indigo-800 dark:text-indigo-400 mb-3">
                    Add New Size with Colors
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Size *
                      </label>
                      <input
                        value={size}
                        onChange={(e) => setSize(e.target.value.toUpperCase())}
                        placeholder="e.g., M, L, XL"
                        className="w-full p-2 border rounded-lg dark:bg-gray-800"
                        list="sizeOptions"
                      />
                      <datalist id="sizeOptions">
                        <option>XS</option>
                        <option>S</option>
                        <option>M</option>
                        <option>L</option>
                        <option>XL</option>
                        <option>XXL</option>
                      </datalist>
                    </div>
                  </div>

                  {/* Add Colors */}
                  <div className="border-t border-indigo-200 pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Add Colors for {size || "this"} Size:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
                      <input
                        value={colorName}
                        onChange={(e) => setColorName(e.target.value)}
                        placeholder="Color Name"
                        className="p-2 border rounded-lg dark:bg-gray-800"
                      />
                      <input
                        type="color"
                        value={colorHex}
                        onChange={(e) => setColorHex(e.target.value)}
                        className="h-10 border rounded-lg"
                      />
                      <input
                        type="number"
                        value={colorStock}
                        onChange={(e) => setColorStock(e.target.value)}
                        placeholder="Stock"
                        className="p-2 border rounded-lg dark:bg-gray-800"
                      />
                      <button
                        type="button"
                        onClick={addColorToSize}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                      >
                        + Add Color
                      </button>
                    </div>

                    {colors.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          Colors to add:
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {colors.map((color, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-full"
                            >
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: color.hex }}
                              ></div>
                              <span className="text-sm">{color.name}</span>
                              <span className="text-xs text-gray-500">
                                Stock: {color.stock}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeColor(idx)}
                                className="text-red-500 ml-1"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={addVariant}
                    className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold"
                  >
                    Add Size {size} with {colors.length} Colors
                  </button>
                </div>

                {/* Display Added Variants */}
                {variants.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                      Added Sizes & Colors:
                    </h4>
                    <div className="space-y-3">
                      {variants.map((variant, vIdx) => (
                        <div
                          key={vIdx}
                          className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="text-lg font-bold text-indigo-600">
                              Size: {variant.size}
                            </h5>
                            <button
                              type="button"
                              onClick={() => removeVariant(vIdx)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove Size
                            </button>
                          </div>
                          <div className="grid gap-2">
                            {variant.colors.map((color, cIdx) => (
                              <div
                                key={cIdx}
                                className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-lg flex-wrap"
                              >
                                <div
                                  className="w-8 h-8 rounded-full shadow"
                                  style={{ backgroundColor: color.hex }}
                                ></div>
                                <span className="font-medium w-24">
                                  {color.name}
                                </span>
                                <input
                                  type="number"
                                  value={color.stock}
                                  onChange={(e) =>
                                    updateColorStock(vIdx, cIdx, e.target.value)
                                  }
                                  className="w-24 p-1 border rounded text-center dark:bg-gray-700"
                                />
                                <span className="text-sm text-gray-500">
                                  items
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeColorFromVariant(vIdx, cIdx)
                                  }
                                  className="text-red-500 ml-1"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            Total Stock: {variant.totalStock} items
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : isEditMode
                    ? "Update Product"
                    : "Create Product"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

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
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateRange, setDateRange] = useState("week");

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

  // Recent Activities - Enhanced
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

  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, badge: null },
    { name: "Products", icon: FolderKanban, badge: stats.totalProducts },
    { name: "Users", icon: Users, badge: stats.totalUsers },
    { name: "Orders", icon: ShoppingBag, badge: stats.pendingOrders },
    { name: "Analytics", icon: BarChart3, badge: null },
    { name: "Settings", icon: Settings, badge: null },
  ];

  const categories = [
    {
      id: "all",
      name: "All Products",
      icon: Package,
      count: stats.totalProducts,
    },
    { id: "electronics", name: "Electronics", icon: Zap, count: 45 },
    { id: "fashion", name: "Fashion", icon: Heart, count: 32 },
    { id: "home", name: "Home & Living", icon: Layers, count: 28 },
  ];

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/products", {
        params: {
          keyword,
          minPrice,
          maxPrice,
          page,
          limit: 9,
          sortBy,
        },
      });
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
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
      setShowDeleteModal(false);
      fetchDashboardData();
      fetchProducts();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete product");
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
    toast.success("Filters reset successfully");
  };

  // Export Data
  const exportData = (format) => {
    toast.success(
      `Exporting as ${format.toUpperCase()}... You'll receive an email shortly.`,
    );
  };

  // Open Add Modal
  const openAddModal = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  // Handle Modal Success (refresh data)
  const handleModalSuccess = () => {
    fetchProducts();
    fetchDashboardData();
  };

  // Refresh Data
  const refreshData = () => {
    fetchProducts();
    fetchDashboardData();
    toast.success("Data refreshed successfully");
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullScreenMode(true);
    } else {
      document.exitFullscreen();
      setFullScreenMode(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(delay);
  }, [keyword, minPrice, maxPrice, page, sortBy]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        !event.target.closest(".notifications-dropdown")
      ) {
        setShowNotifications(false);
      }
      if (showUserMenu && !event.target.closest(".user-menu")) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications, showUserMenu]);

  // Sales Chart State (Line/Area Chart)
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
      stroke: {
        curve: "smooth",
        width: 2,
        colors: ["#3b82f6"],
      },
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
      grid: {
        borderColor: "#e5e7eb",
        strokeDashArray: 5,
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (value) => `$${value.toLocaleString()}`,
        },
      },
    },
  });

  // Donut Chart State (Category Distribution)
  const [donutChart, setDonutChart] = useState({
    series: [45, 32, 28, 15],
    options: {
      chart: {
        type: "donut",
        height: 350,
        background: "transparent",
      },
      labels: ["Electronics", "Fashion", "Home & Living", "Accessories"],
      colors: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"],
      legend: {
        position: "bottom",
        labels: { colors: "#6b7280" },
      },
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

  // Handle period change for sales chart
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

  // Stats Cards Component - Enhanced
  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
    trendValue,
    subtitle,
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {value.toLocaleString()}
          </p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-medium ${trend > 0 ? "text-green-600" : "text-red-600"} flex items-center gap-0.5`}
              >
                {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
        >
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <Toaster position="top-right" />

        {/* Product Modal */}
        <ProductModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          productToEdit={productToEdit}
          onSuccess={handleModalSuccess}
          token={token}
        />

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar - Enhanced */}
        <aside
          className={`
          fixed lg:relative z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 transform shadow-xl
          ${sidebarOpen ? "w-72" : "w-20"}
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          h-full flex flex-col
        `}
        >
          {/* Logo Area - Enhanced */}
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
                className={`w-5 h-5 transition-transform duration-300 ${!sidebarOpen ? "rotate-180" : ""}`}
              />
            </button>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation - Enhanced */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {sidebarItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                    }
                    ${!sidebarOpen && "justify-center"}
                    animate-slideIn
                  `}
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
                          className={`${isActive ? "bg-white/20" : "bg-blue-100 dark:bg-blue-900/30"} text-xs px-2 py-0.5 rounded-full font-medium`}
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

          {/* User Profile - Enhanced Responsive */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 relative user-menu bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
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
                      className={`transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
                    />
                  </button>
                </>
              )}
            </div>

            {/* User Dropdown Menu - Enhanced */}
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header - Enhanced */}
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
              {/* Fullscreen Toggle */}
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

              {/* Refresh Button */}
              <button
                onClick={refreshData}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <RefreshCw
                  size={16}
                  className={isLoading ? "animate-spin" : ""}
                />
              </button>

              {/* Notifications */}
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
                {/* Welcome Section - Enhanced */}
                <div className="mb-8 animate-slideIn">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                        Welcome back, {user?.name || "Admin"}! 👋
                      </h1>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Here's what's happening with your store today.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                      >
                        <option value="week">Last 7 days</option>
                        <option value="month">Last 30 days</option>
                        <option value="year">Last year</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Stats Grid - Enhanced */}
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

                {/* Second Row Stats - Enhanced */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      </div>
                      <span className="text-2xl font-bold text-gray-800 dark:text-white">
                        {stats.lowStock}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Low Stock Items
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Need immediate attention
                    </p>
                    <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: "15%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-2xl font-bold text-gray-800 dark:text-white">
                        {stats.pendingOrders}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Pending Orders
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Awaiting processing
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span>Need to ship</span>
                      <span className="text-blue-600 font-medium">
                        15 orders
                      </span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-2xl font-bold text-gray-800 dark:text-white">
                        {stats.completedOrders}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Completed Orders
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Successfully delivered
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <Truck size={14} className="text-green-500" />
                      <span className="text-xs text-gray-500">
                        Delivery rate: 94%
                      </span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Star className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="text-2xl font-bold text-gray-800 dark:text-white">
                        {stats.averageRating}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Average Rating
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Based on 2,345 reviews
                    </p>
                    <div className="mt-3 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={`${star <= Math.floor(stats.averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Charts Section - Enhanced */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {/* Weekly Sales Chart */}

                  {/* Weekly Sales Chart - Area Chart */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Sales Overview
                      </h2>
                      <select
                        className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white dark:bg-gray-700"
                        onChange={(e) =>
                          handleSalesPeriodChange(e.target.value)
                        }
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

                  {/* Donut Chart - Product Categories Distribution */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Category Distribution
                      </h2>
                      <div className="text-sm text-gray-500">
                        Total: {donutChart.series.reduce((a, b) => a + b, 0)}{" "}
                        products
                      </div>
                    </div>
                    <Chart
                      options={donutChart.options}
                      series={donutChart.series}
                      type="donut"
                      height={300}
                    />
                  </div>

                  {/* Top Products */}
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
                </div>

                {/* Recent Products and Activities Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Products - Enhanced */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          <Package size={20} className="text-blue-600" />
                          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Recent Products
                          </h2>
                        </div>
                        <Link
                          to="/products"
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                          View all <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {isLoading ? (
                        <div className="p-8 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                      ) : products.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <Package
                            size={40}
                            className="mx-auto mb-2 text-gray-300"
                          />
                          No products found
                        </div>
                      ) : (
                        products.slice(0, 4).map((product, idx) => (
                          <div
                            key={product._id}
                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                                  {product.image ? (
                                    <img
                                      src={`http://localhost:5000${product.image}`}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Package
                                      size={20}
                                      className="text-gray-400"
                                    />
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-800 dark:text-white text-sm group-hover:text-blue-600 transition-colors">
                                    {product.name}
                                  </h3>
                                  <p className="text-xs text-gray-400">
                                    ${product.price}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => openEditModal(product)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setShowDeleteModal(true);
                                  }}
                                  className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Recent Activities - Enhanced */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageCircle
                            size={20}
                            className="text-purple-600"
                          />
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
                      {recentActivities.map((activity, idx) => (
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
                                <span className="font-semibold">
                                  {activity.user}
                                </span>{" "}
                                {activity.action}{" "}
                                <span className="font-medium text-blue-600">
                                  {activity.target}
                                </span>
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-gray-400">
                                  {activity.time}
                                </p>
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
                </div>
              </>
            )}

            {/* Products Tab - Enhanced */}
            {activeTab === "Products" && (
              <div className="animate-fadeIn">
                {/* Products Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                      Products Management
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      Manage your product inventory
                    </p>
                  </div>
                  <button
                    onClick={openAddModal}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
                  >
                    <PlusCircle size={18} />
                    Add New Product
                  </button>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                          selectedCategory === category.id
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <Icon size={16} />
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            selectedCategory === category.id
                              ? "bg-white/20"
                              : "bg-gray-100 dark:bg-gray-700"
                          }`}
                        >
                          {category.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Filters Bar - Enhanced */}
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
                        <Filter size={14} />
                        Filters
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
                        className={`px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-1 ${
                          viewMode === "grid"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        <Grid size={14} /> Grid
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-1 ${
                          viewMode === "list"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        <List size={14} /> List
                      </button>
                    </div>
                  </div>

                  {/* Expanded Filters */}
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
                      {(keyword || minPrice || maxPrice) && (
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

                {/* Products Grid/List - Enhanced */}
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
                      Try adjusting your search or filters
                    </p>
                    <button
                      onClick={openAddModal}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all inline-flex items-center gap-2"
                    >
                      <PlusCircle size={18} />
                      Add your first product
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
                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                              Best Deal
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 dark:text-white mb-1 line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                            {product.description || "No description available"}
                          </p>
                          <div className="flex justify-between items-center mt-3">
                            <div>
                              <span className="text-xl font-bold text-blue-600">
                                ${product.price}
                              </span>
                              {product.oldPrice && (
                                <span className="text-xs text-gray-400 line-through ml-1">
                                  ${product.oldPrice}
                                </span>
                              )}
                            </div>
                            {/* <Link to={`/productDetail/${product._id}`}>
                              <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 group">
                                View Details 
                                <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            </Link> */}
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
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {product.description || "No description"}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
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

                {/* Pagination - Enhanced */}
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
                          className={`w-9 h-9 rounded-xl transition-all ${
                            page === pageNum
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                              : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
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

      {/* Delete Confirmation Modal - Enhanced */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scaleIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Delete Product
                </h3>
                <p className="text-sm text-gray-500">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">
                "{selectedProduct.name}"
              </span>
              ? All data associated with this product will be permanently
              removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedProduct._id)}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
