import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Award, Briefcase, ArrowRight } from 'lucide-react';

export default function Membership() {
  const navigate = useNavigate();

  const advantages = [
    {
      icon: Users,
      title: 'Accès au réseau',
      description: 'Connectez-vous avec 200+ entrepreneurs du Septentrion'
    },
    {
      icon: TrendingUp,
      title: 'Opportunités',
      description: 'Accès privilégié aux appels à projets et financements'
    },
    {
      icon: Award,
      title: 'Formations',
      description: 'Participez gratuitement à nos formations et ateliers'
    },
    {
      icon: Briefcase,
      title: 'Accompagnement',
      description: 'Bénéficiez d\'un mentorat et coaching personnalisé'
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
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Devenir Membre</h1>
            <p className="text-xl text-blue-100">
              Rejoignez la plus grande communauté d'entrepreneurs du Septentrion
            </p>
          </motion.div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Avantages membres
            </h2>
            <p className="text-xl text-gray-600">
              Développez votre activité avec notre écosystème complet
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{advantage.title}</h3>
                  <p className="text-gray-600">{advantage.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Demander votre adhésion</h2>
              <p className="text-blue-100">Remplissez le formulaire pour rejoindre notre communauté</p>
            </div>

            <div className="p-12 text-center">
              <p className="text-gray-600 mb-8 text-lg">
                Cliquez sur le bouton ci-dessous pour accéder au formulaire d'inscription complet.
              </p>
              <button
                onClick={() => navigate('/membership/register')}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Accéder au formulaire d'inscription</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="mt-12 bg-blue-50 rounded-xl p-8">
                <h3 className="text-xl font-bold text-blue-900 mb-6">Processus d'adhésion</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg mx-auto mb-4">1</div>
                    <h4 className="font-semibold text-gray-900 mb-2">Formulaire</h4>
                    <p className="text-gray-600 text-sm">Remplissez vos informations personnelles</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg mx-auto mb-4">2</div>
                    <h4 className="font-semibold text-gray-900 mb-2">Vérification</h4>
                    <p className="text-gray-600 text-sm">Notre équipe vérifie vos documents</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg mx-auto mb-4">3</div>
                    <h4 className="font-semibold text-gray-900 mb-2">Confirmation</h4>
                    <p className="text-gray-600 text-sm">Recevez votre confirmation par email</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
