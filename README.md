# 🃏 Card Vault — Trading Card Collection & Binder Planner

Card Vault is a web application designed for collectors to track, organize, and visualize their trading card collections. Beyond basic CRUD operations, it features an interactive **Binder Planner** that lets you drag and drop cards into custom grid layouts, making it the ultimate tool for collection management.

## 🌟 Features

### Collection Tracking
- **Add, Edit, Delete Cards** — Manage your collection with ease
- **Card Metadata** — Track set name, card number, condition, grading details, purchase price, estimated value, quantity, and notes
- **Image Upload** — Store card images for visual reference
- **Card Details Page** — View full card information with metadata and value tracking

### 🔹 Graded Card Support
- **Toggle Raw vs Graded** — Switch between raw and graded card modes
- **Grading Details** — Store grading company (PSA, BGS, CGC, etc.), grade, and certification number
- **Graded Collection Filter** — Filter cards by grading status

### 🧩 Binder / Frame Planner (The Differentiator)
This is what makes Card Vault special. Instead of just tracking cards like a spreadsheet, you can:
- **Create Custom Binders** — Set up layouts with adjustable grid sizes (3x3, 4x4, or custom)
- **Drag & Drop Cards** — Intuitively place cards into specific binder slots
- **Visual Layout** — See your entire binder at a glance with empty slots highlighted
- **Save & Manage** — Store multiple binder configurations
- **Future: Export as Image** — Share and showcase your binders

### 💰 Value Tracking
- Track purchase price and estimated value per card
- Monitor total collection value
- View card value history (future feature)

### 🔍 Collection Organization
- **Grid Layout** — Image-heavy visual browsing
- **Filters** — By set, graded status, value range
- **Sorting** — By newest, highest value, or alphabetical
- **Dashboard** — Quick overview of total cards, graded cards, estimated value

## 🛠️ Tech Stack

### Frontend
- **React 18** — Component-based UI framework
- **TypeScript** — Type-safe development
- **Vite** — Fast build tool and dev server
- **TailwindCSS** — Utility-first styling
- **shadcn/ui** — High-quality, accessible React components
- **React Router** — Client-side routing
- **React DnD or native Drag & Drop API** — Interactive drag-and-drop for binder planning

### Backend ✅
- **Flask** — Lightweight Python web framework for REST API
- **MongoDB Atlas** — Cloud NoSQL database for flexible card/binder documents
- **PyMongo** — Python MongoDB driver
- **JWT Authentication** — Secure token-based authentication
- **Bcrypt** — Password hashing and security

### Deployment
- **Frontend**: Vercel, Netlify, or any static host (React/Vite)
- **Backend**: Railway, Heroku, AWS, or any cloud platform (Flask)
- **Database**: MongoDB Atlas (managed cloud database)

### Responsive Design
- Optimized for both mobile and desktop
- Adaptive grid layouts
- Touch-friendly drag-and-drop on mobile

## 📊 Data Structure (MongoDB)

### Card Document
```json
{
  "_id": "ObjectId",
  "name": "Charizard",
  "set": "Base Set",
  "card_number": "4/102",
  "image_url": "string",
  "is_graded": true,
  "grading": {
    "company": "PSA",
    "grade": 9,
    "cert_number": "12345678"
  },
  "purchase_price": 250,
  "estimated_value": 400,
  "quantity": 1,
  "notes": "Bought at convention",
  "condition": "raw",
  "created_at": "date",
  "updated_at": "date"
}
```

### Binder Document
```json
{
  "_id": "ObjectId",
  "name": "Base Set Master",
  "rows": 3,
  "columns": 3,
  "slots": [
    ["card_id_1", null, "card_id_2"],
    [null, null, null],
    ["card_id_3", null, null]
  ],
  "created_at": "date",
  "updated_at": "date"
}
```

## 🎯 Core Pages

### 🏠 Dashboard
- Overview of total cards and graded cards
- Estimated total collection value
- Recently added cards
- Quick "Add Card" button

### 📚 Collection View
- Grid layout with card images
- Filters (by set, graded status, value range)
- Sorting options (newest, highest value, alphabetical)
- Click to view card details

### 🃏 Card Detail Page
- Large card image
- Full metadata display
- Value tracking
- Edit and delete options

### ➕ Add/Edit Card Page
- Image upload
- Card metadata form
- Raw vs graded toggle
- Price and condition fields
- Form validation

### 📒 Binder Planner
- List of created binders
- Create new binder with custom layout
- Click to open binder editor

### 🧩 Binder Layout Editor
- Interactive grid display
- Drag cards from collection
- Click slots to assign/unassign cards
- Save layout changes
- Visual empty/filled slot indicators

### ⚙️ Settings (Optional for MVP)
- Dark/light mode toggle
- Default currency selection
- Default grading company preferences

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** and npm/yarn (for frontend)
- **Python 3.8+** (for backend)
- **MongoDB Atlas account** (free tier available)

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Frontend runs at `http://localhost:5173`

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string

# Seed demo data (optional)
python seed_demo_data.py

# Start Flask server
python app.py
```

Backend runs at `http://localhost:5000`

### Demo Account
After seeding demo data:
- **Username**: `demo`
- **Password**: `demo123`
- Includes 6 sample cards and 2 binders with pre-placed cards

### Documentation
- **Backend Setup**: See `backend/BACKEND_SETUP.md`
- **Quick Start**: See `backend/QUICKSTART.md`
- **Multi-Tenancy & Scaling**: See `backend/MULTI_TENANCY.md`
- **Setup Instructions**: See `SETUP_INSTRUCTIONS.md`

## 📝 Development Roadmap

### Phase 1 (MVP) ✅
- ✅ Collection tracking (CRUD)
- ✅ Card detail page
- ✅ Binder planner with drag & drop
- ✅ Dashboard overview
- ✅ Collection view structure
- ✅ User authentication (JWT tokens)
- ✅ Backend API (Flask + MongoDB)
- ✅ Multi-user data isolation
- ✅ Demo account with sample data

### Phase 2 (In Progress)
- ⏳ Frontend-to-backend API integration
- ⏳ Cloud image storage (S3)
- ⏳ Collection view filters and sorting
- ⏳ User profile management

### Phase 3 (Future)
- 🔜 Value history tracking with charts
- 🔜 Card tags (For Trade, For Sale, PC, Investment)
- 🔜 Binder export as image
- 🔜 Advanced search and analytics
- 🔜 Password reset functionality
- 🔜 Social features (sharing binders)
- 🔜 Mobile app native version

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
