import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle, Upload, Users, TrendingUp, Award, Briefcase, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import CustomSelect from '@/components/ui/CustomSelect';

export default function Membership() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    structure: '',
    phone: '',
    email: '',
    activity_sector: '',
    city: '',
    payment_proof_url: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const queryClient = useQueryClient();

  const createMemberMutation = useMutation({
    mutationFn: (data) => base44.entities.Member.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      setIsSubmitted(true);
    }
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, payment_proof_url: file_url }));
    } catch (error) {
      alert('Erreur lors du téléchargement du fichier');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMemberMutation.mutate(formData);
  };

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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-12 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Candidature envoyée avec succès !
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Merci pour votre candidature à Woila Community. Notre équipe va examiner votre dossier et vous contactera très prochainement.
          </p>
          
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <p className="text-blue-900 font-medium">
              💡 Vous recevrez un email de confirmation à l'adresse : <strong>{formData.email}</strong>
            </p>
          </div>
          
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            Retour à l'accueil
          </Button>
        </motion.div>
      </div>
    );
  }

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
              <h2 className="text-3xl font-bold mb-2">Formulaire d'adhésion</h2>
              <p className="text-blue-100">Remplissez ce formulaire pour rejoindre notre communauté</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Prénom *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    required
                    placeholder="Votre prénom"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Nom *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    required
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="structure">Nom de votre entreprise / structure</Label>
                <Input
                  id="structure"
                  value={formData.structure}
                  onChange={(e) => setFormData({...formData, structure: e.target.value})}
                  placeholder="Ex: Woila SARL"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    placeholder="votre@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                    placeholder="+237 6XX XXX XXX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity_sector">Domaine d'activité</Label>
                <Input
                  id="activity_sector"
                  value={formData.activity_sector}
                  onChange={(e) => setFormData({...formData, activity_sector: e.target.value})}
                  placeholder="Ex: Commerce, Agriculture, Services, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ville *</Label>
                <CustomSelect
                  value={formData.city}
                  onValueChange={(value) => setFormData({...formData, city: value})}
                  placeholder="Sélectionnez votre ville"
                  options={['Garoua', 'Maroua', "N'Gaoundéré"]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_proof">Justificatif de paiement de la cotisation</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 transition-colors">
                  <input
                    id="payment_proof"
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf"
                  />
                  <label
                    htmlFor="payment_proof"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <span className="text-sm text-gray-600 text-center">
                      {isUploading
                        ? 'Téléchargement en cours...'
                        : formData.payment_proof_url
                        ? '✓ Fichier téléchargé'
                        : 'Cliquez pour télécharger le justificatif'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="font-bold text-amber-900 mb-2">Conditions d'adhésion</h3>
                <ul className="text-sm text-amber-800 space-y-2">
                  <li className="flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Être entrepreneur, porteur de projet ou professionnel</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Être à jour de la cotisation annuelle</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Adhérer aux valeurs de Woila Community</span>
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={createMemberMutation.isPending || isUploading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {createMemberMutation.isPending ? 'Envoi en cours...' : 'Envoyer ma candidature'}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
