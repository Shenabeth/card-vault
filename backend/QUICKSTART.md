# Quick Start: Flask + MongoDB Backend

## 📋 TL;DR Setup (5 minutes)

### Step 1: Install MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**Windows:** Download from https://www.mongodb.com/try/download/community

### Step 2: Setup Backend

```bash
cd backend/

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy env file
cp .env.example .env

# Seed demo data
python seed_demo_data.py

# Start server
python app.py
```

Server runs at `http://localhost:5000` 🎉

### Step 3: Test Demo Account

**Username:** `demo`  
**Password:** `demo123`

Visit `http://localhost:5000/api/health` to verify server is running.

---

## 🔑 Key Points

### Multi-Tenancy (Handling Multiple Users)

Your current setup uses **field-based isolation**:
- Every card/binder has a `user_id` field
- All queries filter by user_id automatically
- **Scales to thousands of users** with no additional setup
- See `MULTI_TENANCY.md` for detailed scaling guide

### Data Storage

All data goes to one MongoDB database with 3 collections:
- **users** - User accounts
- **cards** - Trading cards (with user_id)
- **binders** - Binder layouts (with user_id)

### Security

- Passwords hashed with bcrypt
- JWT tokens for authentication (30-day expiry)
- All endpoints (except signup/login) require valid token
- Ownership verified on all updates

### Demo Account Preloaded

The seed script creates:
- Demo user account
- 6 sample cards (Charizard, Blastoise, etc.)
- 2 sample binders with cards pre-placed

---

## 📚 What to Do Next

1. **Use MongoDB Atlas (cloud)** - More reliable than local
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free account and cluster
   - Replace `MONGODB_URI` in `.env`

2. **Connect React Frontend** - Update API endpoints
   - Update fetch calls to use `http://localhost:5000/api`
   - Add token to Authorization header

3. **Add Password Reset** - Users will forget passwords

4. **Add Image Upload** - Store card photos on S3

5. **Deploy Backend** - Railway or Heroku (easy with Flask)

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Connection refused" | Make sure MongoDB is running (`brew services list` or `mongosh`) |
| "Port 5000 in use" | Change PORT in `.env` or `lsof -i :5000` to kill process |
| "ModuleNotFoundError" | Make sure venv is activated and `pip install -r requirements.txt` ran |
| "Invalid token" | User needs to login again to get fresh token |

---

## 🚀 Production Deployment

When ready to deploy:

```bash
# Set production env
export FLASK_ENV=production
export JWT_SECRET_KEY=your-long-random-secret-key

# Use MongoDB Atlas instead of local
export MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/card_vault

# Deploy to Railways, Heroku, AWS, etc.
# (They'll use requirements.txt and app.py automatically)
```

---

## 📖 Full Documentation

- **Backend Setup**: See `BACKEND_SETUP.md`
- **Multi-Tenancy Guide**: See `MULTI_TENANCY.md`
- **API Reference**: Check docstrings in `routes/`

---

## 🎯 Demo Data

After running `seed_demo_data.py`, you get:

```
1 Demo Account
├── 6 Cards (Charizard, Blastoise, Venusaur, etc.)
├── 2 Binders (3x3, 4x4 layouts)
└── Cards placed in binder slots
```

Login with `demo`/`demo123` to see it all!

---

That's it! Backend is ready. Now connect React frontend and you're good to go 🎉
