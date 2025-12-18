import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Users, BookOpen, Calendar, TrendingUp, Award, Heart, Lightbulb, Briefcase } from 'lucide-react';

export default function Programs() {
  const programs = [
    {
      icon: Users,
      title: 'Accompagnement entrepreneurial',
      color: 'from-blue-600 to-blue-700',
      description: 'Support personnalisé pour faire grandir votre projet',
      features: [
        'Mentorat individuel par des entrepreneurs expérimentés',
        'Coaching personnalisé selon vos besoins',
        'Appui à la création et au développement d\'entreprise',
        'Conseils stratégiques pour votre croissance'
      ]
    },
    {
      icon: BookOpen,
      title: 'Formations & Ateliers',
      color: 'from-blue-600 to-blue-700',
      description: 'Développez vos compétences entrepreneuriales',
      features: [
        'Gestion financière et comptabilité',
        'Marketing digital et communication',
        'Leadership et management d\'équipe',
        'Fiscalité et aspects juridiques',
        'Business plan et levée de fonds',
        'Innovation et transformation digitale'
      ]
    },
    {
      icon: Calendar,
      title: 'Événements',
      color: 'from-blue-600 to-blue-700',
      description: 'Participez à nos rencontres et conférences',
      features: [
        'Conférences thématiques avec des experts',
        'Séminaires de renforcement des capacités',
        'Sessions de networking entre entrepreneurs',
        'Forums économiques régionaux',
        'Pitch sessions devant des investisseurs'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Opportunités',
      color: 'from-purple-500 to-purple-600',
      description: 'Accédez à des ressources et financements',
      features: [
        'Appels à projets et concours',
        'Mise en relation avec des financeurs',
        'Partenariats avec institutions publiques et privées',
        'Accès à des marchés et opportunités d\'affaires',
        'Subventions et programmes de financement'
      ]
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'Des programmes de haute qualité animés par des experts reconnus'
    },
    {
      icon: Heart,
      title: 'Personnalisation',
      description: 'Un accompagnement adapté à vos besoins spécifiques'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Des méthodes modernes et des outils à la pointe'
    },
    {
      icon: Briefcase,
      title: 'Praticité',
      description: 'Des formations concrètes directement applicables'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white py-20 overflow-hidden">
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
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Nos Programmes & Actions</h1>
            <p className="text-xl text-green-100">
              Des initiatives concrètes pour votre réussite entrepreneuriale
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nos quatre piliers d'action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un écosystème complet pour accompagner votre parcours entrepreneurial
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`h-2 bg-gradient-to-r ${program.color}`}></div>
                  
                  <div className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${program.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {program.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6">
                      {program.description}
                    </p>
                    
                    <ul className="space-y-3">
                      {program.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <div className={`w-6 h-6 bg-gradient-to-br ${program.color} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Notre approche
            </h2>
            <p className="text-xl text-gray-600">
              Ce qui rend nos programmes uniques
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-3xl p-12 lg:p-16 text-white shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Notre impact en chiffres
              </h2>
              <p className="text-green-100 text-lg">
                Des résultats concrets qui témoignent de notre engagement
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: '50+', label: 'Formations organisées' },
                { number: '200+', label: 'Entrepreneurs formés' },
                { number: '30+', label: 'Événements annuels' },
                { number: '100+', label: 'Projets accompagnés' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl lg:text-5xl font-bold text-amber-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-green-100">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Prêt à profiter de nos programmes ?
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Rejoignez Woila Community et accédez à tous nos services d'accompagnement
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={createPageUrl('Membership')}
                className="px-8 py-4 bg-gradient-to-r from-green-900 to-emerald-900 text-white rounded-xl font-semibold hover:from-green-800 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Devenir membre
              </Link>
              
              <Link
                to={createPageUrl('Contact')}
                className="px-8 py-4 bg-white text-green-900 border-2 border-green-900 rounded-xl font-semibold hover:bg-green-900 hover:text-white transition-all duration-300"
              >
                En savoir plus
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
