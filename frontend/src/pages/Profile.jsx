import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import api from '../api';

export default function Profile() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    if(!user) {
      navigate('/login');
      return;
    }
    const fetchUserRecipes = async () => {
      try {
        const res = await api.get('/recipes');
        // Filter internally for simplicity of this project setup
        const userRecipes = res.data.filter(r => r.author === user);
        setRecipes(userRecipes);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRecipes();
  }, [user, navigate]);

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <div className="card" style={{ padding: '3rem', marginBottom: '3rem', textAlign: 'center', background: 'linear-gradient(to right, #fef08a, #fed7aa)' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'white', margin: '0 auto 1.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'var(--primary)', fontWeight: 'bold' }}>
          {user?.[0]?.toUpperCase()}
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome, {user}</h1>
        <p style={{ color: '#78350f', fontSize: '1.2rem' }}>Master Chef Level 1</p>
      </div>

      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Your Recipes ({recipes.length})</h2>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading your recipes...</div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-3">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem', backgroundColor: 'var(--card-bg)', borderRadius: '1rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>You haven't posted any recipes yet.</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/submit')}>
            Submit your first recipe
          </button>
        </div>
      )}
    </div>
  );
}
