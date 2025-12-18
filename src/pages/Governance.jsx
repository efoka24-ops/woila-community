import { governance, bureauExecutif } from "../data/content";

export function Governance() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Gouvernance</h1>
          <p className="text-blue-100">Structure organisationnelle de l'association</p>
        </div>
      </section>

      {/* Organes Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Organes de Direction</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {governance.map((organ, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-lg p-3 flex-shrink-0">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{organ.role}</h3>
                    <p className="text-gray-700 mb-3">{organ.description}</p>
                    <p className="text-sm text-blue-600 font-semibold">Fréquence: {organ.frequency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bureau Exécutif Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Bureau Exécutif</h2>
          <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
            Le Bureau Exécutif est composé de membres élus par le Comité Directeur pour une durée de 3 ans renouvelables.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bureauExecutif.map((member, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-l-4 border-blue-600">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{member.role}</h3>
                <p className="text-gray-700 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organigramme */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Hiérarchie Organisationnelle</h2>
          
          <div className="flex flex-col items-center space-y-6">
            {/* AG */}
            <div className="bg-blue-600 text-white rounded-lg p-6 w-full md:w-96 text-center font-bold">
              Assemblée Générale
            </div>
            
            <div className="text-2xl">↓</div>
            
            {/* Comité Directeur */}
            <div className="bg-blue-400 text-white rounded-lg p-6 w-full md:w-96 text-center font-bold">
              Comité Directeur
            </div>
            
            <div className="text-2xl">↓</div>
            
            {/* Bureau Exécutif */}
            <div className="bg-blue-300 text-white rounded-lg p-6 w-full md:w-96 text-center font-bold">
              Bureau Exécutif
            </div>
            
            <div className="text-2xl">↓</div>
            
            {/* Commissions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <div className="bg-blue-200 text-gray-900 rounded-lg p-4 text-center font-semibold">Commissions Techniques</div>
              <div className="bg-blue-200 text-gray-900 rounded-lg p-4 text-center font-semibold">Comités ad hoc</div>
              <div className="bg-blue-200 text-gray-900 rounded-lg p-4 text-center font-semibold">Groupes de Travail</div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualifications */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Qualifications Requises</h2>
          
          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Pour les membres du Bureau Exécutif:</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">✓</span>
                <span>Être de nationalité Camerounaise</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">✓</span>
                <span>Être ressortissant du Septentrion</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">✓</span>
                <span>Être âgé d'au moins 18 ans</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">✓</span>
                <span>Être entrepreneur, créateur ou porteur de projet</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">✓</span>
                <span>Être à jour de ses cotisations</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
