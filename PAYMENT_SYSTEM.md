# 💳 Guide: Système de Paiement (Stripe + OM/MOMO)

## 🏗️ Architecture Paiement

```
Frontend (React)
    ↓
Backend (Express)
    ↓
Stripe API ← ou → OM/MOMO Gateway
    ↓
Database (JSON)
```

---

## 📦 Installation

```bash
npm install stripe
npm install dotenv
```

---

## 🔑 Configuration des Clés API

**Dans** `backend/.env`:
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# OM/MOMO (Orange Money)
MOMO_API_URL=https://api.orangemoney.com
MOMO_API_KEY=your_api_key
MOMO_API_SECRET=your_api_secret
MOMO_OPERATOR_ID=your_operator_id
```

---

## 💳 STRIPE INTEGRATION

### 1. **Créer Contrôleur Paiement**

**Créer**: `backend/controllers/paymentController.js`

```javascript
import Stripe from 'stripe';
import { readJSON, writeJSON } from '../middleware/jsonDb.js';
import { v4 as uuidv4 } from 'uuid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const MEMBERS_FILE = 'backend/data/members.json';
const PAYMENTS_FILE = 'backend/data/payments.json';

// ===== CREATE PAYMENT SESSION =====
export const createPaymentSession = async (req, res) => {
  try {
    const { memberId, amount, email, firstName, lastName } = req.body;

    if (!amount || amount < 500) {
      return res.status(400).json({
        success: false,
        message: 'Montant invalide (minimum 500 XAF)'
      });
    }

    // Créer session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'xof', // West African Franc
            product_data: {
              name: 'Adhésion WOILA Community',
              description: `Adhésion pour ${firstName} ${lastName}`
            },
            unit_amount: amount * 100 // Stripe utilise les centimes
          },
          quantity: 1
        }
      ],
      customer_email: email,
      metadata: {
        memberId,
        firstName,
        lastName,
        email
      },
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancelled`
    });

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        clientSecret: session.client_secret,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
      }
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur création session paiement'
    });
  }
};

// ===== VERIFY PAYMENT =====
export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Récupérer session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Paiement non confirmé'
      });
    }

    // Mettre à jour le membre
    const members = await readJSON(MEMBERS_FILE);
    const memberIndex = members.findIndex(
      m => m.id === session.metadata.memberId
    );

    if (memberIndex !== -1) {
      members[memberIndex].paid = true;
      members[memberIndex].paidAt = new Date().toISOString();
      members[memberIndex].paymentMethod = 'stripe';
      members[memberIndex].paymentReference = sessionId;
      await writeJSON(MEMBERS_FILE, members);
    }

    // Enregistrer le paiement
    const payments = await readJSON(PAYMENTS_FILE) || [];
    payments.push({
      id: `payment_${uuidv4()}`,
      memberId: session.metadata.memberId,
      amount: session.amount_total / 100,
      currency: session.currency,
      method: 'stripe',
      status: 'completed',
      stripeSessionId: sessionId,
      createdAt: new Date().toISOString()
    });
    await writeJSON(PAYMENTS_FILE, payments);

    res.json({
      success: true,
      message: 'Paiement confirmé!',
      data: members[memberIndex]
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur vérification paiement'
    });
  }
};

// ===== WEBHOOK STRIPE =====
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed', err.message);
    return res.sendStatus(400);
  }

  // Gérer les événements
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment completed:', session.id);
      // Logique supplémentaire si nécessaire
      break;
    
    case 'charge.refunded':
      const charge = event.data.object;
      console.log('Payment refunded:', charge.id);
      // Mettre à jour statut refund
      break;
  }

  res.sendStatus(200);
};

// ===== GET PAYMENT HISTORY =====
export const getPayments = async (req, res) => {
  try {
    const payments = await readJSON(PAYMENTS_FILE);
    
    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur récupération paiements'
    });
  }
};
```

### 2. **Créer Routes Paiement**

**Créer**: `backend/routes/paymentRoutes.js`

```javascript
import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  createPaymentSession,
  verifyPayment,
  stripeWebhook,
  getPayments
} from '../controllers/paymentController.js';

const router = express.Router();

// PUBLIC
router.post('/session', createPaymentSession);
router.get('/verify/:sessionId', verifyPayment);

// AUTH required
router.get('/', auth, getPayments);

// Webhook (ne pas utiliser auth middleware)
router.post('/webhook', stripeWebhook);

export default router;
```

### 3. **Ajouter dans** `backend/index.js`

```javascript
import paymentRoutes from './routes/paymentRoutes.js';

// ...

// Routes
app.use('/api/payments', paymentRoutes);
```

### 4. **Frontend: Intégration Stripe**

**Installation**:
```bash
npm install @stripe/react-stripe-js @stripe/js
```

**Composant Paiement**: `src/components/PaymentForm.jsx`

```javascript
import { loadStripe } from '@stripe/js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiCall, API_ENDPOINTS } from '../config/api.js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function PaymentForm({ memberId, amount, email, firstName, lastName }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateSession = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/api/payments/session', {
        method: 'POST',
        body: JSON.stringify({
          memberId,
          amount,
          email,
          firstName,
          lastName
        })
      });

      setSession(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <button 
        onClick={handleCreateSession}
        disabled={loading}
      >
        {loading ? 'Traitement...' : 'Payer avec Stripe'}
      </button>

      {session && (
        <StripeCheckout sessionId={session.sessionId} />
      )}
    </Elements>
  );
}

function StripeCheckout({ sessionId }) {
  const stripe = useStripe();

  const handleCheckout = async () => {
    await stripe.redirectToCheckout({ sessionId });
  };

  return <button onClick={handleCheckout}>Procéder au paiement</button>;
}
```

---

## 📱 OM/MOMO INTEGRATION (Orange Money)

### 1. **Créer Contrôleur OM/MOMO**

```javascript
// backend/controllers/momoController.js
import axios from 'axios';
import { readJSON, writeJSON } from '../middleware/jsonDb.js';
import { v4 as uuidv4 } from 'uuid';

const PAYMENTS_FILE = 'backend/data/payments.json';

// ===== CREATE MOMO PAYMENT =====
export const createMomoPayment = async (req, res) => {
  try {
    const { amount, phoneNumber, externalId, email } = req.body;

    // Validation
    if (!amount || amount < 500) {
      return res.status(400).json({
        success: false,
        message: 'Montant invalide'
      });
    }

    if (!phoneNumber || phoneNumber.length < 9) {
      return res.status(400).json({
        success: false,
        message: 'Numéro invalide'
      });
    }

    // Créer demande paiement OM
    const momoRequest = {
      amount: amount,
      currency: 'XOF',
      externalId: externalId || `payment_${uuidv4()}`,
      payer: {
        partyIdType: 'MSISDN',
        partyId: phoneNumber
      },
      payerMessage: 'Adhésion WOILA Community',
      payeeNote: `Adhésion pour ${email}`
    };

    // Appeler API OM
    const momoResponse = await axios.post(
      `${process.env.MOMO_API_URL}/v1/requesttopay`,
      momoRequest,
      {
        headers: {
          'Authorization': `Bearer ${process.env.MOMO_API_KEY}`,
          'X-Reference-Id': externalId,
          'Content-Type': 'application/json'
        }
      }
    );

    // Enregistrer paiement
    const payments = await readJSON(PAYMENTS_FILE) || [];
    payments.push({
      id: externalId,
      amount,
      currency: 'XOF',
      method: 'orange_money',
      status: 'pending',
      phoneNumber,
      email,
      transactionId: momoResponse.data.transactionId,
      createdAt: new Date().toISOString()
    });
    await writeJSON(PAYMENTS_FILE, payments);

    res.json({
      success: true,
      message: 'Demande de paiement envoyée',
      data: {
        transactionId: momoResponse.data.transactionId,
        referenceId: externalId
      }
    });
  } catch (error) {
    console.error('MOMO error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur création paiement MOMO'
    });
  }
};

// ===== VERIFY MOMO PAYMENT =====
export const verifyMomoPayment = async (req, res) => {
  try {
    const { referenceId } = req.params;

    // Vérifier statut paiement
    const momoResponse = await axios.get(
      `${process.env.MOMO_API_URL}/v1/requesttopay/${referenceId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.MOMO_API_KEY}`,
          'X-Reference-Id': referenceId
        }
      }
    );

    const paymentStatus = momoResponse.data.status;

    // Mettre à jour dans base de données
    const payments = await readJSON(PAYMENTS_FILE);
    const paymentIndex = payments.findIndex(p => p.id === referenceId);

    if (paymentIndex !== -1) {
      payments[paymentIndex].status = paymentStatus.toLowerCase();
      await writeJSON(PAYMENTS_FILE, payments);
    }

    res.json({
      success: paymentStatus === 'SUCCESSFUL',
      status: paymentStatus,
      data: momoResponse.data
    });
  } catch (error) {
    console.error('MOMO verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur vérification paiement MOMO'
    });
  }
};
```

### 2. **Routes OM/MOMO**

```javascript
// backend/routes/momoRoutes.js
import express from 'express';
import {
  createMomoPayment,
  verifyMomoPayment
} from '../controllers/momoController.js';

const router = express.Router();

router.post('/request', createMomoPayment);
router.get('/verify/:referenceId', verifyMomoPayment);

export default router;
```

---

## 🎨 Frontend: Choix Méthode Paiement

```javascript
// src/pages/PaymentMethod.jsx
export function PaymentMethodSelector({ memberId, amount, email, firstName, lastName }) {
  const [method, setMethod] = useState('stripe');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleStripePayment = () => {
    // Intégration Stripe
  };

  const handleMomoPayment = async () => {
    if (!phoneNumber) {
      alert('Veuillez entrer votre numéro');
      return;
    }

    try {
      const response = await apiCall('/api/momo/request', {
        method: 'POST',
        body: JSON.stringify({
          amount,
          phoneNumber,
          email,
          externalId: `order_${memberId}`
        })
      });

      alert(`Demande de paiement envoyée au ${phoneNumber}`);
      // Rediriger ou afficher confirmation
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  return (
    <div className="payment-methods">
      <h2>Choisir votre méthode de paiement</h2>

      <div className="method-card">
        <input
          type="radio"
          name="method"
          value="stripe"
          checked={method === 'stripe'}
          onChange={(e) => setMethod(e.target.value)}
        />
        <label>💳 Carte Bancaire (Stripe)</label>
      </div>

      <div className="method-card">
        <input
          type="radio"
          name="method"
          value="momo"
          checked={method === 'momo'}
          onChange={(e) => setMethod(e.target.value)}
        />
        <label>📱 Orange Money / Mobile Money</label>

        {method === 'momo' && (
          <div className="momo-input">
            <input
              type="tel"
              placeholder="+237 6XX XXX XXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        )}
      </div>

      <button onClick={method === 'stripe' ? handleStripePayment : handleMomoPayment}>
        Payer {amount} XAF
      </button>
    </div>
  );
}
```

---

## ✅ Checklist Paiement

- [ ] Stripe keys dans .env
- [ ] Stripe API intégrée
- [ ] Créer sessions paiement
- [ ] Vérifier paiements
- [ ] Webhook Stripe configuré
- [ ] OM/MOMO API keys
- [ ] OM/MOMO requests intégré
- [ ] Frontend Stripe Checkout
- [ ] Frontend OM/MOMO form
- [ ] Tests paiement (mode sandbox)

---

## 🧪 Tests Paiement

### Stripe (Sandbox)
```bash
# Numéro de test
4242 4242 4242 4242
Expiry: 12/25
CVC: 123
```

### OM/MOMO
```bash
# Utilisez les API de test OM
# Documentation: https://api.orange.cm/docs
```

---

**Status**: Architecture de paiement définie
**Prochaine étape**: Installer et configurer Stripe
