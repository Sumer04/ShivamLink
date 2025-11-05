"use client";

import { useEffect, useState } from "react";

export default function AddProduct() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    fetch("/api/category")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("categoryId", categoryId);
    if (image) formData.append("image", image);

    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    alert("Product added successfully");
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Add New Product
        </h2>

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-md mb-4 focus:outline-none"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-md mb-4 focus:outline-none"
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-md mb-4"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full border border-gray-300 p-3 rounded-md mb-4"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
