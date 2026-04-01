import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChefHat, Star, Trash2, Edit } from 'lucide-react';
import api from '../api';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const currentUser = localStorage.getItem('username');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api.get(`/recipes/${id}`);
        setRecipe(res.data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await api.delete(`/recipes/${id}`);
        navigate('/recipes');
      } catch (error) {
        alert('Failed to delete recipe. ' + (error.response?.data?.message || ''));
      }
    }
  };

  if (loading) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>Loading recipe...</div>;
  if (!recipe) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>Recipe not found</div>;

  const imageUrl = recipe.image 
    ? `http://localhost:3001${recipe.image}`
    : `https://placehold.co/1200x500/f8fafc/0f172a?font=outfit&text=${encodeURIComponent(recipe.title)}`;

  return (
    <div>
      <div style={{ height: '400px', width: '100%', position: 'relative' }}>
        <img src={imageUrl} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
        <div className="container" style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '2rem 1rem', color: 'white' }}>
          <span style={{ background: 'var(--primary)', color: 'white', padding: '0.2rem 0.8rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '1rem', display: 'inline-block' }}>
            {recipe.category}
          </span>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{recipe.title}</h1>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Star size={20} fill="#fbbf24" color="#fbbf24"/> {recipe.rating || 'New'} Rating</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={20} /> {recipe.time}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ChefHat size={20} /> {recipe.difficulty}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>By {recipe.author}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '3rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Ingredients
          </h2>
          <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '2' }}>
            {recipe.ingredients.split(',').map((item, idx) => (
              <li key={idx} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>{item.trim()}</li>
            ))}
          </ul>

          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Instructions</h2>
          <div style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
            {recipe.instructions}
          </div>
        </div>

        <div>
          {currentUser === recipe.author && (
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Manage Recipe</h3>
              <button onClick={handleDelete} className="btn" style={{ width: '100%', backgroundColor: '#fee2e2', color: '#ef4444', marginBottom: '1rem' }}>
                <Trash2 size={18} style={{ marginRight: '0.5rem' }} /> Delete Recipe
              </button>
            </div>
          )}
          
          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--primary)', color: 'white' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Nutrition Facts</h3>
            <p style={{ opacity: 0.8, marginBottom: '0.5rem' }}>Calories: ~350 kcal</p>
            <p style={{ opacity: 0.8, marginBottom: '0.5rem' }}>Protein: ~15g</p>
            <p style={{ opacity: 0.8, marginBottom: '0.5rem' }}>Carbs: ~45g</p>
            <p style={{ opacity: 0.8, marginBottom: '0.5rem' }}>Fat: ~12g</p>
            <p style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.7 }}>*Values are approximate for illustration.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
