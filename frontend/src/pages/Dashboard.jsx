import React from "react";
import { useEffect, useState, useContext } from "react";
import { apiRequest } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import AddProduct from "./AddProduct";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [saleQty, setSaleQty] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await fetchDashboard();
      await fetchProducts();
    } catch (error) {
      console.error(error.message);
      if (error.message === "Token invalid") {
        logout();
      }
    }
  };

  const fetchDashboard = async () => {
    const data = await apiRequest("/dashboard/summary");
    setSummary(data);
  };

  const fetchProducts = async () => {
    const data = await apiRequest("/products");
    setProducts(data);
  };

  /* 🔄 UPDATE PRODUCT (stock / price) */
  const updateProduct = async (id, updates) => {
    try {
      await apiRequest(`/products/${id}`, "PUT", updates);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ❌ DELETE PRODUCT */
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await apiRequest(`/products/${id}`, "DELETE");
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  /* 💰 RECORD SALE */
  const recordSale = async (productId) => {
    try {
      await apiRequest("/sales", "POST", {
        productId,
        quantitySold: Number(saleQty[productId] || 1),
      });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!summary) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {user?.shopName} Dashboard
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Total Products" value={summary.totalProducts} />
        <Card title="Low Stock" value={summary.lowStock} danger />
        <Card title="Today Sales" value={summary.todaySales} />
        <Card title="Total Profit" value={`₹${summary.totalProfit}`} />
      </div>

      {/* ADD PRODUCT */}
      <AddProduct onAdded={loadData} />

      {/* PRODUCTS TABLE */}
      <div className="bg-white shadow rounded-lg mt-8 p-6">
        <h2 className="text-xl font-semibold mb-4">Products</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="pb-2 text-left">Name</th>
                <th className="pb-2">Stock</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b last:border-none">
                  <td className="py-3">{p.name}</td>

                  {/* STOCK EDIT */}
                  <td className="py-3">
                    <input
                      type="number"
                      defaultValue={p.quantity}
                      className="w-20 border rounded px-2 py-1"
                      onBlur={(e) =>
                        updateProduct(p._id, {
                          quantity: Number(e.target.value),
                        })
                      }
                    />
                  </td>

                  {/* PRICE EDIT */}
                  <td className="py-3">
                    <input
                      type="number"
                      defaultValue={p.sellingPrice}
                      className="w-20 border rounded px-2 py-1"
                      onBlur={(e) =>
                        updateProduct(p._id, {
                          sellingPrice: Number(e.target.value),
                        })
                      }
                    />
                  </td>

                  {/* ACTIONS */}
                  <td className="py-3 flex gap-2">
                    <input
                      type="number"
                      min="1"
                      className="w-16 border rounded px-2 py-1"
                      onChange={(e) =>
                        setSaleQty({
                          ...saleQty,
                          [p._id]: e.target.value,
                        })
                      }
                    />

                    <button
                      onClick={() => recordSale(p._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Sell
                    </button>

                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* 🔹 CARD COMPONENT */
const Card = ({ title, value, danger }) => (
  <div
    className={`bg-white shadow rounded-lg p-6 text-center ${danger ? "border border-red-400" : ""
      }`}
  >
    <p className="text-gray-500">{title}</p>
    <h2
      className={`text-2xl font-bold mt-2 ${danger ? "text-red-500" : "text-gray-800"
        }`}
    >
      {value}
    </h2>
  </div>
);

export default Dashboard;
