import React from "react";
import { useState } from "react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔴 Frontend validation
    if (
      !form.name ||
      !form.buyingPrice ||
      !form.sellingPrice ||
      !form.quantity
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await apiRequest("/products", "POST", {
        name: form.name.trim(),
        category: form.category?.trim(),
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
      alert(err.message);
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <h2 className="col-span-full text-xl font-semibold">Add Product</h2>

      {["name", "category", "buyingPrice", "sellingPrice", "quantity", "minStock"].map(
        (field) => (
          <input
            key={field}
            placeholder={field}
            className="border rounded px-3 py-2"
            value={form[field]}
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
          />
        )
      )}

      <button
        className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Add Product
      </button>
    </form>
  );
};

export default AddProduct;
