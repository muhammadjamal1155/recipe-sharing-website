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
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '100vh', color: 'white' }}>
      <div className="card" style={{ padding: '4rem 3rem', marginBottom: '5rem', textAlign: 'center', background: 'linear-gradient(135deg, #059669, #0f172a)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', borderRadius: '2.5rem' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.2)', margin: '0 auto 2rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', color: 'white', fontWeight: 800, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          {user?.[0]?.toUpperCase()}
        </div>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.02em', fontWeight: 800 }}>Master Chef: {user}</h1>
        <p style={{ color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>Verified Creator</p>
      </div>

      {/* Favorites Section */}
      <div style={{ marginBottom: '6rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2.5rem', borderLeft: '8px solid var(--primary)', paddingLeft: '1.5rem', fontWeight: 800 }}>
          Saved Favorites ({favoriteRecipes.length})
        </h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>Analyzing your bookmarks...</div>
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
          <div style={{ padding: '6rem 2rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '2rem', border: '2px dashed rgba(255,255,255,0.05)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>Your pantry of favorites is currently empty.</p>
              <button className="btn btn-outline" onClick={() => navigate('/recipes')}>Discover Recipes</button>
          </div>
        )}
      </div>

      {/* My Recipes Section */}
      <div>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2.5rem', borderLeft: '8px solid #334155', paddingLeft: '1.5rem', fontWeight: 800 }}>
          My Contributions ({myRecipes.length})
        </h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>Compiling your library...</div>
        ) : myRecipes.length > 0 ? (
          <div className="grid grid-cols-3">
            {myRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div style={{ padding: '6rem 2rem', textAlign: 'center', backgroundColor: 'var(--card-bg)', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'var(--card-shadow)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>You haven't contributed any recipes to the lounge yet.</p>
            <button className="btn btn-primary" style={{ padding: '1rem 2rem' }} onClick={() => navigate('/submit')}>
              Share Your First Secret Recipe
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

