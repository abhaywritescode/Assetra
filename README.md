<div align="center">
  <img src="https://via.placeholder.com/150/0f172a/ffffff?text=Assetra" alt="Assetra Logo" width="150" height="150" />
  <h1>Assetra</h1>
  <p><strong>Your Smart Asset, Document, and Financial Impact Manager</strong></p>
  
  [![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-5-blue.svg)](https://www.prisma.io/)
  [![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
  [![Langchain](https://img.shields.io/badge/Langchain-AI-orange.svg)](https://js.langchain.com/)
</div>

<hr />

## 🌟 Overview

**Assetra** is an intelligent, full-stack web application designed to help you seamlessly manage your digital and physical assets, documents, and financial transactions. Beyond basic storage, Assetra actively works for you by analyzing your documents (like receipts and invoices) using advanced OCR and AI, to extract critical metadata such as warranty expiries, return deadlines, and potential price advantages. 

Assetra's built-in **Action Engine** alerts you to urgent tasks, while the **Impact Engine** tracks how much money you've saved or protected, turning passive asset management into active financial optimization. Oh, and it features an integrated **AI Assistant** to chat with your data!

## ✨ Key Features

- 🔐 **Secure Multi-Tenant Authentication**: Robust user signup and login system using JWT, bcrypt, and HttpOnly cookies. Total data isolation per user.
- 📄 **Smart Document Management (Parent-Child Architecture)**: Upload receipts, invoices, and contracts. Assetra securely stores the parent receipts and intelligently extracts all associated child assets (line items).
- 🛋️ **Granular Asset Tracking**: Automatically build an inventory of your assets. Track purchase prices, retailers, serial numbers, warranties, and return windows. Includes **Smart Editing and Data Healing** to easily detect and fill missing information.
- 🇮🇳 **Localized Extraction**: Advanced AI parsing optimized for Indian Rupees (₹) and exhaustive receipt data extraction.
- ⚡ **Action Engine**: Receive smart, proactive alerts for:
  - 🔄 Return Window Expiries
  - 🛡️ Warranty Expiries
  - 💳 Subscription Reviews
  - 💰 Price Advantage Opportunities
- 📈 **Impact Dashboard**: Visualize your financial wins. See exactly how much value Assetra has *Saved*, *Protected*, or *Recovered* for you.
- 🤖 **AI Assistant**: Powered by Langchain and Google GenAI. Ask questions about your assets, find specific documents, or get financial insights conversationally.
- 🔍 **OCR Integration**: Powered by Tesseract.js to read text directly from your uploaded images and PDFs.
- 📱 **Beautiful, Responsive UI**: A modern interface built with React, Tailwind CSS, and Lucide icons.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Network**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database ORM**: Prisma
- **Database**: SQLite (Easily configurable to PostgreSQL/MySQL)
- **AI & ML**: Langchain, `@langchain/google-genai`
- **OCR**: Tesseract.js
- **Security**: Helmet, CORS, Cookie-Parser, JSONWebToken (JWT), bcryptjs
- **File Uploads**: Multer

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### 1. Clone the repository
*(Assuming you have cloned the repo or extracted the project folder)*
```bash
cd Assetra
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure your environment.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on `.env.example`. You will need:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_super_secret_jwt_string
GOOGLE_API_KEY=your_gemini_api_key
```

Run database migrations to set up SQLite:
```bash
npx prisma migrate dev --name init
```

Start the backend development server:
```bash
npm run dev
```
*The backend should now be running on `http://localhost:5000`.*

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies.

```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*The frontend should now be running on `http://localhost:5173`.*

## 📂 Project Structure

```text
Assetra/
├── backend/                  # Express API Server
│   ├── prisma/               # Prisma schema & SQLite DB
│   ├── src/
│   │   ├── controllers/      # Route logic
│   │   ├── middleware/       # Auth & Security middlewares
│   │   ├── routes/           # API endpoints (auth, doc, chat, etc.)
│   │   └── services/         # Core business logic (AI, OCR, Impact Engine)
│   ├── .env                  # Environment variables
│   └── server.js             # Entry point
│
└── frontend/                 # React UI Client
    ├── src/
    │   ├── assets/           # Static images/icons
    │   ├── components/       # Reusable UI components (Navbar, Sidebar, etc.)
    │   ├── context/          # React Context (Auth)
    │   ├── pages/            # View components (Dashboard, Login, Upload)
    │   ├── services/         # API integration layers
    │   ├── App.jsx           # Main App component & Routing
    │   └── main.jsx          # React DOM render
    ├── tailwind.config.js    # Tailwind configuration
    └── vite.config.js        # Vite configuration
```

## 🔒 Security Measures
- **Helmet.js** for securing HTTP headers.
- **CORS** configured to only accept requests from the frontend client.
- Passwords are securely hashed using **bcryptjs**.
- Session management using **JWT** stored in **HttpOnly Cookies** to prevent XSS attacks.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
Feel free to check the [issues page](#) if you want to contribute.

## 📝 License
This project is licensed under the **ISC License**.

---
<div align="center">
  <i>Built with ❤️ for better financial and asset management.</i>
</div>
