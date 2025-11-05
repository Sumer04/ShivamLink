"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/category");
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      {/* 🏷️ Header */}
      <header className="bg-black text-white py-6 shadow-lg">
        <h1 className="text-4xl font-extrabold text-center tracking-wide">
          Shivam Garment
        </h1>
        <p className="text-center text-gray-300 mt-2">
          Fashion That Speaks Your Style
        </p>
      </header>

      {/* 🛍️ Intro */}
      <section className="text-center py-10 px-4">
        <h2 className="text-3xl font-semibold mb-3 text-gray-800">
          Welcome to Shivam Garment
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Discover the latest trends in fashion for men and women. From stylish
          T-shirts to cozy jackets — all under one roof. Click below to explore
          your favorite categories and find what suits your style best.
        </p>
      </section>

      {/* 🗂️ Categories */}
      <section className="flex-grow">
        <h3 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Shop by Category
        </h3>
        <div className="flex flex-wrap justify-center gap-6 px-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all text-lg font-medium shadow-md hover:scale-105"
            >
              {cat.name}
            </Link>
          ))}

          {categories.length === 0 && (
            <p className="text-gray-500 text-center">
              No categories available yet.
            </p>
          )}
        </div>
      </section>

      {/* 📍 Footer */}
      <footer className="bg-black text-white mt-12 py-8 text-center">
        <p className="text-lg font-semibold">📍 Address</p>
        <p className="text-gray-300">
          santhusapet near raghvendra hotel banglore
        </p>
        <p className="text-gray-300 mt-2">
          📞 Mobile: <span className="font-medium">+8088482570,8217254696</span>
        </p>
        <p className="text-gray-500 text-sm mt-3">
          © {new Date().getFullYear()} Shivam Garment — All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
