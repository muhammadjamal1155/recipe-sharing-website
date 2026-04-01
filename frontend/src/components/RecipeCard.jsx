import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChefHat, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecipeCard({ recipe }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const user = localStorage.getItem('username');

  useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      return;
    }
    const favorites = JSON.parse(localStorage.getItem(`favorites_${user}`) || '[]');
    setIsFavorite(favorites.includes(recipe.id));
  }, [recipe.id, user]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      return; // Or show login prompt toast
    }

    const key = `favorites_${user}`;
    const favorites = JSON.parse(localStorage.getItem(key) || '[]');
    let updated;
    if (favorites.includes(recipe.id)) {
      updated = favorites.filter(id => id !== recipe.id);
    } else {
      updated = [...favorites, recipe.id];
    }
    localStorage.setItem(key, JSON.stringify(updated));
    setIsFavorite(updated.includes(recipe.id));
  };

  const imageUrl = recipe.image 
    ? `http://localhost:3001${recipe.image}`
    : `https://placehold.co/400x250/f97316/ffffff?font=outfit&text=${encodeURIComponent(recipe.title)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Link to={`/recipes/${recipe.id}`} className="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit', position: 'relative' }}>
        <button 
          onClick={toggleFavorite}
          style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', padding: '0.5rem', display: 'flex', transition: 'all 0.3s' }}
        >
          <Heart size={20} fill={isFavorite ? "#ef4444" : "transparent"} color={isFavorite ? "#ef4444" : "#64748b"} />
        </button>

        <div style={{ height: '200px', overflow: 'hidden' }}>
          <img src={imageUrl} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)', fontWeight: '700' }}>
              {recipe.category}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24', fontSize: '0.9rem', fontWeight: 'bold' }}>
              <Star size={16} fill="currentColor" /> {recipe.rating || 'New'}
            </div>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {recipe.title}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {recipe.ingredients}
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={16} /> {recipe.time}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ChefHat size={16} /> {recipe.difficulty}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

