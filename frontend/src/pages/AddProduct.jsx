import React, { useState } from "react";
import { apiRequest } from "../services/api";

const AddProduct = ({ onAdded }) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    buyingPrice: "",
    sellingPrice: "",
    quantity: "",
    minStock: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Frontend validation
    if (
      !form.name ||
      !form.buyingPrice ||
      !form.sellingPrice ||
      !form.quantity
    ) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      await apiRequest("/products", "POST", {
        name: form.name.trim(),
        category: form.category.trim(),
        buyingPrice: Number(form.buyingPrice),
        sellingPrice: Number(form.sellingPrice),
        quantity: Number(form.quantity),
        minStock: form.minStock ? Number(form.minStock) : undefined,
      });

      onAdded();
      setForm({
        name: "",
        category: "",
        buyingPrice: "",
        sellingPrice: "",
        quantity: "",
        minStock: "",
      });
    } catch (err) {
      setError(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <h2 className="col-span-full text-2xl font-bold text-gray-800">
        Add Product
      </h2>

      {/* Error */}
      {error && (
        <div className="col-span-full text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Product Name *
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="iPhone 15"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Category
        </label>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Electronics"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Buying Price */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Buying Price *
        </label>
        <input
          type="number"
          name="buyingPrice"
          value={form.buyingPrice}
          onChange={handleChange}
          placeholder="50000"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Selling Price */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Selling Price *
        </label>
        <input
          type="number"
          name="sellingPrice"
          value={form.sellingPrice}
          onChange={handleChange}
          placeholder="60000"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Quantity *
        </label>
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="10"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Min Stock */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Minimum Stock
        </label>
        <input
          type="number"
          name="minStock"
          value={form.minStock}
          onChange={handleChange}
          placeholder="2"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className={`col-span-full mt-2 py-2.5 rounded-lg text-white font-semibold transition
          ${loading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};

export default AddProduct;
