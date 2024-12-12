// Card class to handle card-related operations
class Card {
    constructor(suit, value) {
      this.suit = suit;
      this.value = value;
    }
  
    // Get card HTML representation
    getHTML() {
      const suitSymbols = {
        'hearts': '♥',
        'diamonds': '♦',
        'clubs': '♣',
        'spades': '♠'
      };
  
      return `
        <div class="card" draggable="true" data-suit="${this.suit}" data-value="${this.value}">
          <div class="card-value">${this.value}</div>
          <div class="card-suit ${this.suit}">${suitSymbols[this.suit]}</div>
        </div>
      `;
    }
  }
  
  // Game manager class to handle game state and operations
  class GameManager {
    constructor() {
      this.initializeGame();
      this.setupEventListeners();
    }
  
    async initializeGame() {
      try {
        const response = await fetch('http://localhost:3000/api/state');
        const state = await response.json();
        this.renderGameState(state);
      } catch (error) {
        console.error('Error loading game state:', error);
        await this.resetGame();
      }
    }
  
    async resetGame() {
      try {
        const response = await fetch('http://localhost:3000/api/reset', {
          method: 'POST'
        });
        const state = await response.json();
        this.renderGameState(state);
      } catch (error) {
        console.error('Error resetting game:', error);
      }
    }
  
    async saveGameState() {
      const state = {
        deck: this.getCardsFromContainer('deck'),
        hearts: this.getCardsFromContainer('hearts'),
        diamonds: this.getCardsFromContainer('diamonds'),
        clubs: this.getCardsFromContainer('clubs'),
        spades: this.getCardsFromContainer('spades')
      };
  
      try {
        await fetch('http://localhost:3000/api/state', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(state)
        });
      } catch (error) {
        console.error('Error saving game state:', error);
      }
    }
  
    getCardsFromContainer(containerId) {
      const container = document.getElementById(containerId);
      const cards = [];
      container.querySelectorAll('.card').forEach(cardElement => {
        cards.push({
          suit: cardElement.dataset.suit,
          value: cardElement.dataset.value
        });
      });
      return cards;
    }
  
    renderGameState(state) {
      Object.entries(state).forEach(([containerId, cards]) => {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        cards.forEach(cardData => {
          const card = new Card(cardData.suit, cardData.value);
          container.innerHTML += card.getHTML();
        });
      });
      this.setupDragAndDrop();
    }
  
    setupEventListeners() {
      document.getElementById('resetButton').addEventListener('click', () => this.resetGame());
      this.setupDragAndDrop();
    }
  
    setupDragAndDrop() {
      const cards = document.querySelectorAll('.card');
      const containers = document.querySelectorAll('.card-container');
  
      cards.forEach(card => {
        card.addEventListener('dragstart', this.handleDragStart);
        card.addEventListener('dragend', () => this.saveGameState());
      });
  
      containers.forEach(container => {
        container.addEventListener('dragover', this.handleDragOver);
        container.addEventListener('drop', this.handleDrop);
      });
    }
  
    handleDragStart(e) {
      e.dataTransfer.setData('text/plain', JSON.stringify({
        suit: e.target.dataset.suit,
        value: e.target.dataset.value
      }));
    }
  
    handleDragOver(e) {
      e.preventDefault();
    }
  
    handleDrop(e) {
      e.preventDefault();
      const cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
      const targetContainer = e.target.closest('.card-container');
      
      if (!targetContainer) return;
      
      // Check if the card can be dropped in this container
      if (targetContainer.dataset.acceptSuit === cardData.suit) {
        const card = new Card(cardData.suit, cardData.value);
        const draggedCard = document.querySelector(`[data-suit="${cardData.suit}"][data-value="${cardData.value}"]`);
        
        if (draggedCard) {
          draggedCard.remove();
          targetContainer.innerHTML += card.getHTML();
        }
      }
    }
  }