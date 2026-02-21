# 🔧 What You Need to Do: Complete Setup Guide

I've created a full Flask + MongoDB backend for Card Vault. Here's exactly what you need to do.

---

## 📦 What Was Created

```
backend/
├── app.py                    # Main Flask application
├── config.py                # Configuration management
├── database.py              # MongoDB connection
├── auth.py                  # Authentication & JWT
├── requirements.txt         # Python dependencies
├── seed_demo_data.py        # Demo data generator
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore file
├── routes/
│   ├── __init__.py
│   ├── auth.py             # Login/Signup endpoints
│   ├── cards.py            # Card CRUD endpoints
│   └── binders.py          # Binder CRUD endpoints
├── BACKEND_SETUP.md        # Detailed setup guide
├── MULTI_TENANCY.md        # Multi-user scaling explanation
└── QUICKSTART.md           # 5-minute quick start
```

---

## 🎯 Steps to Get Running (Do These on Your Machine)

### Step 1️⃣: Install MongoDB

Choose ONE option:

**Option A: Local Installation (Simpler for Development)**
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install -y mongodb
sudo systemctl start mongodb

# Windows
# Download from: https://www.mongodb.com/try/download/community
# Run installer and follow prompts
```

**Option B: MongoDB Atlas (Better for Production)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a cluster (M0 free tier is fine)
4. Get connection string like: `mongodb+srv://user:pass@cluster.mongodb.net/card_vault`
5. Note this for Step 3

**Verify MongoDB is running:**
```bash
mongosh  # Should connect without errors
# Type: exit
```

---

### Step 2️⃣: Setup Backend Environment

```bash
# In your terminal, go to backend directory
cd backend

# Create virtual environment (Python environment)
python -m venv venv

# Activate it
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

---

### Step 3️⃣: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your editor
# nano .env    (on Mac/Linux)
# code .env    (if using VS Code)
```

**For local MongoDB** (default), just leave as-is:
```
MONGODB_URI=mongodb://localhost:27017/card_vault
```

**For MongoDB Atlas**, replace with your connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/card_vault?retryWrites=true&w=majority
```

---

### Step 4️⃣: Seed Demo Data (Optional but Recommended)

```bash
# Make sure venv is activated
source venv/bin/activate  # (first time in new terminal)

# Run the seed script
python seed_demo_data.py
```

**What this creates:**
- Demo account: `username: demo`, `password: demo123`
- 6 sample cards: Charizard, Blastoise, Venusaur, Arcanine, Machamp, Pikachu
- 2 sample binders with cards placed in slots

**Output example:**
```
200:INFO:root:Connected to MongoDB: card_vault
200:INFO:root:Inserted 6 demo cards
200:INFO:root:Inserted 2 demo binders
==================================================
✅ Demo data seeded successfully!
==================================================
Demo User ID: 507f1f77bcf86cd799439011
Username: demo
Password: demo123
==================================================
```

---

### Step 5️⃣: Start the Flask Server

```bash
# Make sure venv is still activated, then run:
python app.py
```

**Expected output:**
```
 * Running on http://0.0.0.0:5000
Press CTRL+C to quit
```

✅ **Backend is now running!**

---

## 🧪 Test It Works

### Test 1: Check server health
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok","message":"Card Vault API is running"}
```

### Test 2: Login as demo user
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'

# Returns: {"token":"eyJ...", "user":{...}}
# Save the token value
```

### Test 3: Get cards with token
```bash
curl -X GET http://localhost:5000/api/cards \
  -H "Authorization: Bearer <paste-token-here>"

# Returns: {"cards":[...]}
```

✅ If all three work, your backend is ready!

---

## 🔗 Connecting React Frontend

The React app is currently using localStorage. Update it to use the backend API:

### Step 1: Update Auth Context

Update `src/app/context/AuthContext.tsx`:

```typescript
const API_URL = 'http://localhost:5000/api';

const login = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  if (!response.ok) throw new Error('Login failed');
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  setUser(data.user);
};
```

### Step 2: Update Card Hook

Update `src/app/hooks/useCardData.ts` to fetch from backend:

```typescript
const API_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token');

const getCards = async () => {
  const response = await fetch(`${API_URL}/cards`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

**Note:** I'll help you implement these changes if you want, but the structure is already in place!

---

## 👥 Multi-User Data Handling (Your Original Question)

Your concern: "How do I store multiple users' data?"

**Answer: It's already solved! Here's how:**

### The Strategy: Field-Based Isolation

```
┌─────────────────────────────────────────┐
│         MongoDB Database                │
├─────────────────────────────────────────┤
│  Cards Collection:                      │
│  ├─ Card 1: user_id = "user_abc123"    │
│  ├─ Card 2: user_id = "user_abc123"    │  ← User A's cards
│  ├─ Card 3: user_id = "user_def456"    │
│  └─ Card 4: user_id = "user_def456"    │  ← User B's cards
│                                         │
│  Binders Collection:                    │
│  ├─ Binder 1: user_id = "user_abc123"  │  ← User A's binders
│  └─ Binder 2: user_id = "user_def456"  │  ← User B's binders
└─────────────────────────────────────────┘
```

### How It Works

1. **Queries filter by user** - Backend always includes user_id in queries
2. **Ownership verification** - Before updating/deleting, verify owner matches
3. **Indexed for speed** - Database indexes on user_id for fast lookups
4. **Scales well** - Works for thousands to millions of users

### Example
```python
# When user A logs in and requests cards
# Request includes JWT token for user A
# Backend extracts user_id from token
# Query becomes: db.cards.find({'user_id': 'user_abc123'})
# User A only sees their cards ✅
```

### Scaling Options (Read MULTI_TENANCY.md for Details)

| Users | Strategy | Cost |
|-------|----------|------|
| <10K | Field-based (current) | Free-$50 |
| 10K-100K | Add multiple servers | $50-200 |
| 100K+ | Database sharding | $200+ |
| Enterprise | Database per tenant | $1000+ |

**For now?** Current setup handles thousands of users fine! Scale later if needed.

---

## 📋 File-by-File Explanation

### Core Files

**`app.py`** - Main Flask application
- Registers all routes
- Sets up CORS for React
- Health check endpoint

**`config.py`** - Configuration
- JWT secret key
- MongoDB URI
- Environment-specific settings

**`database.py`** - MongoDB connection
- Connects to MongoDB
- Creates indexes for performance

**`auth.py`** - Authentication utilities
- Password hashing (bcrypt)
- JWT token creation/verification
- Token authentication decorator

### Routes

**`routes/auth.py`** - User accounts
- POST `/api/auth/signup` - Create account
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

**`routes/cards.py`** - Trading cards (user-filtered)
- GET `/api/cards` - Get all cards for user
- POST `/api/cards` - Create card
- PUT `/api/cards/<id>` - Update card
- DELETE `/api/cards/<id>` - Delete card

**`routes/binders.py`** - Binder layouts (user-filtered)
- GET `/api/binders` - Get all binders for user
- POST `/api/binders` - Create binder
- PUT `/api/binders/<id>` - Update layout
- DELETE `/api/binders/<id>` - Delete binder

### Utilities

**`seed_demo_data.py`** - Creates demo account with sample data
**`.env.example`** - Template for environment variables
**`requirements.txt`** - Python package list

### Documentation

**`BACKEND_SETUP.md`** - Detailed setup instructions  
**`MULTI_TENANCY.md`** - Scaling guide for multiple users  
**`QUICKSTART.md`** - 5-minute quick start

---

## 🚀 What's Ready to Use

✅ Full CRUD API for cards and binders  
✅ User authentication with JWT tokens  
✅ Multi-user data isolation (user_id field)  
✅ Password hashing with bcrypt  
✅ 30-day token expiry  
✅ Ownership verification on all updates  
✅ Database indexes for performance  
✅ CORS enabled for React frontend  
✅ Demo account with sample data  
✅ Error handling and logging  

---

## ⚠️ Still Uses localStorage for Tokens

Currently, tokens are stored in React's localStorage. This is fine for now but consider:

**Later (when ready):**
- Move tokens to secure HTTP-only cookies
- Add logout functionality on all devices
- Add token refresh endpoint

---

## 📚 Next Steps (In Order)

1. ✅ Follow setup steps above (install MongoDB, start Flask)
2. ✅ Test demo account works
3. ⏳ Connect React frontend to backend API (update URLs)
4. ⏳ Test login/signup with Redis
5. ⏳ Add image upload to S3
6. ⏳ Deploy backend (Railway, Heroku)
7. ⏳ Deploy frontend (Vercel, Netlify)

---

## 🆘 Common Issues

| Problem | Fix |
|---------|-----|
| "Connection refused" | MongoDB not running - `brew services start mongodb-community` |
| "ModuleNotFoundError" | venv not activated - `source venv/bin/activate` |
| "Port 5000 in use" | Change PORT in .env or kill process on port 5000 |
| "No module named flask" | pip install not run - `pip install -r requirements.txt` |

---

## 💾 Important: Save Passwords Securely

In production:
- Never hardcode passwords
- Use environment variables for secrets
- Use strong JWT_SECRET_KEY
- Rotate keys periodically
- Monitor for suspicious activity

---

## 🎓 Learning Resources

- Flask docs: https://flask.palletsprojects.com
- MongoDB docs: https://docs.mongodb.com
- JWT docs: https://jwt.io/
- CORS docs: https://enable-cors.org/

---

## 🤔 Questions?

- Check `BACKEND_SETUP.md` for detailed explanations
- Check `MULTI_TENANCY.md` for scaling questions
- Check docstrings in `routes/` files for endpoint details
- Check MongoDB logs for database issues

---

That's it! Your backend is complete and ready. Follow the 5 steps above and you're good to go! 🚀
