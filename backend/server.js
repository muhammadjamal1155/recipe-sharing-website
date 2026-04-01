const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = 3001;
const JWT_SECRET = 'supersecretjwtkey123';

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(path.join(__dirname, 'uploads'))) fs.mkdirSync(path.join(__dirname, 'uploads'));

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const RECIPES_FILE = path.join(DATA_DIR, 'recipes.json');

// Initialize DB files
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([]));
if (!fs.existsSync(RECIPES_FILE)) fs.writeFileSync(RECIPES_FILE, JSON.stringify([
  {
    id: 1,
    title: "Classic Pancakes",
    ingredients: "Flour, Milk, Eggs, Sugar, Baking Powder",
    instructions: "Mix ingredients. Pour on griddle. Flip. Serve.",
    category: "Breakfast",
    time: "15 mins",
    difficulty: "Easy",
    image: null,
    rating: 4.5,
    author: "admin"
  },
  {
    id: 2,
    title: "Vegan Avocado Toast",
    ingredients: "Bread, Avocado, Salt, Pepper, Lemon Juice",
    instructions: "Toast bread. Mash avocado with lemon, salt, and pepper. Spread on toast.",
    category: "Vegan",
    time: "5 mins",
    difficulty: "Easy",
    image: null,
    rating: 4.8,
    author: "admin"
  },
  {
    id: 3,
    title: "Chocolate Lava Cake",
    ingredients: "Chocolate, Butter, Sugar, Eggs, Flour",
    instructions: "Melt chocolate and butter. Mix in sugar, eggs, flour. Bake at 400F for 10 mins.",
    category: "Desserts",
    time: "30 mins",
    difficulty: "Medium",
    image: null,
    rating: 4.9,
    author: "admin"
  }
]));

const readData = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeData = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Setup Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Users Routes
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  
  const users = readData(USERS_FILE);
  if (users.find(u => u.username === username)) return res.status(400).json({ message: 'User already exists' });
  
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ id: Date.now(), username, password: hashedPassword });
  writeData(USERS_FILE, users);
  
  res.status(201).json({ message: 'Registered successfully' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readData(USERS_FILE);
  const user = users.find(u => u.username === username);
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, username: user.username });
});

app.get('/api/users/me', authenticateToken, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username });
});

// Recipes Routes
app.get('/api/recipes', (req, res) => {
  const { search, category, time } = req.query;
  let recipes = readData(RECIPES_FILE);
  
  if (search) {
    recipes = recipes.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.ingredients.toLowerCase().includes(search.toLowerCase()));
  }
  if (category) {
    recipes = recipes.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }
  if (time) {
    // Basic prefix matching or string matching for simplicity
    recipes = recipes.filter(r => r.time === time);
  }
  
  res.json(recipes);
});

app.get('/api/recipes/:id', (req, res) => {
  const recipes = readData(RECIPES_FILE);
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  res.json(recipe);
});

app.post('/api/recipes', authenticateToken, upload.single('image'), (req, res) => {
  const { title, ingredients, instructions, category, time, difficulty } = req.body;
  const recipes = readData(RECIPES_FILE);
  
  const newRecipe = {
    id: Date.now(),
    title,
    ingredients,
    instructions,
    category,
    time,
    difficulty: difficulty || 'Medium',
    image: req.file ? '/uploads/' + req.file.filename : null,
    rating: 0,
    author: req.user.username
  };
  
  recipes.unshift(newRecipe);
  writeData(RECIPES_FILE, recipes);
  
  res.status(201).json(newRecipe);
});

app.delete('/api/recipes/:id', authenticateToken, (req, res) => {
  let recipes = readData(RECIPES_FILE);
  const recipeIndex = recipes.findIndex(r => r.id === parseInt(req.params.id));
  if (recipeIndex === -1) return res.status(404).json({ message: 'Recipe not found' });
  
  if (recipes[recipeIndex].author !== req.user.username) {
     return res.status(403).json({ message: 'Not authorized to delete this recipe' });
  }
  
  recipes.splice(recipeIndex, 1);
  writeData(RECIPES_FILE, recipes);
  res.json({ message: 'Recipe deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
