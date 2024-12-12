const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// In-memory storage for card state
let gameState = {
  deck: [],
  hearts: [],
  diamonds: [],
  clubs: [],
  spades: []
};

// Middleware
app.use(cors());
app.use(express.json());

// Get current game state
app.get('/api/state', (req, res) => {
  res.json(gameState);
});

// Update game state
app.post('/api/state', (req, res) => {
  gameState = req.body;
  res.json({ success: true });
});

// Reset game state
app.post('/api/reset', (req, res) => {
  gameState = {
    deck: generateDeck(),
    hearts: [],
    diamonds: [],
    clubs: [],
    spades: []
  };
  res.json(gameState);
});

function generateDeck() {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck = [];

  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }

  // Shuffle deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});