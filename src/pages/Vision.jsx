import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Eye, Target, Compass, TrendingUp, Users, Award, Briefcase, Globe } from 'lucide-react';

export default function Vision() {
  const objectives = [
    'Accompagner et mettre en réseau les jeunes entrepreneurs',
    'Élaborer des stratégies communes pour renforcer l\'impact économique',
    'Défendre les intérêts des membres auprès des pouvoirs publics',
    'Promouvoir les échanges, la coopération et les bonnes pratiques',
    'Diffuser des informations utiles sur les opportunités d\'affaires',
    'Encourager l\'insertion socio-économique des jeunes',
    'Créer une plateforme d\'intervention commune entre acteurs économiques'
  ];

  const missions = [
    {
      icon: Users,
      title: 'Soutenir les jeunes entrepreneurs',
      description: 'Accompagnement personnalisé et mentorat pour chaque porteur de projet'
    },
    {
      icon: Briefcase,
      title: 'Favoriser la création d\'entreprises',
      description: 'Faciliter l\'accès aux ressources nécessaires pour démarrer son activité'
    },
    {
      icon: Award,
      title: 'Renforcer les capacités',
      description: 'Formations continues pour développer les compétences entrepreneuriales'
    },
    {
      icon: TrendingUp,
      title: 'Faciliter l\'accès aux financements',
      description: 'Mise en relation avec les bailleurs et institutions financières'
    },
    {
      icon: Globe,
      title: 'Stimuler les initiatives régionales',
      description: 'Encourager le développement économique du Septentrion'
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
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Vision, Mission & Objectifs</h1>
            <p className="text-xl text-amber-50">
              Notre feuille de route pour transformer le Septentrion
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 lg:p-12">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Notre Vision
                </h2>
                
                <p className="text-xl text-gray-700 leading-relaxed font-medium">
                  Promouvoir un écosystème entrepreneurial <span className="text-amber-600">fort, innovant et solidaire</span> dans le Septentrion.
                </p>
                
                <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
                  <p className="text-gray-600 leading-relaxed">
                    Nous imaginons un Septentrion où chaque entrepreneur dispose des outils, des ressources et du soutien nécessaires pour réussir et contribuer au développement économique de sa région.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                alt="Vision"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Notre Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cinq piliers pour soutenir l'entrepreneuriat dans le Septentrion
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {missions.map((mission, index) => {
              const Icon = mission.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {mission.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {mission.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl mb-6">
              <Compass className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nos Objectifs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des actions concrètes pour atteindre notre mission
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {objectives.map((objective, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700 leading-relaxed font-medium">
                  {objective}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Partagez-vous notre vision ?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Rejoignez-nous pour construire ensemble un avenir entrepreneurial prospère
            </p>
            
            <Link
              to={createPageUrl('Membership')}
              className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Devenir membre
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
