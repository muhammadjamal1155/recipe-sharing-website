import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import RecipeSkeleton from '../components/RecipeSkeleton';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import api from '../api';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialSearch = queryParams.get('search') || '';
    const initialCategory = queryParams.get('category') || '';
    
    setSearch(initialSearch);
    setCategory(initialCategory);
    fetchRecipes(initialSearch, initialCategory, time);
  }, [location.search]);

  useEffect(() => {
    fetchRecipes(search, category, time);
  }, [category, time]);

  const fetchRecipes = async (s, c, t) => {
    try {
      setLoading(true);
      const res = await api.get('/recipes', {
        params: { search: s, category: c, time: t }
      });
      setRecipes(res.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes(search, category, time);
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Browse Recipes</h1>
          <p style={{ color: 'var(--text-muted)' }}>Find your next favorite dish among our collection.</p>
        </div>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="input" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '250px', paddingLeft: '2.5rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
          
          <select className="input" style={{ width: '150px' }} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Vegan">Vegan</option>
            <option value="Desserts">Desserts</option>
            <option value="Dinner">Dinner</option>
          </select>
          
          <select className="input" style={{ width: '150px' }} value={time} onChange={(e) => setTime(e.target.value)}>
            <option value="">Any Time</option>
            <option value="5 mins">5 mins</option>
            <option value="15 mins">15 mins</option>
            <option value="30 mins">30 mins</option>
            <option value="1 hr+">1 hr+</option>
          </select>
          
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
            <Filter size={20} />
          </button>
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-3">
          {[...Array(6)].map((_, i) => <RecipeSkeleton key={i} />)}
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-3">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem', backgroundColor: 'var(--card-bg)', borderRadius: '1rem', border: '2px dashed var(--border-color)' }}>
          <ShoppingBag size={64} style={{ color: 'var(--border-color)', marginBottom: '1.5rem', marginInline: 'auto' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No recipes found</h3>
          <p style={{ color: 'var(--text-muted)' }}>We couldn't find anything matching your search. Try adjusting your filters.</p>
          <button className="btn btn-outline" style={{ marginTop: '1.5rem' }} onClick={() => { setSearch(''); setCategory(''); setTime(''); }}>
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
