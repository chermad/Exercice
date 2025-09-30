"use client";
import { useState, useEffect } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // --- états pour le formulaire ---
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    description: "",
    inStock: true,
    rating: 0,
    brand: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Erreur lors du chargement des produits");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) throw new Error("Erreur lors de l’ajout du produit");
      const data = await res.json();

      setProducts([...products, { id: data.id, ...newProduct }]);
      setShowModal(false); // ferme la fenêtre
      setNewProduct({
        name: "",
        category: "",
        price: "",
        image: "",
        description: "",
        inStock: true,
        rating: 0,
        brand: "",
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const categories = ["all", "ordinateurs", "smartphones", "accessoires", "audio", "gaming"];

  const filteredProducts = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filter === "all" || p.category === filter;
    return matchName && matchCategory;
  });

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Liste des Produits</h1>

      {/* --- bouton pour ouvrir la fenêtre --- */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          ➕ Ajouter un produit
        </button>
      </div>

      {/* --- fenêtre modale --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">
            <h2 className="text-xl font-semibold mb-4">Ajouter un produit</h2>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <input
                type="text"
                placeholder="Nom du produit"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full"
                required
              />
              <input
                type="text"
                placeholder="Catégorie"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full"
                required
              />
              <input
                type="number"
                placeholder="Prix (€)"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                className="border rounded-lg px-3 py-2 w-full"
                required
              />
              <input
                type="text"
                placeholder="Marque"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full"
              />
              <input
                type="text"
                placeholder="Lien de l’image"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full"
              />
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newProduct.inStock}
                  onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                />
                En stock
              </label>

              {/* boutons en bas */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  OK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- recherche --- */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/3 shadow-sm focus:ring focus:ring-blue-300"
        />
      </div>

      {/* --- filtres --- */}
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

      {/* --- liste produits --- */}
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
    </div>
  );
}
