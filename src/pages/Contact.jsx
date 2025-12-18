import { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to a backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Nous Contacter</h1>
          <p className="text-blue-100">Nous serions heureux de vous entendre</p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-4xl text-blue-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.26.559.738 1.399 1.498 2.058.75.63 1.6 1.073 2.34 1.073.196 0 .385-.016.57-.05l1.487-.26a1 1 0 01.992.766l1.353 6.122a1 1 0 01-.71 1.189l-1.85.325a2 2 0 01-.889-.135 9.999 9.999 0 01-7.975-7.975 2 2 0 01-.135-.889l.325-1.85a1 1 0 01.766-.992l.26-1.487a1 1 0 01-.05-.57V3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Téléphone</h3>
              <p className="text-gray-700">+237 XXX XX XX XX</p>
              <p className="text-gray-600 text-sm mt-2">Lundi-Vendredi 8h-17h</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-4xl text-blue-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-700">info@woila-community.cm</p>
              <p className="text-gray-600 text-sm mt-2">Réponse sous 24h</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-4xl text-blue-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Adresse</h3>
              <p className="text-gray-700">Garoua, Cameroun</p>
              <p className="text-gray-600 text-sm mt-2">Siège Social</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Formulaire de Contact</h2>
              
              {submitted && (
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-6">
                  ✓ Merci! Votre message a été envoyé avec succès.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nom Complet</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder="votre.email@exemple.cm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder="+237 XXX XX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Sujet</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder="Sujet de votre message"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder="Votre message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Envoyer le Message
                </button>
              </form>
            </div>

            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Nos Régions d'Activité</h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-bold text-gray-900 mb-2">Maroua</h4>
                  <p className="text-gray-700 text-sm">Centre entrepreneur du Région de l'Extrême-Nord</p>
                </div>

                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-bold text-gray-900 mb-2">Garoua</h4>
                  <p className="text-gray-700 text-sm">Siège social - Centre principal de coordination</p>
                </div>

                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-bold text-gray-900 mb-2">N'Gaoundéré</h4>
                  <p className="text-gray-700 text-sm">Centre entrepreneur du Région de l'Adamaoua</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Heures d'Ouverture</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex justify-between">
                    <span>Lundi - Vendredi:</span>
                    <strong>8:00 - 17:00</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Samedi:</span>
                    <strong>9:00 - 13:00</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Dimanche:</span>
                    <strong>Fermé</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
