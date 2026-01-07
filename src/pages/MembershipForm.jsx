import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle } from 'lucide-react';

export default function MembershipForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    structure: '',
    activitySector: '',
    city: '',
    paymentProofUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  const cities = [
    'Yaoundé',
    'Douala',
    'Buea',
    'Bamenda',
    'Kribi',
    'Garoua',
    'N\'Gaoundéré',
    'Bafoussam',
    'Édéa',
    'Kumba',
    'Autre'
  ];

  const activitySectors = [
    'Technologie',
    'Entrepreneuriat',
    'Finance',
    'Commerce',
    'Éducation',
    'Santé',
    'Agriculture',
    'Immobilier',
    'Consultance',
    'Autre'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          paymentProofUrl: event.target.result
        }));
        setFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation - check for empty strings
    const firstName = (formData.firstName || '').trim();
    const lastName = (formData.lastName || '').trim();
    const email = (formData.email || '').trim();
    const phone = (formData.phone || '').trim();
    const city = (formData.city || '').trim();

    if (!firstName) {
      setError('Prénom requis');
      setLoading(false);
      return;
    }

    if (!lastName) {
      setError('Nom requis');
      setLoading(false);
      return;
    }

    if (!email) {
      setError('Email requis');
      setLoading(false);
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Email invalide');
      setLoading(false);
      return;
    }

    if (!phone) {
      setError('Téléphone requis');
      setLoading(false);
      return;
    }

    if (!city) {
      setError('Ville requise');
      setLoading(false);
      return;
    }

    // Prepare data to send with trimmed values
    const dataToSend = {
      firstName,
      lastName,
      email,
      phone,
      structure: (formData.structure || '').trim(),
      activitySector: (formData.activitySector || '').trim(),
      city,
      paymentProofUrl: formData.paymentProofUrl || ''
    };

    try {
      console.log('Sending membership request:', dataToSend);
      
      const response = await fetch('http://localhost:5000/api/membership-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Erreur lors de la soumission');
      }

      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        structure: '',
        activitySector: '',
        city: '',
        paymentProofUrl: ''
      });
      setFile(null);

      // Rediriger après 3 secondes
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rejoindre Woila Community</h1>
          <p className="text-gray-600 mb-8">Veuillez remplir ce formulaire pour soumettre votre demande d'inscription</p>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">✓ Demande d'inscription soumise avec succès! Vous serez redirigé vers l'accueil...</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre nom"
                  disabled={loading}
                />
              </div>

              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre prénom"
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="votre@email.com"
                  disabled={loading}
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+237..."
                  disabled={loading}
                />
              </div>

              {/* Structure */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Structure</label>
                <input
                  type="text"
                  name="structure"
                  value={formData.structure}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom de votre entreprise/structure"
                  disabled={loading}
                />
              </div>

              {/* Secteur d'activité */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secteur d'activité</label>
                <select
                  name="activitySector"
                  value={formData.activitySector}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="">Sélectionner...</option>
                  {activitySectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>

              {/* Ville */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="">Sélectionner votre ville</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preuve de paiement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preuve de paiement</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="payment-file"
                  disabled={loading}
                />
                <label htmlFor="payment-file" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {file ? file.name : 'Cliquez pour télécharger ou glissez-déposez votre fichier'}
                  </span>
                </label>
              </div>
            </div>

            {/* Bouton Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Envoi en cours...' : 'Soumettre ma demande'}
            </button>

            <p className="text-sm text-gray-600 text-center">
              * Champs obligatoires
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
