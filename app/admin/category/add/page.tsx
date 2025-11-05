"use client";

import { useState } from "react";

export default function AddCategory() {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter a category name");

    await fetch("/api/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    alert("Category added successfully");
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Add New Category
        </h2>

        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-md mb-4 focus:outline-none"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800"
        >
          Add Category
        </button>
      </form>
    </div>
  );
}
