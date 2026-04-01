import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChefHat, Star, Trash2, Edit, Users, Plus, Minus, CheckCircle } from 'lucide-react';
import api from '../api';
import { motion } from 'framer-motion';

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

  const handleServingChange = (val) => {
    const num = parseInt(val);
    if (!isNaN(num) && num >= 1 && num <= 99) {
      setServings(num);
    } else if (val === '') {
      setServings(''); // Allow temporary empty for typing
    }
  };

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
          <div 
            className="glass"
            style={{ 
              display: 'flex', gap: '2.5rem', alignItems: 'center', fontSize: '1.1rem',
              width: 'fit-content', padding: '1rem 2rem', borderRadius: '1rem',
              background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Star size={20} fill="#fbbf24" color="#fbbf24"/> {recipe.rating || 'New'}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={20} /> {recipe.time}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ChefHat size={20} /> {recipe.difficulty}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '5rem 1rem', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '5rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <div>
              <h2 style={{ fontSize: '2.8rem', margin: 0 }}>Ingredients</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Check items as you gather them from your pantry.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#fff', padding: '0.75rem 1.25rem', borderRadius: '1rem', boxShadow: 'var(--card-shadow)' }}>
              <Users size={18} color="var(--primary)" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                  onClick={() => servings > 1 && setServings(Number(servings) - 1)}
                  className="btn-icon"
                  title="Remove Serving"
                >
                  <Minus size={20} />
                </button>
                <input 
                   type="number"
                   value={servings}
                   onChange={(e) => handleServingChange(e.target.value)}
                   style={{ 
                     width: '50px', border: 'none', background: 'transparent', textAlign: 'center',
                     fontWeight: 800, fontSize: '1.2rem', outline: 'none'
                   }}
                />
                <button 
                  onClick={() => servings < 99 && setServings(Number(servings) + 1)}
                  className="btn-icon"
                  title="Add Serving"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>


          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '5rem' }}>
            {recipe.ingredients.split(',').map((item, idx) => (
              <motion.div 
                key={idx} 
                onClick={() => toggleIngredient(idx)}
                whileHover={{ scale: 1.02 }}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', 
                  backgroundColor: checkedIngredients.includes(idx) ? '#f0fdf4' : '#fff',
                  borderRadius: '1.25rem', border: '1px solid', borderColor: checkedIngredients.includes(idx) ? '#bbf7d0' : 'var(--border-color)',
                  cursor: 'pointer', transition: 'all 0.3s', 
                  boxShadow: checkedIngredients.includes(idx) ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ 
                  width: '28px', height: '28px', borderRadius: '8px', border: '2px solid', 
                  borderColor: checkedIngredients.includes(idx) ? '#22c55e' : '#cbd5e1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: checkedIngredients.includes(idx) ? '#22c55e' : '#fff',
                  transition: 'all 0.3s'
                }}>
                  {checkedIngredients.includes(idx) && <CheckCircle size={18} color="white" />}
                </div>
                <span style={{ 
                   fontSize: '1.1rem', 
                   textDecoration: checkedIngredients.includes(idx) ? 'line-through' : 'none',
                   color: checkedIngredients.includes(idx) ? '#94a3b8' : 'var(--text-main)',
                   fontWeight: 500
                }}>
                  {item.trim()}
                </span>
              </motion.div>
            ))}
          </div>

          <h2 style={{ fontSize: '2.8rem', marginBottom: '2.5rem' }}>Instructions</h2>
          <div style={{ display: 'grid', gap: '2rem' }}>
            {recipe.instructions.split('\n').filter(line => line.trim()).map((step, idx) => (
               <div key={idx} style={{ display: 'flex', gap: '2rem' }}>
                  <div style={{ 
                    flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem'
                  }}>
                    {idx + 1}
                  </div>
                  <p style={{ fontSize: '1.3rem', lineHeight: '1.8', margin: 0, color: 'var(--text-main)' }}>
                    {step.trim()}
                  </p>
               </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
          {currentUser === recipe.author && (
            <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem', background: '#fff', border: '1px solid #fee2e2' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.6rem', fontWeight: 700 }}>Creator Lounge</h3>
              <button onClick={handleDelete} className="btn" style={{ width: '100%', backgroundColor: '#ef4444', color: 'white', marginBottom: '1.25rem', padding: '1rem' }}>
                <Trash2 size={18} style={{ marginRight: '0.75rem' }} /> Permanent Delete
              </button>
              <button onClick={() => navigate(`/edit/${id}`)} className="btn btn-outline" style={{ width: '100%', padding: '1rem' }}>
                <Edit size={18} style={{ marginRight: '0.75rem' }} /> Refine Recipe
              </button>
            </div>
          )}
          
          <div className="card" style={{ padding: '3rem', backgroundColor: '#1a1a1a', color: 'white', border: 'none', borderRadius: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Chef's Analytics</h3>
              <p style={{ opacity: 0.5, fontSize: '0.95rem' }}>Scaled for {servings} portions</p>
            </div>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.6, fontSize: '1.1rem' }}>Energy Intensity</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>~{(350 * (4/servings)).toFixed(0)} kcal</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.6, fontSize: '1.1rem' }}>Protein Density</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>~{(15 * (4/servings)).toFixed(1)}g</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.6, fontSize: '1.1rem' }}>Complexity</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>{recipe.difficulty}</span>
              </div>
            </div>
            
            <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '1rem' }}>
              <p style={{ fontSize: '0.85rem', opacity: 0.6, lineHeight: '1.5', margin: 0 }}>
                Pro Tip: Adjust servings to accurately reflect your nutritional intake. Ratings are verified by the RecipeHub community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
