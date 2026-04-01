import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChefHat, Star } from 'lucide-react';

export default function RecipeCard({ recipe }) {
  const imageUrl = recipe.image 
    ? `http://localhost:3001${recipe.image}`
    : `https://placehold.co/400x250/f97316/ffffff?font=outfit&text=${encodeURIComponent(recipe.title)}`;

  return (
    <Link to={`/recipes/${recipe.id}`} className="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
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
  );
}
