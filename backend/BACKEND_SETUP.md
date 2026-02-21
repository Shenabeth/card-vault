# Card Vault Backend Setup

This is the Flask + MongoDB backend for Card Vault. It handles user authentication, card management, binder creation, and data persistence.

## 📋 Architecture Overview

### Multi-Tenant Data Model

To support multiple users without expensive database per-tenant solutions, we use a **simple user isolation pattern**:

1. **Field-Based Isolation**: Every document (cards, binders) stores a `user_id` field
2. **Query Filtering**: All queries include `user_id` in the filter
3. **Indexes**: Created on `user_id` for fast lookups
4. **Cost-Effective**: Single database, scales to thousands of users

Example:
```javascript
// All cards stored together, but each user only sees their own
db.cards.find({ user_id: "user123" })  // User 1's cards
db.cards.find({ user_id: "user456" })  // User 2's cards
```

**Scaling considerations:**
- ✅ Works well for thousands to hundreds of thousands of users
- If you reach millions of users, consider sharding by user_id
- Alternative: Database per tenant (more expensive, better isolation)

## 🔧 Setup Instructions

### Prerequisites

- **Python 3.8+**
- **MongoDB** (local or MongoDB Atlas)
- **Node.js** (for the frontend, local dev)

### 1. Install MongoDB

#### Option A: MongoDB Atlas (Cloud - Recommended for Production)
```bash
# Go to https://www.mongodb.com/cloud/atlas
# Create a free account and cluster
# Get your connection string: mongodb+srv://username:password@cluster.mongodb.net/card_vault
```

#### Option B: Local MongoDB Installation

**On macOS (with Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**On Linux (Ubuntu/Debian):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**On Windows:**
Download and install from https://www.mongodb.com/try/download/community

### 2. Verify MongoDB is Running

```bash
# Connect to MongoDB shell to verify
mongosh
# You should see a connection prompt
# Type: exit
```

### 3. Setup Python Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 4. Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your favorite editor
```

**For local development**, the defaults should work:
```
MONGODB_URI=mongodb://localhost:27017/card_vault
FLASK_ENV=development
JWT_SECRET_KEY=dev-secret-key
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
PORT=5000
```

For production, add your Vercel URL to `CORS_ORIGINS` (example: `https://card-vault-collection.vercel.app`).

**For MongoDB Atlas**, update MONGODB_URI:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/card_vault?retryWrites=true&w=majority
```

### 5. Seed Demo Data (Optional)

```bash
# Still in the backend directory with venv activated
python seed_demo_data.py
```

This creates:
- **Demo User**: username=`demo`, password=`demo123`
- **6 Sample Cards**: Charizard, Blastoise, Venusaur, Arcanine, Machamp, Pikachu
- **2 Sample Binders**: Pre-populated with some cards

### 6. Start the Flask Server

```bash
# Make sure you're in the backend directory with venv activated
python app.py
```

You should see:
```
 * Running on http://0.0.0.0:5000
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Cards
- `GET /api/cards` - Get all cards (requires auth)
- `GET /api/cards/<id>` - Get specific card
- `POST /api/cards` - Create new card
- `PUT /api/cards/<id>` - Update card
- `DELETE /api/cards/<id>` - Delete card

### Binders
- `GET /api/binders` - Get all binders (requires auth)
- `GET /api/binders/<id>` - Get specific binder
- `POST /api/binders` - Create new binder
- `PUT /api/binders/<id>` - Update binder layout
- `DELETE /api/binders/<id>` - Delete binder

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication.

**How it works:**
1. User signs up/logs in
2. Server returns a token
3. Client sends token in `Authorization: Bearer <token>` header
4. Server validates token on protected routes

Token expires in 30 days (configurable in `config.py`).

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  password: String (hashed with bcrypt),
  is_demo: Boolean,
  created_at: DateTime
}
```

### Cards Collection
```javascript
{
  _id: ObjectId,
  user_id: String,  // Links to user
  name: String,
  set: String,
  card_number: String,
  image_url: String,
  is_graded: Boolean,
  grading: {
    company: String (PSA, BGS, CGC, etc.),
    grade: Number,
    cert_number: String
  },
  condition: String (Raw, Mint, Near Mint, etc.),
  purchase_price: Number,
  estimated_value: Number,
  quantity: Number,
  notes: String,
  tags: Array<String>,
  created_at: DateTime,
  updated_at: DateTime
}
```

### Binders Collection
```javascript
{
  _id: ObjectId,
  user_id: String,  // Links to user
  name: String,
  rows: Number,
  columns: Number,
  slots: Array<Array<String | null>>,  // Card IDs or null
  created_at: DateTime,
  updated_at: DateTime
}
```

## 🔗 Connecting React Frontend

Update the React API service to use your backend URL:

```typescript
// In your React hooks (useCardData.ts, useBinderData.ts)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Example
const response = await fetch(`${API_URL}/cards`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🧪 Testing the API

```bash
# Get a token (login as demo)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'

# Response: { "token": "eyJ...", "user": {...} }

# Use token to get cards
curl -X GET http://localhost:5000/api/cards \
  -H "Authorization: Bearer <token-from-above>"
```

## 📝 Development Tips

### Enable Debug Logging
Edit `.env`:
```
FLASK_ENV=development
```

### Reset Database
```bash
# Delete all collections
mongosh
> use card_vault
> db.dropDatabase()
> exit

# Re-seed if needed
python seed_demo_data.py
```

### Common Issues

**Issue**: "Failed to connect to MongoDB"
- Solution: Make sure MongoDB is running. Check `MONGODB_URI` in `.env`

**Issue**: "Port 5000 already in use"
- Solution: Change `PORT` in `.env` or kill the process using port 5000

**Issue**: "JWT token expired"
- Solution: User needs to login again to get a fresh token

## 🚀 Deploying Backend

### To Railway, Heroku, or AWS

1. Create `.env` with production values
2. Set `FLASK_ENV=production`
3. Use MongoDB Atlas (not local)
4. Push to git and deploy via your platform's dashboard

No additional changes needed - the code is deployment-ready!

## 📚 Next Steps

1. **Connect React Frontend** - Update API URLs in React hooks
2. **Add Image Upload** - Integrate with S3 or similar storage
3. **Add User Profiles** - Store preferences, avatar, etc.
4. **Add Notifications** - Email updates on collection changes
5. **API Rate Limiting** - Prevent abuse
6. **Better Error Handling** - More specific error messages
