import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import api from '../api';

export default function SubmitRecipe() {
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    category: 'Breakfast',
    time: '15 mins',
    difficulty: 'Easy'
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('ingredients', formData.ingredients);
    data.append('instructions', formData.instructions);
    data.append('category', formData.category);
    data.append('time', formData.time);
    data.append('difficulty', formData.difficulty);
    if (image) data.append('image', image);

    try {
      await api.post('/recipes', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/recipes');
    } catch (error) {
      alert('Error submitting recipe: ' + (error.response?.data?.message || 'Please map sure you are logged in.'));
      if(error.response?.status === 401 || error.response?.status === 403) navigate('/login');
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Submit a Recipe</h1>
      
      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">Recipe Title</label>
            <input 
              required type="text" className="input" 
              placeholder="e.g. Garlic Butter Shrimp" 
              value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Category</label>
              <select className="input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="Breakfast">Breakfast</option>
                <option value="Vegan">Vegan</option>
                <option value="Desserts">Desserts</option>
                <option value="Dinner">Dinner</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <label className="form-label">Cooking Time</label>
              <select className="input" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}>
                <option value="5 mins">5 mins</option>
                <option value="15 mins">15 mins</option>
                <option value="30 mins">30 mins</option>
                <option value="1 hr+">1 hr+</option>
              </select>
            </div>
            <div>
              <label className="form-label">Difficulty</label>
              <select className="input" value={formData.difficulty} onChange={(e) => setFormData({...formData, difficulty: e.target.value})}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ingredients (comma separated)</label>
            <textarea 
              required className="input" rows="4" 
              placeholder="e.g. 2 cups flour, 1 tsp salt, 3 eggs..."
              value={formData.ingredients} onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Step-by-Step Instructions</label>
            <textarea 
              required className="input" rows="6" 
              placeholder="Describe the steps clearly..."
              value={formData.instructions} onChange={(e) => setFormData({...formData, instructions: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Recipe Image (Optional)</label>
            <div style={{ padding: '2rem', border: '2px dashed var(--border-color)', borderRadius: '1rem', textAlign: 'center', backgroundColor: '#f8fafc', position: 'relative' }}>
              {preview ? (
                <>
                  <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                  <button type="button" onClick={() => { setImage(null); setPreview(null); }} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'red', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Remove</button>
                </>
              ) : (
                <>
                  <Upload size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                  <p style={{ color: 'var(--text-muted)' }}>Click to upload an image or drag and drop</p>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>PNG, JPG up to 5MB</p>
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                </>
              )}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}>
            Submit Recipe
          </button>
        </form>
      </div>
    </div>
  );
}
