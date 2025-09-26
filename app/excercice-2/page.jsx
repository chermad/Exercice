"use client";
import { useState } from "react";

const products = [
  // ---- ORDINATEURS ----
  {
    id: 1,
    name: "MacBook Pro 16\"",
    category: "ordinateurs",
    price: 2499,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=400&fit=crop",
    description: "MacBook Pro avec puce M3 Pro, 16 GB RAM, 512 GB SSD.",
    inStock: true,
    rating: 4.8,
    brand: "Apple",
  },
  {
    id: 2,
    name: "Dell XPS 13",
    category: "ordinateurs",
    price: 1299,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop",
    description: "Ultrabook premium avec écran InfinityEdge, Intel Core i7.",
    inStock: true,
    rating: 4.6,
    brand: "Dell",
  },
  {
    id: 5,
    name: "iPhone 15 Pro",
    category: "smartphones",
    price: 1199,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=400&fit=crop",
    description: "iPhone 15 Pro avec puce A17 Pro, caméra 48MP, design titane.",
    inStock: true,
    rating: 4.7,
    brand: "Apple",
  },
  {
    id: 9,
    name: "Magic Mouse",
    category: "accessoires",
    price: 79,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=400&fit=crop",
    description: "Souris Apple Magic Mouse avec surface Multi-Touch.",
    inStock: true,
    rating: 4.2,
    brand: "Apple",
  },
  {
    id: 13,
    name: "AirPods Pro 2",
    category: "audio",
    price: 249,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=400&fit=crop",
    description: "Écouteurs sans fil avec réduction de bruit active.",
    inStock: true,
    rating: 4.6,
    brand: "Apple",
  },
  {
    id: 17,
    name: "PlayStation 5",
    category: "gaming",
    price: 499,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=400&fit=crop",
    description: "Console de nouvelle génération avec SSD ultra-rapide.",
    inStock: false,
    rating: 4.9,
    brand: "Sony",
  },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const categories = ["all", "ordinateurs", "smartphones", "accessoires", "audio", "gaming"];

  const filteredProducts = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filter === "all" || p.category === filter;
    return matchName && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Liste des Produits</h1>

      {/* Barre de recherche */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/3 shadow-sm focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Filtres par catégorie */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full border transition ${
              filter === cat
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Liste des produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition flex flex-col"
          >
            <img
              src={product.image}
              alt={product.name}
              className="rounded-lg mb-4 h-48 object-cover"
            />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-500">{product.brand}</p>
            <p className="text-gray-700 mt-2 line-clamp-2">{product.description}</p>
            <p className="text-blue-600 font-bold mt-3">{product.price} €</p>
            <p
              className={`mt-1 text-sm ${
                product.inStock ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.inStock ? "En stock" : "Rupture"}
            </p>
          </div>
        ))}
      </div>

      {/* Cas si aucun produit */}
      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          Aucun produit trouvé pour cette recherche.
        </p>
      )}
    </div>
  );
}
