import { organization } from "../data/content";

export function About() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">À Propos</h1>
          <p className="text-blue-100">Découvrez qui nous sommes et ce que nous faisons</p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Qui Sommes-Nous?</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {organization.name} est un réseau d'entrepreneurs du Septentrion du Cameroun, 
                composé de chefs d'entreprises, de créateurs d'entreprise, d'artisans et de porteurs de projets.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Fondée en {organization.founded}, notre communauté fonctionne en réseau pour mettre en œuvre 
                des programmes communs de développement tout en conservant l'autonomie de chaque organisation membre.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Nos activités couvrent les régions de Maroua, Garoua et N'Gaoundéré, avec un siège social basé à Garoua.
              </p>
            </div>

            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Notre Mission</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Soutenir et dynamiser l'entrepreneuriat en offrant aux jeunes chefs d'entreprises, 
                créateurs et porteurs de projets un environnement propice à leur développement.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nos Valeurs</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span className="text-gray-700">Solidarité et entraide</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span className="text-gray-700">Innovation entrepreneuriale</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span className="text-gray-700">Développement durable</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span className="text-gray-700">Transparence et intégrité</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Notre Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg text-center shadow">
              <div className="text-4xl font-bold text-blue-600 mb-2">3</div>
              <p className="text-gray-700">Régions couvertes</p>
            </div>
            <div className="bg-white p-8 rounded-lg text-center shadow">
              <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
              <p className="text-gray-700">Entreprises membres</p>
            </div>
            <div className="bg-white p-8 rounded-lg text-center shadow">
              <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <p className="text-gray-700">Emplois créés</p>
            </div>
            <div className="bg-white p-8 rounded-lg text-center shadow">
              <div className="text-4xl font-bold text-blue-600 mb-2">50</div>
              <p className="text-gray-700">Événements annuels</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
