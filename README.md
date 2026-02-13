# 💬 Pingr - Real-time Chat Application

A full-stack real-time chat application built with the MERN stack, featuring instant messaging, user authentication, and live online status tracking.

## ✨ Features

- **Real-time Messaging** - Instant message delivery using Socket.io
- **User Authentication** - Secure JWT-based authentication and authorization
- **Online Status** - See which users are currently online
- **Profile Management** - Upload and update profile pictures via Cloudinary
- **Theme Support** - Multiple DaisyUI themes for customization
- **Responsive Design** - Modern UI built with TailwindCSS and DaisyUI

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **DaisyUI** - Component library
- **Zustand** - State management
- **Socket.io Client** - Real-time communication
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database
- **Socket.io** - WebSocket server
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Cloudinary** - Image hosting
- **Cookie Parser** - Cookie handling
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Cloudinary account for image uploads

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Pingr
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pingr
   PORT=5001
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Run the application**

   ```bash
   # Run backend (from backend directory)
   cd backend
   npm run dev

   # Run frontend (from frontend directory, in a new terminal)
   cd frontend
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`  
   The backend will be running at `http://localhost:5001`

## 🚀 Production Build

```bash
# Build the frontend
cd frontend
npm run build

# Start the production server
cd ../backend
npm start
```

## 📁 Project Structure

```
Pingr/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── lib/            # Utilities (DB, Socket, Cloudinary)
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── index.js        # Entry point
│   └── .env                # Environment variables
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand stores
│   │   ├── lib/            # Utilities
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   └── tailwind.config.js  # Tailwind configuration
└── README.md
```

## 🔑 Key Features Explained

### Authentication Flow
- Users sign up with email, full name, and password
- Passwords are hashed using bcrypt before storage
- JWT tokens are issued and stored in HTTP-only cookies
- Protected routes require valid JWT tokens

### Real-time Communication
- Socket.io establishes WebSocket connections
- Messages are instantly broadcast to connected users
- Online/offline status is tracked and updated in real-time

### Image Uploads
- Profile pictures are uploaded as base64 strings
- Images are stored on Cloudinary for reliable hosting
- 50MB payload limit supports high-quality images

## 🎨 Customization

The app supports multiple themes via DaisyUI. Themes can be changed in the settings page and include:
- Light, Dark, Cupcake, Bumblebee, Emerald, Corporate
- Synthwave, Retro, Cyberpunk, Valentine, Halloween
- And many more!

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using the MERN stack



preview: https://pingr-frontend-ppiewk66l-utkarsh-rajputs-projects.vercel.app/login
