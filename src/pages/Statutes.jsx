import { statutes } from "../data/content";

export function Statutes() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Statuts de l'Association</h1>
          <p className="text-blue-100">Statuts adoptés et modifiés par assemblée générale extraordinaire le 18 Janvier 2025</p>
        </div>
      </section>

      {/* Statutes Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {statutes.articles.map((article, index) => (
              <div key={article.id} className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-600">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{article.number}</h2>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">{article.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{article.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 bg-blue-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Informations Importantes</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">•</span>
                <span>Siège social: <strong>Garoua, Cameroun</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">•</span>
                <span>Durée: <strong>Illimitée</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">•</span>
                <span>Statut: <strong>Association à but non lucratif</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">•</span>
                <span>Assemblée Générale: <strong>Tous les 3 ans</strong></span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
