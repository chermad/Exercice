export default function Exercice1() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">MonSite</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600">Accueil</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Portfolio</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 bg-gray-100 flex flex-col justify-center items-center text-center p-6">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
          Bienvenue sur ma Landing Page
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-6">
          Découvrez mon portfolio et mes projets réalisés avec passion en Next.js et Tailwind CSS.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700">
          Voir mon portfolio
        </button>
      </section>

      {/* Portfolio Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">Projet 1</h3>
          <p className="text-gray-600">Description brève du projet.</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">Projet 2</h3>
          <p className="text-gray-600">Description brève du projet.</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">Projet 3</h3>
          <p className="text-gray-600">Description brève du projet.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p>&copy; 2025 MonSite. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
