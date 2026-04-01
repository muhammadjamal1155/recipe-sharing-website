import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import SubmitRecipe from './pages/SubmitRecipe';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

import { Toaster } from 'react-hot-toast';


import PageLayout from './components/PageLayout';

function App() {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Navbar />
      <main className="main-content">
        <PageLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/submit" element={<SubmitRecipe />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageLayout>
      </main>
    </>
  );
}

export default App;
