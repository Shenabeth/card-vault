/**
 * Card Vault - Backend Integration Guide
 * 
 * This React frontend is designed to work with a Flask + MongoDB backend.
 * 
 * == API ENDPOINTS TO IMPLEMENT ==
 * 
 * Cards:
 * - GET    /api/cards           - Get all cards
 * - POST   /api/cards           - Create a new card
 * - GET    /api/cards/:id       - Get card by ID
 * - PUT    /api/cards/:id       - Update card
 * - DELETE /api/cards/:id       - Delete card
 * 
 * Binders:
 * - GET    /api/binders         - Get all binders
 * - POST   /api/binders         - Create a new binder
 * - GET    /api/binders/:id     - Get binder by ID
 * - PUT    /api/binders/:id     - Update binder
 * - DELETE /api/binders/:id     - Delete binder
 * 
 * Image Upload:
 * - POST   /api/upload          - Upload card image
 * 
 * == DATA MODELS ==
 * 
 * See /src/app/types/index.ts for TypeScript interfaces that match
 * the MongoDB schema provided in the requirements.
 * 
 * == INTEGRATION STEPS ==
 * 
 * 1. Replace localStorage calls in useCardData.ts and useBinderData.ts
 *    with fetch/axios calls to your Flask API endpoints
 * 
 * 2. Add loading states and error handling for API calls
 * 
 * 3. Implement image upload functionality using FormData
 * 
 * 4. Add authentication if needed (JWT tokens, etc.)
 * 
 * 5. Deploy Flask backend and update API base URL
 * 
 * == CURRENT STATE ==
 * 
 * The app currently uses localStorage for data persistence, which means:
 * - Data is stored in the browser
 * - Each user/device has separate data
 * - Data persists across page refreshes
 * - Perfect for prototyping and testing
 * 
 * The data structure matches the MongoDB schema exactly, so migration
 * should be straightforward.
 */

// Export a placeholder for API configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
};

export default {};
