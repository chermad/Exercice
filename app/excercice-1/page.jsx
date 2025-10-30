import { getServices } from '@/lib/strapi';

// Fonction pour extraire le texte du Rich Text
function extractTextFromRichText(richText) {
  if (!richText) return '';
  if (typeof richText === 'string') return richText;
  
  if (Array.isArray(richText)) {
    return richText.map(block => {
      if (block.children) {
        return block.children.map(child => child.text || '').join('');
      }
      return '';
    }).join(' ');
  }
  
  return '';
}

export default async function Exercice1() {
  let services = [];
  
  try {
    const servicesData = await getServices();
    services = servicesData.data || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    services = [];
  }

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
        {/* Projet 1 */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">{services[0]?.icon || "🚀"}</div>
            <h3 className="font-bold text-lg">{services[0]?.title || "Développement Web"}</h3>
          </div>
          
          <div className="mb-4 bg-gray-200 h-40 rounded-lg flex items-center justify-center">
            {services[0]?.image?.url ? (
              <img 
                src={`${process.env.STRAPI_URL}${services[0].image.url}`}
                alt={services[0]?.title || "Projet"}
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-500">Image du projet</span>
            )}
          </div>
          
          <p className="text-gray-600">
            {extractTextFromRichText(services[0]?.description) || "Création de sites web modernes et responsives."}
          </p>
        </div>

        {/* Projet 2 */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">{services[1]?.icon || "🌐"}</div>
            <h3 className="font-bold text-lg">{services[1]?.title || "Design UI/UX"}</h3>
          </div>
          
          <div className="mb-4 bg-gray-200 h-40 rounded-lg flex items-center justify-center">
            {services[1]?.image?.url ? (
              <img 
                src={`${process.env.STRAPI_URL}${services[1].image.url}`}
                alt={services[1]?.title || "Projet"}
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-500">Image du projet</span>
            )}
          </div>
          
          <p className="text-gray-600">
            {extractTextFromRichText(services[1]?.description) || "Conception d'interfaces utilisateur intuitives et esthétiques."}
          </p>
        </div>

        {/* Projet 3 */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">{services[2]?.icon || "💻"}</div>
            <h3 className="font-bold text-lg">{services[2]?.title || "Applications Mobile"}</h3>
          </div>
          
          <div className="mb-4 bg-gray-200 h-40 rounded-lg flex items-center justify-center">
            {services[2]?.image?.url ? (
              <img 
                src={`${process.env.STRAPI_URL}${services[2].image.url}`}
                alt={services[2]?.title || "Projet"}
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-500">Image du projet</span>
            )}
          </div>
          
          <p className="text-gray-600">
            {extractTextFromRichText(services[2]?.description) || "Développement d'applications mobiles cross-platform."}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p>&copy; 2025 MonSite. Tous droits réservés.</p>
      </footer>
    </div>
  );
}