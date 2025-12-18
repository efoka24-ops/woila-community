import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, Briefcase, CheckSquare, ChevronDown, ChevronUp } from 'lucide-react';

export default function Organization() {
  const [expandedSection, setExpandedSection] = useState(null);

  const organs = [
    {
      id: 'ag',
      icon: Users,
      title: 'Assemblée Générale',
      color: 'from-blue-600 to-blue-700',
      role: 'Organe suprême',
      description: 'Organe suprême de décision, l\'Assemblée Générale se réunit tous les 3 ans et regroupe tous les membres de l\'association.',
      responsibilities: [
        'Valide les comptes annuels',
        'Approuve le budget prévisionnel',
        'Examine les rapports d\'activités',
        'Définit les orientations stratégiques',
        'Élit les membres du Bureau Exécutif',
        'Modifie les statuts si nécessaire'
      ]
    },
    {
      id: 'cd',
      icon: Building2,
      title: 'Comité Directeur',
      color: 'from-blue-600 to-blue-700',
      role: 'Instance de direction',
      description: 'Instance de direction entre deux assemblées générales, composée d\'un représentant par structure membre.',
      responsibilities: [
        'Assure le pilotage stratégique',
        'Supervise l\'exécution des décisions',
        'Valide les projets et programmes',
        'Facilite la coordination entre structures',
        'Prend les décisions importantes entre les AG'
      ]
    },
    {
      id: 'be',
      icon: Briefcase,
      title: 'Bureau Exécutif',
      color: 'from-blue-600 to-blue-700',
      role: 'Gestion quotidienne',
      description: 'Élu pour 3 ans, le Bureau Exécutif assure la gestion quotidienne et l\'exécution des décisions prises.',
      composition: [
        'Coordonnateur général',
        'Coordonnateur adjoint',
        'Secrétaire général',
        'Secrétaire général adjoint',
        'Trésorier général',
        'Trésorier général adjoint',
        'Présidents de commissions'
      ],
      responsibilities: [
        'Gestion administrative et financière',
        'Exécution des décisions du Comité Directeur',
        'Pilotage des projets et programmes',
        'Représentation de l\'association',
        'Suivi des activités quotidiennes',
        'Coordination des commissions techniques'
      ]
    },
    {
      id: 'ca',
      icon: CheckSquare,
      title: 'Conseil d\'Administration',
      color: 'from-purple-500 to-purple-600',
      role: 'Supervision stratégique',
      description: 'Supervise la stratégie globale et veille à la bonne gouvernance de l\'association.',
      responsibilities: [
        'Supervise la stratégie générale',
        'Valide les grandes orientations',
        'Suit la mise en œuvre des actions',
        'Contrôle la gouvernance',
        'Évalue les performances',
        'Assure la transparence financière'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Organisation & Gouvernance</h1>
            <p className="text-xl text-purple-100">
              Une structure solide pour une action efficace
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xl text-gray-700 leading-relaxed">
              Woila Community s'appuie sur une <strong className="text-purple-900">gouvernance démocratique et participative</strong> qui garantit la représentation de tous les membres et l'efficacité de nos actions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Organization Chart */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nos organes de gouvernance
            </h2>
            <p className="text-xl text-gray-600">
              Quatre instances complémentaires pour une action coordonnée
            </p>
          </motion.div>

          <div className="space-y-6">
            {organs.map((organ, index) => {
              const Icon = organ.icon;
              const isExpanded = expandedSection === organ.id;
              
              return (
                <motion.div
                  key={organ.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <button
                    onClick={() => setExpandedSection(isExpanded ? null : organ.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${organ.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-gray-900">{organ.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{organ.role}</p>
                      </div>
                    </div>
                    
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-100 p-6 bg-gray-50"
                    >
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {organ.description}
                      </p>

                      {organ.composition && (
                        <div className="mb-6">
                          <h4 className="font-bold text-gray-900 mb-3">Composition :</h4>
                          <ul className="grid md:grid-cols-2 gap-3">
                            {organ.composition.map((member, idx) => (
                              <li key={idx} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-gray-700">{member}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Responsabilités :</h4>
                        <ul className="space-y-2">
                          {organ.responsibilities.map((responsibility, idx) => (
                            <li key={idx} className="flex items-start space-x-3">
                              <div className={`w-6 h-6 bg-gradient-to-br ${organ.color} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                <span className="text-white text-xs font-bold">✓</span>
                              </div>
                              <span className="text-gray-700">{responsibility}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Governance Principles */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nos principes de gouvernance
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Transparence', desc: 'Communication claire et ouverte sur toutes nos actions' },
              { title: 'Démocratie', desc: 'Participation active de tous les membres aux décisions' },
              { title: 'Efficacité', desc: 'Optimisation des ressources et des processus' },
              { title: 'Redevabilité', desc: 'Responsabilité et reddition de comptes régulière' }
            ].map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3">{principle.title}</h3>
                <p className="text-gray-600">{principle.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
