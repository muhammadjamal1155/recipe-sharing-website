import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import bannerImage from '../assets/main_banner.webp';

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
    <div style={{ overflowX: 'hidden' }}>
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
        {/* Image Background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: -1, backgroundColor: '#000'
        }}>
          {bannerImage ? <img src={bannerImage} alt="Kitchen" style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6}} /> : <div style={{width:'100%', height: '100%', background: 'linear-gradient(to right, #f97316, #fb923c)'}} />}
        </div>
        
        <div className="container" style={{ zIndex: 1, maxWidth: '800px', padding: '2rem' }}>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: '4rem', marginBottom: '1rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}
          >
            Discover Your Next <span style={{color: 'var(--primary)'}}>Culinary Masterpiece</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: '1.2rem', marginBottom: '2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            Join our community of food lovers to explore, share, and delight in recipes from around the world.
          </motion.p>
          
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onSubmit={handleSearch} 
            style={{ display: 'flex', position: 'relative', maxWidth: '500px', margin: '0 auto 2rem auto' }}
          >
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
          </motion.form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
          >
            <button className="btn btn-primary" onClick={() => navigate('/recipes')}>
              Browse Recipes <ArrowRight size={18} style={{marginLeft: '0.5rem'}}/>
            </button>
            <button className="btn" style={{backgroundColor: 'white', color: '#0f172a'}} onClick={() => navigate('/submit')}>
               Submit a Recipe
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container" style={{ padding: '8rem 1rem' }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Featured Categories</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>Explore recipes tailored to your cravings and dietary preferences.</p>
        </motion.div>

        <div className="grid grid-cols-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2.5rem' }}>
          {categories.map((cat, idx) => (
            <motion.div 
              key={idx} 
              className="card" 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -10, boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5)' }}
              onClick={() => navigate(`/recipes?category=${cat.name}`)}
              style={{ 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '4rem 2rem', cursor: 'pointer', textAlign: 'center', 
                background: `linear-gradient(135deg, rgba(255,255,255,0.03), ${cat.color}15)`,
                border: '1px solid rgba(255,255,255,0.05)', borderRadius: '2.5rem'
              }}
            >
              <div style={{ 
                fontSize: '4.5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))',
                transform: 'scale(1)', transition: 'transform 0.3s'
              }}>
                {cat.icon}
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>{cat.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>


    </div>
  );
}
