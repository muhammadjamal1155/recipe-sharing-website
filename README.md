# RecipeHub - Recipe Sharing Website

A modern, full-stack web application designed for sharing, discovering, and categorizing recipes. This application combines a sleek React frontend with a robust Express backend.

## Features

### Frontend (React + Vite)
- **Stunning UI/UX**: Designed using pure CSS and responsive design principles, featuring custom fonts and smooth micro-animations.
- **Dynamic Homepage**: Features a rich main banner, actionable call-to-action buttons, a global search bar, and featured recipe categories.
- **Browse Recipes**: Interactive recipe grid with real-time category and cooking time filters.
- **Recipe Management**: Dedicated pages for detailed recipe instructions, nutrition facts, and a comprehensive submission form (including image uploads).
- **User Authentication UI**: Complete login and registration forms interacting with secure JSON Web Tokens (JWT).

### Backend (Node.js + Express)
- **REST API Architecture**: Dedicated endpoints for recipes (`GET`, `POST`, `DELETE`) and user authentication (`POST` login/register).
- **Secure Authentication**: Backend route protection using parsed JWT payloads (`jsonwebtoken`) and encrypted passwords (`bcryptjs`).
- **File System Storage**: Employs an asynchronous, robust file-system JSON database architecture targeting `users.json` and `recipes.json`, providing speed and stability across Windows setups without the friction of compiling C++ SQLite binaries.
- **Image Processing**: Automatically handles static image uploads via `multer`.

---

## Prerequisites

Ensure you have the following installed before running this application:
- Node.js (v18+)
- npm (Node Package Manager)

## Project Structure

```
recipe-sharing-website/
│
├── frontend/             # React application powered by Vite
│   ├── src/              # React components, pages, and routing
│   ├── package.json      # Frontend dependencies
│   └── vite.config.js    # Vite configuration
│
└── backend/              # Express JS server 
    ├── server.js         # Core Express logic, Authentication, and Routes
    ├── data/             # Local JSON databases (users & recipes)
    └── package.json      # Backend dependencies
```

## How to Run the Application Locally

### 1. Start the Backend Server

Navigate to the `backend` directory, install dependencies, and start the node server:

```bash
cd backend
npm install
npm start
```
*The backend server will run on `http://localhost:3001`.*

### 2. Start the Frontend Development Server

In a new terminal, navigate to the `frontend` directory, install dependencies, and run the Vite server:

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
*The frontend application will compile and be accessible at `http://localhost:5174` (or 5173).*

---

## Default Accounts & Data
The application starts out-of-the-box with dummy recipes (e.g., "Classic Pancakes", "Vegan Avocado Toast") mapped to the dummy user `admin`.
- **Register a New Account** via the frontend interface by clicking "Login" -> "Sign Up".
- You can immediately post new recipes and have them persist in your local `data` folders.

## Technologies Used
- **Frontend**: React, React Router Dom, Axios, Lucide React (Icons), Vite, Vanilla CSS.
- **Backend**: Node.js, Express, jsonwebtoken, bcryptjs, multer (Uploads).