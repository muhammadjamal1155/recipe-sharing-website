import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import RecipeSkeleton from '../components/RecipeSkeleton';
import { Search, Filter, ShoppingBag, X, RotateCcw } from 'lucide-react';
import api from '../api';
import { motion } from 'framer-motion';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const fetchRecipes = async (s, c, t, showSkeletons = false) => {
    const searchQuery = (s.length > 0 && s.length < 3) ? '' : s;

    try {
      if (showSkeletons) setLoading(true);
      
      const res = await api.get('/recipes', {
        params: { search: searchQuery, category: c, time: t }
      });
      setRecipes(res.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      if (showSkeletons) setLoading(false);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialSearch = queryParams.get('search') || '';
    const initialCategory = queryParams.get('category') || '';
    
    setSearch(initialSearch);
    setCategory(initialCategory);
    fetchRecipes(initialSearch, initialCategory, time, true);
  }, [location.search]);

  // Debounced search fetch
  useEffect(() => {
    if (search.length > 0 && search.length < 3) return;

    const timer = setTimeout(() => {
       fetchRecipes(search, category, time, false); 
    }, 500); 

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlCategory = queryParams.get('category') || '';
    if (category !== urlCategory || time !== '') {
       fetchRecipes(search, category, time, true);
    }
  }, [category, time]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes(search, category, time, true);
  };

  const clearSearch = () => {
    setSearch('');
    fetchRecipes('', category, time);
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setTime('');
    fetchRecipes('', '', '', true);
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Explore Recipes</h1>
          <p style={{ color: 'var(--text-muted)' }}>Find your next favorite dish among our collection.</p>
        </div>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="input" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '220px', paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            {search && (
              <X 
                size={18} 
                onClick={clearSearch}
                style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', cursor: 'pointer' }} 
              />
            )}
          </div>
          
          <select className="input" style={{ width: '140px' }} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Categories</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Vegan">Vegan</option>
            <option value="Desserts">Desserts</option>
            <option value="Dinner">Dinner</option>
          </select>
          
          <select className="input" style={{ width: '130px' }} value={time} onChange={(e) => setTime(e.target.value)}>
            <option value="">Any Time</option>
            <option value="5 mins">5 mins</option>
            <option value="15 mins">15 mins</option>
            <option value="30 mins">30 mins</option>
            <option value="1 hr+">1 hr+</option>
          </select>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" title="Apply Filters" style={{ padding: '0.75rem' }}>
              <Filter size={20} />
            </button>
            <button type="button" onClick={resetFilters} className="btn btn-outline" title="Reset All" style={{ padding: '0.75rem', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
              <RotateCcw size={20} />
            </button>
          </div>
        </form>
      </div>



      {/* Only show skeletons if we have no recipes yet to avoid annoying flickering/blinking */}
      {loading && recipes.length === 0 ? (
        <div className="grid grid-cols-3">
          {[...Array(6)].map((_, i) => (
             <RecipeSkeleton key={i} />
          ))}
        </div>
      ) : recipes.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-3"
          key={category + time} // Fade gently once when major filters change, but not on every keystroke
        >
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </motion.div>
      ) : !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '5rem', backgroundColor: 'var(--card-bg)', borderRadius: '1rem', border: '2px dashed var(--border-color)' }}
        >
          <ShoppingBag size={64} style={{ color: 'var(--border-color)', marginBottom: '1.5rem', marginInline: 'auto' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No recipes found</h3>
          <p style={{ color: 'var(--text-muted)' }}>We couldn't find anything matching your search. Try adjusting your filters.</p>
          <button className="btn btn-outline" style={{ marginTop: '1.5rem' }} onClick={() => { setSearch(''); setCategory(''); setTime(''); }}>
            Clear All Filters
          </button>
        </motion.div>
      )}

    </div>
  );
}
