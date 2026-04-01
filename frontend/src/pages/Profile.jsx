import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import api from '../api';

export default function Profile() {
  const [myRecipes, setMyRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    if(!user) {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      try {
        const res = await api.get('/recipes');
        const allRecipes = res.data;
        
        // My Posts
        setMyRecipes(allRecipes.filter(r => r.author === user));
        
        // My Favorites
        const favoriteIds = JSON.parse(localStorage.getItem(`favorites_${user}`) || '[]');
        setFavoriteRecipes(allRecipes.filter(r => favoriteIds.includes(r.id)));
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '100vh' }}>
      <div className="card" style={{ padding: '3rem', marginBottom: '4rem', textAlign: 'center', background: 'linear-gradient(to right, #fef08a, #fed7aa)', border: 'none' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'white', margin: '0 auto 1.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'var(--primary)', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
          {user?.[0]?.toUpperCase()}
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome, {user}</h1>
        <p style={{ color: '#78350f', fontSize: '1.2rem', fontWeight: 500 }}>Community Member</p>
      </div>

      {/* Favorites Section */}
      <div style={{ marginBottom: '5rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', borderLeft: '5px solid var(--primary)', paddingLeft: '1rem' }}>
          Saved Favorites ({favoriteRecipes.length})
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-3">
             <div style={{ padding: '2rem', textAlign: 'center', gridColumn: 'span 3' }}>Loading favorites...</div>
          </div>
        ) : favoriteRecipes.length > 0 ? (
          <div className="grid grid-cols-3">
            {favoriteRecipes.map(recipe => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onToggleFavorite={(id, isFav) => {
                   if (!isFav) setFavoriteRecipes(prev => prev.filter(r => r.id !== id));
                }}
              />
            ))}
          </div>

        ) : (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '1rem', border: '2px dashed var(--border-color)' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>You haven't saved any favorites yet.</p>
              <button className="btn btn-outline" onClick={() => navigate('/recipes')}>Explore Recipes</button>
          </div>
        )}
      </div>

      {/* My Recipes Section */}
      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', borderLeft: '5px solid #64748b', paddingLeft: '1rem' }}>
          My Contributions ({myRecipes.length})
        </h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading your contribution...</div>
        ) : myRecipes.length > 0 ? (
          <div className="grid grid-cols-3">
            {myRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem', backgroundColor: 'var(--card-bg)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--text-muted)' }}>You haven't posted any recipes yet.</p>
            <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/submit')}>
              Share Your First Recipe
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

