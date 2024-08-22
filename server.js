const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

let projects = [];
const users = [
    { username: 'amit', password: 'amit098' } // Change this as needed
];

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        jwt.verify(token, 'your_secret_key', (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Get all projects
app.get('/projects', (req, res) => {
    res.json(projects);
});

// Add a new project
app.post('/projects', authenticateJWT, (req, res) => {
    const { title, description, imageUrl } = req.body;
    const newProject = { id: Date.now().toString(), title, description, imageUrl };
    projects.push(newProject);
    res.status(201).json(newProject);
});

// Delete a project by ID
app.delete('/projects/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    projects = projects.filter(project => project.id !== id);
    res.status(200).json({ message: 'Project deleted' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
