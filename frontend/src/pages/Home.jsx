import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import bannerImage from '../assets/main_banner.webp'; // Will link to the generated artifact

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if(query.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(query)}`);
    }
  };

  const categories = [
    { name: 'Breakfast', icon: '🍳', color: '#fef08a' },
    { name: 'Vegan', icon: '🥗', color: '#bbf7d0' },
    { name: 'Desserts', icon: '🍰', color: '#fbcfe8' },
    { name: 'Dinner', icon: '🍝', color: '#fed7aa' }
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section style={{
        position: 'relative',
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* We place image in an img tag or background. Using absolute position for better loading */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: -1, backgroundColor: '#000'
        }}>
          {bannerImage ? <img src={bannerImage} alt="Kitchen" style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6}} /> : <div style={{width:'100%', height: '100%', background: 'linear-gradient(to right, #f97316, #fb923c)'}} />}
        </div>
        
        <div className="container" style={{ zIndex: 1, maxWidth: '800px', padding: '2rem', animation: 'fadeIn 1s ease-in-out' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
            Discover Your Next <span style={{color: 'var(--primary)'}}>Culinary Masterpiece</span>
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            Join our community of food lovers to explore, share, and delight in recipes from around the world.
          </p>
          
          <form onSubmit={handleSearch} style={{ display: 'flex', position: 'relative', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
             <input 
               type="text" 
               className="input" 
               placeholder="Search recipes, ingredients..." 
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               style={{ paddingRight: '3rem', fontSize: '1.2rem', padding: '1rem 3rem 1rem 1.5rem', borderRadius: '999px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
             />
             <button type="submit" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }}>
               <Search size={24} />
             </button>
          </form>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/recipes')}>
              Browse Recipes <ArrowRight size={18} style={{marginLeft: '0.5rem'}}/>
            </button>
            <button className="btn" style={{backgroundColor: 'white', color: 'var(--text-main)'}} onClick={() => navigate('/submit')}>
              Submit a Recipe
            </button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container" style={{ padding: '5rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Featured Categories</h2>
          <p style={{ color: 'var(--text-muted)' }}>Explore recipes tailored to your cravings and dietary preferences.</p>
        </div>

        <div className="grid grid-cols-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {categories.map((cat, idx) => (
            <div key={idx} className="card" 
                 onClick={() => navigate(`/recipes?category=${cat.name}`)}
                 style={{ 
                   display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                   padding: '3rem 2rem', cursor: 'pointer', textAlign: 'center', background: `linear-gradient(135deg, white, ${cat.color}20)`
                 }}>
              <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>{cat.icon}</span>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
