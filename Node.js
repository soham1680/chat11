const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3000;

// Load environment variables from .env file
require('dotenv').config();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));

// Sample user data (replace with a database)
const users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' }
];

// Sample messages data (replace with a database)
const messages = [];

// Check if the user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.authenticated) {
    return next();
  } else {
    res.redirect('/login');
  }
}

// Routes
app.get('/', isAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    req.session.authenticated = true;
    req.session.username = username; // Store the username in the session
    res.redirect('/');
  } else {
    res.send('Invalid login credentials.');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.get('/get-messages', isAuthenticated, (req, res) => {
  res.json(messages);
});

app.post('/send-message', isAuthenticated, (req, res) => {
  const { text } = req.body;
  const username = req.session.username;
  messages.push({ username, text });
  res.sendStatus(200);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
