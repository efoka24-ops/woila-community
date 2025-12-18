import ContactMessage from '../models/ContactMessage.js';

export const createMessage = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, subject, message } = req.body;

    const contactMessage = new ContactMessage({
      first_name,
      last_name,
      email,
      phone,
      subject,
      message
    });

    await contactMessage.save();

    res.status(201).json({ 
      message: 'Message envoyé avec succès. Nous vous répondrons bientôt.',
      id: contactMessage._id 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;

    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const replyMessage = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const { reply } = req.body;
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { 
        reply, 
        status: 'replied',
        replied_at: new Date()
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    res.json({ message: 'Réponse envoyée', contact_message: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
