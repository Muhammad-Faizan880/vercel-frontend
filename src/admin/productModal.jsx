import React, { useState, useEffect } from "react";
import { Package, X } from "lucide-react";
import axios from "../api/axios";
import toast from "react-hot-toast";

// Category and Subcategory options
const categories = [
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

const ProductModal = ({ isOpen, onClose, productToEdit, onSuccess, token }) => {
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Product basic info
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
    category: "",
    subcategory: "",
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
      category: "",
      subcategory: "",
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

      if (product.name) {
        setForm({
          name: product.name,
          description: product.description || "",
          price: product.price,
          image: null,
          category: product.category || "",
          subcategory: product.subcategory || "",
        });

        if (product.image) {
          setExistingImage(product.image);
          setPreview(`http://localhost:5000${product.image}`);
        }

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
        const response = await axios.get(`/products/${product._id || product}`);
        const productData = response.data;

        setForm({
          name: productData.name,
          description: productData.description || "",
          price: productData.price,
          image: null,
          category: productData.category || "",
          subcategory: productData.subcategory || "",
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

  const getSubcategories = () => {
    const selectedCategory = categories.find((cat) => cat.id === form.category);
    return selectedCategory ? selectedCategory.subcategories : [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, description, price, image, category, subcategory } = form;

    if (!name || !description || !price) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!subcategory) {
      toast.error("Please select a subcategory");
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
      formData.append("category", category);
      formData.append("subcategory", subcategory);

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
      onSuccess();
      onClose();
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
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Basic Information
                </h3>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={(e) => {
                        handleChange(e);
                        setForm((prev) => ({ ...prev, subcategory: "" }));
                      }}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subcategory *
                    </label>
                    <select
                      name="subcategory"
                      value={form.subcategory}
                      onChange={handleChange}
                      disabled={!form.category}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    >
                      <option value="">Select Subcategory</option>
                      {getSubcategories().map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
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

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Sizes & Colors
                </h3>

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

export default ProductModal;