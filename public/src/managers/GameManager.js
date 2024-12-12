// GameManager.js
import { Card } from '../models/Card.js';
import { DragAndDropManager } from '../dragItems/DragAndDropManager.js';

export class GameManager {
    constructor(apiUrl = 'http://localhost:3000/api') {
        this.apiUrl = apiUrl;
        this.dragAndDropManager = new DragAndDropManager(() => this.saveGameState());
        this.initializeGame();
        this.setupEventListeners();
    }

    async initializeGame() {
        try {
            const response = await fetch(`${this.apiUrl}/state`);
            const state = await response.json();
            this.renderGameState(state);
        } catch (error) {
            console.error('Error loading game state:', error);
            await this.resetGame();
        }
    }

    async resetGame() {
        try {
            const response = await fetch(`${this.apiUrl}/reset`, { method: 'POST' });
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
            await fetch(`${this.apiUrl}/state`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
        this.dragAndDropManager.setupDragAndDrop();
    }

    setupEventListeners() {
        document.getElementById('resetButton').addEventListener('click', () => this.resetGame());
        this.dragAndDropManager.setupDragAndDrop();
    }
    
}
