import Event from '../models/Event.js';

export const getAllEvents = async (req, res) => {
  try {
    const { city, category } = req.query;
    let filter = { published: true };

    if (city) filter.city = city;
    if (category) filter.category = category;

    const events = await Event.find(filter)
      .populate('organizer', 'first_name last_name email')
      .sort({ date: 1 })
      .limit(100);

    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'first_name last_name email phone');

    if (!event) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    res.json({ event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, start_time, end_time, location, city, category, image_url, capacity } = req.body;

    const event = new Event({
      title,
      description,
      date,
      start_time,
      end_time,
      location,
      city,
      category,
      image_url,
      capacity,
      organizer: req.user.id,
      published: req.user.role === 'admin'
    });

    await event.save();
    await event.populate('organizer', 'first_name last_name');

    res.status(201).json({ message: 'Événement créé', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    Object.assign(event, req.body);
    await event.save();

    res.json({ message: 'Événement mis à jour', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Événement supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
