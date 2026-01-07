# 📧 Guide d'Intégration Email - Service d'Envoi

## 🚀 Implémentation Future

Le système actuel queued les emails dans `notifications.json`. Voici comment intégrer un vrai service d'email.

---

## 📋 Options Disponibles

### **1. SendGrid (Recommandé)**
- Prix: Gratuit (100 emails/jour) → $15/mois
- Fiabilité: ⭐⭐⭐⭐⭐
- Support: Excellent
- Documentation: Très complète

### **2. Mailgun**
- Prix: Gratuit (10k emails/mois) → $35/mois
- Fiabilité: ⭐⭐⭐⭐⭐
- Support: Bon
- Documentation: Complète

### **3. Gmail SMTP**
- Prix: Gratuit (pour petits volumes)
- Fiabilité: ⭐⭐⭐
- Support: Communauté
- Limite: 500 emails/jour

### **4. Brevo (ex-Sendinblue)**
- Prix: Gratuit (300 emails/jour) → $20/mois
- Fiabilité: ⭐⭐⭐⭐
- Support: Bon
- Documentation: Complète

---

## 🔧 Implémentation avec SendGrid

### **Étape 1: Installation**

```bash
npm install @sendgrid/mail
```

### **Étape 2: Fichier de Configuration**

Créez `backend/config/email.js`:

```javascript
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email, subject, message) => {
  try {
    const msg = {
      to: email,
      from: process.env.SENDER_EMAIL || 'noreply@woila.com',
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0066cc; color: white; padding: 20px; text-align: center;">
            <h1>Woila Community</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <div style="background-color: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p>&copy; 2026 Woila Community. Tous droits réservés.</p>
          </div>
        </div>
      `,
      text: message
    };

    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('Erreur SendGrid:', error);
    throw error;
  }
};

module.exports = { sendEmail };
```

### **Étape 3: Fichier .env**

Ajoutez à `backend/.env`:

```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDER_EMAIL=noreply@woila.com
```

### **Étape 4: Service de Notification**

Créez `backend/services/emailService.js`:

```javascript
const { readJSON, writeJSON } = require('../middleware/jsonDb');
const { sendEmail } = require('../config/email');

class EmailService {
  static async sendPendingNotifications() {
    try {
      const data = readJSON('notifications.json');
      const pending = data.notifications.filter(n => n.status === 'pending');

      for (const notification of pending) {
        try {
          // Envoyer l'email
          await sendEmail(
            notification.email,
            notification.subject,
            notification.message
          );

          // Marquer comme envoyé
          notification.status = 'sent';
          notification.sentAt = new Date().toISOString();
        } catch (error) {
          console.error(`Erreur envoi email ${notification.email}:`, error);
          notification.status = 'failed';
          notification.error = error.message;
        }
      }

      // Sauvegarder
      writeJSON('notifications.json', data);
      console.log(`${pending.length} emails traités`);
    } catch (error) {
      console.error('Erreur EmailService:', error);
    }
  }
}

module.exports = EmailService;
```

### **Étape 5: Cronjob pour Envoi**

Modifiez `backend/index.js`:

```javascript
const EmailService = require('./services/emailService');

// Envoyer les emails toutes les 5 minutes
setInterval(() => {
  EmailService.sendPendingNotifications();
}, 5 * 60 * 1000);

// Ou manuellement
app.post('/api/admin/send-pending-emails', (req, res) => {
  EmailService.sendPendingNotifications();
  res.json({ message: 'Emails en cours d\'envoi...' });
});
```

---

## 🔧 Implémentation avec Mailgun

### **Étape 1: Installation**

```bash
npm install mailgun.js
```

### **Étape 2: Configuration**

Créez `backend/config/mailgun.js`:

```javascript
const mailgun = require('mailgun.js');
const FormData = require('form-data');

const mg = new mailgun(FormData);
const mailgunClient = mg.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY
});

const sendEmail = async (email, subject, message) => {
  try {
    const result = await mailgunClient.messages.create(
      process.env.MAILGUN_DOMAIN,
      {
        from: `Woila Community <noreply@${process.env.MAILGUN_DOMAIN}>`,
        to: email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #0066cc; color: white; padding: 20px;">
              <h1>Woila Community</h1>
            </div>
            <div style="padding: 30px;">
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
        `,
        text: message
      }
    );
    return { success: true, id: result.id };
  } catch (error) {
    console.error('Erreur Mailgun:', error);
    throw error;
  }
};

module.exports = { sendEmail };
```

---

## 🔧 Implémentation avec Gmail SMTP

### **Étape 1: Installation**

```bash
npm install nodemailer
```

### **Étape 2: Configuration**

Créez `backend/config/gmail.js`:

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD // App password, not regular password
  }
});

const sendEmail = async (email, subject, message) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>Woila Community</h2>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
      text: message
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erreur Gmail:', error);
    throw error;
  }
};

module.exports = { sendEmail };
```

### **Étape 3: .env**

```env
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
```

---

## 📊 Statuts d'Email

### **Structure de Notification Complète**

```json
{
  "id": "notif_123",
  "type": "membership_approval",
  "email": "user@example.com",
  "firstName": "Emmanuel",
  "lastName": "Foka",
  "subject": "Bienvenue à Woila Community!",
  "message": "...",
  "status": "pending",
  "createdAt": "2026-01-07T12:35:00.000Z",
  "sentAt": "2026-01-07T12:36:00.000Z",
  "deliveredAt": "2026-01-07T12:36:15.000Z",
  "bounced": false,
  "error": null,
  "trackingId": "sg-abc123"
}
```

### **Statuts Possibles**

| Statut | Signification | Action |
|--------|---------------|--------|
| `pending` | En attente d'envoi | Envoyer |
| `sent` | Envoyé au serveur | Attendre confirmation |
| `delivered` | Livré au serveur mail | ✅ Succès |
| `bounced` | Adresse invalide | Notifier admin |
| `failed` | Erreur temporaire | Réessayer plus tard |
| `complained` | Utilisateur s'est plaint | Retirer liste |

---

## 🔄 Workflow d'Envoi

### **Flux Recommandé**

```
1. Admin approuve demande
   ↓
2. Notification créée avec status="pending"
   ↓
3. EmailService.sendPendingNotifications() runs
   ↓
4. Email envoyé via SendGrid/Mailgun
   ↓
5. Statut mis à jour en "sent"
   ↓
6. Webhooks SendGrid/Mailgun confirment livraison
   ↓
7. Statut mis à jour en "delivered"
```

---

## 🪝 Webhooks pour Tracking

### **Exemple avec SendGrid**

Créez `backend/routes/webhooks.js`:

```javascript
const express = require('express');
const router = express.Router();
const { readJSON, writeJSON } = require('../middleware/jsonDb');

router.post('/sendgrid', (req, res) => {
  const events = req.body;

  for (const event of events) {
    const data = readJSON('notifications.json');
    const notification = data.notifications.find(n => n.trackingId === event.sg_message_id);

    if (notification) {
      if (event.event === 'delivered') {
        notification.status = 'delivered';
        notification.deliveredAt = new Date(event.timestamp * 1000).toISOString();
      } else if (event.event === 'bounce') {
        notification.status = 'bounced';
        notification.bounced = true;
      } else if (event.event === 'click') {
        notification.clickedAt = new Date(event.timestamp * 1000).toISOString();
      }

      writeJSON('notifications.json', data);
    }
  }

  res.status(200).send('OK');
});

module.exports = router;
```

---

## 📋 Templates d'Email

### **Template Approbation**

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #0066cc 0%, #004499 100%); color: white; padding: 30px; text-align: center;">
    <h1 style="margin: 0;">✓ Bienvenue à Woila Community!</h1>
  </div>
  
  <div style="padding: 30px; background-color: #f9f9f9;">
    <p>Bonjour {{firstName}},</p>
    <p>Nous sommes ravi de vous accueillir dans la communauté Woila Community!</p>
    
    <div style="background: white; padding: 20px; border-left: 4px solid #0066cc; margin: 20px 0;">
      <h3>Prochaines étapes:</h3>
      <ol>
        <li>Consultez nos ressources d'adhésion</li>
        <li>Rejoignez notre groupe WhatsApp</li>
        <li>Assistez à notre prochain événement</li>
      </ol>
    </div>
    
    <a href="http://localhost:5173" style="display: inline-block; background-color: #0066cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Accéder au portail</a>
  </div>
  
  <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666;">
    <p>&copy; 2026 Woila Community. Tous droits réservés.</p>
  </div>
</div>
```

### **Template Rejet**

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #cc3300; color: white; padding: 30px; text-align: center;">
    <h1 style="margin: 0;">Demande d'inscription</h1>
  </div>
  
  <div style="padding: 30px;">
    <p>Bonjour {{firstName}},</p>
    <p>Merci pour votre intérêt envers Woila Community.</p>
    
    <p>Malheureusement, nous ne pouvons pas traiter votre demande pour le moment:</p>
    <p style="color: #cc3300; font-weight: bold;">Raison: {{rejectionReason}}</p>
    
    <p>{{customMessage}}</p>
    
    <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
  </div>
</div>
```

---

## 🧪 Test d'Email

### **Test Local avec MailHog**

```bash
# Installer MailHog
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog

# Configuration .env
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=

# Accéder à l'interface
http://localhost:8025
```

---

## 📊 Dashboard de Notifications

### **Nouveau Endpoint Admin**

```javascript
// GET /api/admin/notifications
router.get('/notifications', auth, (req, res) => {
  const data = readJSON('notifications.json');
  const stats = {
    total: data.notifications.length,
    pending: data.notifications.filter(n => n.status === 'pending').length,
    sent: data.notifications.filter(n => n.status === 'sent').length,
    delivered: data.notifications.filter(n => n.status === 'delivered').length,
    failed: data.notifications.filter(n => n.status === 'failed').length,
    bounced: data.notifications.filter(n => n.bounced).length
  };
  res.json(stats);
});
```

---

## ✅ Checklist d'Implémentation Email

- [ ] Choisir un service (SendGrid/Mailgun/Gmail)
- [ ] Créer un compte et obtenir les clés API
- [ ] Installer la dépendance npm
- [ ] Créer le fichier config
- [ ] Ajouter les variables .env
- [ ] Créer EmailService
- [ ] Ajouter cronjob d'envoi
- [ ] Tester l'envoi manuel
- [ ] Configurer les webhooks
- [ ] Créer un dashboard de notifications
- [ ] Documenter les processus
- [ ] Former l'équipe admin

---

**Le système actuel est prêt à recevoir cette intégration email! 🚀**
