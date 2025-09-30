"use client";
import { useState, useEffect } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState(["all"]); 
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

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

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products"); 
        if (!res.ok) throw new Error("Erreur lors du chargement des produits");
        const data = await res.json();
        setProducts(data);
        
        const uniqueCategories = [
          "all", 
          ...new Set(data.map((p) => p.category).filter(Boolean)), 
        ];
        setCategories(uniqueCategories);
        
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
      const newProductWithId = { id: data.id, ...newProduct };

      setProducts((prevProducts) => [...prevProducts, newProductWithId]);
      if (!categories.includes(newProduct.category)) {
        setCategories((prevCategories) => [...prevCategories, newProduct.category]);
      }

      setShowModal(false); 
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
  
  const filteredProducts = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filter === "all" || p.category === filter;
    return matchName && matchCategory;
  });

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50"> 
      
      {/* HEADER FIXE */}
      <header className="
        flex justify-center items-center h-16 
        bg-white shadow-md sticky top-0 z-20 
        border-b border-gray-100 
      ">
          
          {/* 1. BOUTON D'AJOUT : Responsive (Petit sur mobile, large sur desktop) */}
          <button
              onClick={() => setShowModal(true)}
              className={`
                  absolute top-0 left-0 h-full 
                  px-4 /* Padding réduit sur mobile */
                  md:px-6 /* Padding normal sur desktop */
                  py-0 
                  border-r border-b border-white/50
                  transition font-semibold whitespace-nowrap
                  
                  /* Style */
                  bg-blue-600 text-white hover:bg-blue-700
                  
                  /* Coins */
                  rounded-none rounded-br-xl shadow-lg
              `}
          >
              {/* Le signe PLUS est toujours visible */}
              ➕ 
              {/* 🛠️ MODIFICATION CLÉ : Le texte est caché par défaut (mobile) et affiché à partir de 'md' 🛠️ */}
              <span className="hidden md:inline ml-1">
                  Ajouter un produit
              </span>
          </button>
          
          {/* 2. TITRE PRINCIPAL (Centré) */}
          <h1 className="text-2xl font-bold text-gray-800"> 
              Liste des Produits
          </h1>

          {/* Placeholder à droite */}
          <div className="absolute top-0 right-0 h-full w-20"></div>
      </header>
      
      {/* ------------------------------------------------------------------------- */}

      
      {/* Contenu principal de la page */}
      <div className="py-10 px-4 max-w-7xl mx-auto">
      
        {/* --- fenêtre modale --- */}
        {showModal && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.75)] flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">
              <h2 className="text-xl font-semibold mb-4">Ajouter un produit</h2>
              <form onSubmit={handleAddProduct} className="space-y-3">
                
                {/* Champs du formulaire */}
                <input type="text" name="name" placeholder="Nom du produit" value={newProduct.name} onChange={handleFormChange} className="border rounded-lg px-3 py-2 w-full" required />
                <input type="text" name="category" placeholder="Catégorie" value={newProduct.category} onChange={handleFormChange} className="border rounded-lg px-3 py-2 w-full" required />
                <input type="number" name="price" placeholder="Prix (€)" value={newProduct.price} onChange={handleFormChange} className="border rounded-lg px-3 py-2 w-full" required />
                <input type="text" name="brand" placeholder="Marque" value={newProduct.brand} onChange={handleFormChange} className="border rounded-lg px-3 py-2 w-full" />
                <input type="text" name="image" placeholder="Lien de l’image" value={newProduct.image} onChange={handleFormChange} className="border rounded-lg px-3 py-2 w-full" />
                <textarea name="description" placeholder="Description" value={newProduct.description} onChange={handleFormChange} className="border rounded-lg px-3 py-2 w-full" />
                
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="inStock" checked={newProduct.inStock} onChange={handleFormChange} />
                  En stock
                </label>

                {/* boutons en bas de la modale */}
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400">Annuler</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">OK</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- recherche, filtres, et liste produits (inchangés) --- */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6 pt-4">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full md:w-1/3 shadow-sm focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full border transition font-medium ${
                filter === cat
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat === "all" ? "Tous" : cat.charAt(0).toUpperCase() + cat.slice(1)} 
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition flex flex-col"
            >
              <img
                src={product.image}
                alt={product.name}
                className="rounded-lg mb-4 w-full h-[400px] object-cover" 
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
    </div>
  );
}