"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories and products
  const fetchData = async () => {
    setLoading(true);
    const [catRes, prodRes] = await Promise.all([
      fetch("/api/category"),
      fetch("/api/product"),
    ]);
    const catData = await catRes.json();
    const prodData = await prodRes.json();
    setCategories(catData);
    setProducts(prodData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete category or product
  const handleDelete = async (id: string, type: "category" | "product") => {
    const confirmDelete = confirm(`Are you sure to delete this ${type}?`);
    if (!confirmDelete) return;

    await fetch(`/api/${type}?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-black">
        🛍️ Shivam Garment Admin
      </h1>

      {/* CATEGORY SECTION */}
      <section className="bg-white rounded-xl shadow-md p-6 mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Categories</h2>
          <button
            onClick={() => window.location.href = "/admin/category/add"}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            + Add Category
          </button>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">{cat.name}</td>
                <td className="py-2 px-3 text-right">
                  <button
                    onClick={() => window.location.href = `/admin/category/edit/${cat.id}`}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, "category")}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* PRODUCT SECTION */}
      <section className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Products</h2>
          <button
            onClick={() => window.location.href = "/admin/product/add"}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            + Add Product
          </button>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 px-3">Image</th>
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Price</th>
              <th className="py-2 px-3">Category</th>
              <th className="py-2 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">
                  {prod.imageUrl ? (
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-2 px-3">{prod.name}</td>
                <td className="py-2 px-3">₹{prod.price}</td>
                <td className="py-2 px-3">{prod.category?.name || "—"}</td>
                <td className="py-2 px-3 text-right">
                  <button
                    onClick={() => window.location.href = `/admin/product/edit/${prod.id}`}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id, "product")}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
