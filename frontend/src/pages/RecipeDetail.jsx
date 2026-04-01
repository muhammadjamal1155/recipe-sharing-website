import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChefHat, Star, Trash2, Edit, Users, Plus, Minus, CheckCircle } from 'lucide-react';
import api from '../api';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [servings, setServings] = useState(4);
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  
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

  const toggleIngredient = (idx) => {
    if (checkedIngredients.includes(idx)) {
      setCheckedIngredients(checkedIngredients.filter(i => i !== idx));
    } else {
      setCheckedIngredients([...checkedIngredients, idx]);
    }
  };

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

  if (loading) return (
    <div className="container fade-in" style={{ padding: '5rem', textAlign: 'center' }}>
      <div className="skeleton" style={{ height: '400px', width: '100%', borderRadius: '1rem', marginBottom: '2rem' }}></div>
      <div className="skeleton" style={{ height: '40px', width: '60%', margin: '0 auto 1rem', borderRadius: '4px' }}></div>
    </div>
  );

  const imageUrl = recipe.image 
    ? `http://localhost:3001${recipe.image}`
    : `https://placehold.co/1200x500/f8fafc/0f172a?font=outfit&text=${encodeURIComponent(recipe.title)}`;

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div style={{ height: '450px', width: '100%', position: 'relative' }}>
        <img src={imageUrl} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}></div>
        <div className="container" style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '3rem 1rem', color: 'white' }}>
          <span style={{ background: 'var(--primary)', color: 'white', padding: '0.3rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '1.5rem', display: 'inline-block' }}>
            {recipe.category}
          </span>
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>{recipe.title}</h1>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '1.1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Star size={20} fill="#fbbf24" color="#fbbf24"/> {recipe.rating || 'New'}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={20} /> {recipe.time}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ChefHat size={20} /> {recipe.difficulty}</span>
            <span style={{ opacity: 0.8 }}>By {recipe.author}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '4rem 1rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '4rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Ingredients</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <Users size={18} color="var(--text-muted)" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <button 
                  onClick={() => servings > 1 && setServings(servings - 1)}
                  style={{ color: 'var(--primary)', padding: '0.2rem' }}
                >
                  <Minus size={20} />
                </button>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', minWidth: '40px', textAlign: 'center' }}>{servings}</span>
                <button 
                  onClick={() => setServings(servings + 1)}
                  style={{ color: 'var(--primary)', padding: '0.2rem' }}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '4rem' }}>
            {recipe.ingredients.split(',').map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => toggleIngredient(idx)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', 
                  backgroundColor: checkedIngredients.includes(idx) ? '#f0fdf4' : 'transparent',
                  borderRadius: '1rem', border: '1px solid', borderColor: checkedIngredients.includes(idx) ? '#bbf7d0' : 'var(--border-color)',
                  cursor: 'pointer', transition: 'all 0.2s', opacity: checkedIngredients.includes(idx) ? 0.7 : 1
                }}
              >
                <div style={{ 
                  width: '24px', height: '24px', borderRadius: '6px', border: '2px solid', 
                  borderColor: checkedIngredients.includes(idx) ? '#22c55e' : 'var(--border-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: checkedIngredients.includes(idx) ? '#22c55e' : 'transparent'
                }}>
                  {checkedIngredients.includes(idx) && <CheckCircle size={16} color="white" />}
                </div>
                <span style={{ 
                   fontSize: '1.1rem', 
                   textDecoration: checkedIngredients.includes(idx) ? 'line-through' : 'none',
                   color: checkedIngredients.includes(idx) ? 'var(--text-muted)' : 'var(--text-main)',
                   fontWeight: 500
                }}>
                  {item.trim()}
                </span>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Instructions</h2>
          <div style={{ fontSize: '1.25rem', lineHeight: '2', whiteSpace: 'pre-line', color: 'var(--text-main)', backgroundColor: '#fffbf7', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid #fef3c7' }}>
            {recipe.instructions}
          </div>
        </div>

        <div>
          {currentUser === recipe.author && (
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid #fee2e2' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Creator Tools</h3>
              <button onClick={handleDelete} className="btn" style={{ width: '100%', backgroundColor: '#ef4444', color: 'white', marginBottom: '1rem' }}>
                <Trash2 size={18} style={{ marginRight: '0.5rem' }} /> Delete Recipe
              </button>
              <button onClick={() => navigate(`/edit/${id}`)} className="btn btn-outline" style={{ width: '100%', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                <Edit size={18} style={{ marginRight: '0.5rem' }} /> Edit Recipe
              </button>
            </div>
          )}
          
          <div className="card" style={{ padding: '2.5rem', backgroundColor: 'var(--text-main)', color: 'white', border: 'none' }}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Chef's Notes</h3>
              <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Estimated values per serving ({servings} portions)</p>
            </div>
            
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.8 }}>Calories</span>
                <span style={{ fontWeight: 700 }}>~{(350 * (4/servings)).toFixed(0)} kcal</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.8 }}>Protein</span>
                <span style={{ fontWeight: 700 }}>~{(15 * (4/servings)).toFixed(1)}g</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.8 }}>Prep Effort</span>
                <span style={{ fontWeight: 700 }}>High Quality</span>
              </div>
            </div>
            
            <p style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.5, fontStyle: 'italic' }}>
              *Interactive recipe powered by RecipeHub Smart Engine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
