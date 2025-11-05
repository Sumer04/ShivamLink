"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function CategoryPage() {
  const { id } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  // Fetch products by category
  useEffect(() => {
    if (!id) return;
    const fetchProducts = async () => {
      setLoading(true);
      const res = await fetch(`/api/product?categoryId=${id}`);
      const data = await res.json();

      if (Array.isArray(data)) setProducts(data);
      else setProducts([]);

      // Try to get category name from first product
      if (data.length > 0 && data[0].category?.name) {
        setCategoryName(data[0].category.name);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [id]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* HEADER */}
      <header className="bg-black text-white py-6 shadow-md text-center">
        <h1 className="text-3xl font-bold">
          {categoryName || "Category Products"}
        </h1>
        <p className="text-gray-400 mt-1">
          Explore the latest collection from {categoryName || "this category"}.
        </p>
      </header>

      {/* PRODUCTS GRID */}
      <main className="p-6">
        {products.length === 0 ? (
          <p className="text-center text-gray-600 mt-20 text-lg">
            No products available in this category.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.slice(0, visibleCount).map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Image */}
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl.replace(
                      "/upload/",
                      "/upload/f_auto/"
                    )}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="object-cover w-full h-64"
                    priority={false}
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                {/* Name */}
                <div className="p-4 text-center">
                  <p className="font-semibold text-gray-800 truncate">
                    {product.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LOAD MORE BUTTON */}
        {visibleCount < products.length && (
          <div className="text-center mt-10">
            <button
              onClick={handleLoadMore}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all"
            >
              Load More
            </button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-black text-white mt-12 py-8 text-center">
        <p className="text-lg font-semibold">📍 Address</p>
        <p className="text-gray-300">
          Santhusapet near Raghvendra Hotel, Bangalore
        </p>
        <p className="text-gray-300 mt-2">
          📞 +8088482570, 8217254696
        </p>
        <p className="text-gray-500 text-sm mt-3">
          © {new Date().getFullYear()} Shivam Garment — All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
