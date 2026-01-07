import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CustomSelect from '@/components/ui/CustomSelect';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Events() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('calendar');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrationForm, setRegistrationForm] = useState({ firstName: '', lastName: '', email: '' });
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events');
        const data = await response.json();
        // Filter only published events for frontend view
        const publishedEvents = Array.isArray(data) ? data.filter(e => e.published !== false) : [];
        setEvents(publishedEvents);
      } catch (err) {
        console.error('Erreur lors du chargement des événements:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const cityMatch = selectedCity === 'all' || event.city === selectedCity || event.location === selectedCity;
    const categoryMatch = selectedCategory === 'all' || event.category === selectedCategory;
    return cityMatch && categoryMatch;
  });

  const categoryColors = {
    'Formation': 'bg-green-100 text-green-800',
    'Training': 'bg-green-100 text-green-800',
    'Networking': 'bg-blue-100 text-blue-800',
    'Conférence': 'bg-purple-100 text-purple-800',
    'Conference': 'bg-purple-100 text-purple-800',
    'Atelier': 'bg-amber-100 text-amber-800',
    'Workshop': 'bg-amber-100 text-amber-800',
    'Autre': 'bg-gray-100 text-gray-800',
    'Other': 'bg-gray-100 text-gray-800'
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day) => {
    return filteredEvents.filter(event => isSameDay(new Date(event.date), day));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setRegistrationLoading(true);
    setRegistrationMessage('');

    try {
      const response = await fetch(`http://localhost:5000/api/events/${selectedEvent.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      setRegistrationMessage('✅ Inscription réussie!');
      setRegistrationForm({ firstName: '', lastName: '', email: '' });
      
      setTimeout(() => {
        setSelectedEvent(null);
        setRegistrationMessage('');
      }, 2000);
    } catch (err) {
      setRegistrationMessage(`❌ ${err.message}`);
    } finally {
      setRegistrationLoading(false);
    }
  };

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
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Calendrier des Événements</h1>
            <p className="text-xl text-indigo-100">
              Découvrez nos formations, ateliers et rencontres à venir
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <CustomSelect
                value={selectedCity}
                onValueChange={setSelectedCity}
                placeholder="Ville"
                options={['all', 'Garoua', 'Maroua', "N'Gaoundéré"]}
              />

              <CustomSelect
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                placeholder="Catégorie"
                options={['all', 'Formation', 'Networking', 'Conférence', 'Atelier', 'Autre']}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setViewMode('calendar')}
                className={`${viewMode === 'calendar' ? 'bg-indigo-900' : 'bg-gray-200 text-gray-900'}`}
              >
                Calendrier
              </Button>
              <Button
                onClick={() => setViewMode('list')}
                className={`${viewMode === 'list' ? 'bg-indigo-900' : 'bg-gray-200 text-gray-900'}`}
              >
                Liste
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {viewMode === 'calendar' ? (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <h2 className="text-2xl font-bold capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                  </h2>
                  
                  <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 bg-gray-50 border-b">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                  <div key={day} className="p-4 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {/* Empty cells for days before month start */}
                {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-24 p-2 border-b border-r bg-gray-50"></div>
                ))}
                
                {days.map((day, dayIdx) => {
                  const dayEvents = getEventsForDay(day);
                  const isToday = isSameDay(day, new Date());
                  
                  return (
                    <div
                      key={day.toISOString()}
                      className={`min-h-24 p-2 border-b border-r ${isToday ? 'bg-indigo-50' : ''}`}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity ${categoryColors[event.category]}`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 2} autres
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))
              ) : filteredEvents.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl text-gray-600">Aucun événement prévu</p>
                </div>
              ) : (
                filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedEvent(event)}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                  >
                    {event.image_url ? (
                      <div className="relative h-48">
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className={categoryColors[event.category]}>
                            {event.category}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-32 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-white/50" />
                        <div className="absolute top-4 left-4">
                          <Badge className={categoryColors[event.category]}>
                            {event.category}
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-indigo-600" />
                          <span>{format(new Date(event.date), 'EEEE d MMMM yyyy', { locale: fr })}</span>
                        </div>
                        
                        {event.time && (
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-indigo-600" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-indigo-600" />
                          <span>{event.location || event.city}</span>
                        </div>
                      </div>
                      
                      {event.description && (
                        <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="relative h-64 bg-gradient-to-br from-indigo-500 to-purple-600">
              {selectedEvent.image_url && (
                <img
                  src={selectedEvent.image_url}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              )}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
              >
                ✕
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/30 p-6">
                <Badge className={`${categoryColors[selectedEvent.category]} mb-4`}>
                  {selectedEvent.category}
                </Badge>
                <h1 className="text-3xl font-bold text-white">{selectedEvent.title}</h1>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <Calendar className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-gray-900">
                      {format(new Date(selectedEvent.date), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Lieu</p>
                    <p className="font-semibold text-gray-900">{selectedEvent.location || selectedEvent.city}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedEvent.description && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedEvent.description}</p>
                </div>
              )}

              {/* Capacity */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-600">Places disponibles</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {Math.max(0, selectedEvent.capacity - (selectedEvent.registrations?.length || 0))} / {selectedEvent.capacity}
                </p>
              </div>

              {/* Registration Form */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-gray-900 mb-4">S'inscrire à cet événement</h3>
                
                {registrationMessage && (
                  <div className={`mb-4 p-3 rounded-lg ${
                    registrationMessage.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {registrationMessage}
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Prénom"
                      value={registrationForm.firstName}
                      onChange={(e) => setRegistrationForm({ ...registrationForm, firstName: e.target.value })}
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Nom"
                      value={registrationForm.lastName}
                      onChange={(e) => setRegistrationForm({ ...registrationForm, lastName: e.target.value })}
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={registrationForm.email}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={registrationLoading || selectedEvent.capacity <= (selectedEvent.registrations?.length || 0)}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {registrationLoading ? 'Inscription en cours...' : 
                     selectedEvent.capacity <= (selectedEvent.registrations?.length || 0) ? '❌ Places complètes' :
                     'S\'inscrire'}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
