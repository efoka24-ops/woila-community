import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
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

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.filter({ published: true }, 'date', 100)
  });

  const filteredEvents = events.filter(event => {
    const cityMatch = selectedCity === 'all' || event.city === selectedCity;
    const categoryMatch = selectedCategory === 'all' || event.category === selectedCategory;
    return cityMatch && categoryMatch;
  });

  const categoryColors = {
    'Formation': 'bg-green-100 text-green-800',
    'Networking': 'bg-blue-100 text-blue-800',
    'Conférence': 'bg-purple-100 text-purple-800',
    'Atelier': 'bg-amber-100 text-amber-800',
    'Autre': 'bg-gray-100 text-gray-800'
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day) => {
    return filteredEvents.filter(event => isSameDay(new Date(event.date), day));
  };

  const upcomingEvents = filteredEvents
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 6);

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
                            className={`text-xs p-1 rounded truncate ${categoryColors[event.category]}`}
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
              {isLoading ? (
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
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
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

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && viewMode === 'calendar' && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Prochains événements</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex flex-col items-center justify-center text-white">
                      <span className="text-2xl font-bold">{format(new Date(event.date), 'd')}</span>
                      <span className="text-xs uppercase">{format(new Date(event.date), 'MMM', { locale: fr })}</span>
                    </div>
                    <div className="flex-1">
                      <Badge className={`${categoryColors[event.category]} mb-2`}>
                        {event.category}
                      </Badge>
                      <h3 className="font-bold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {event.city}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
