// Importar las clases necesarias
import { Card } from '../models/Card.js';
import { DragAndDropManager } from '../dragItems/DragAndDropManager.js';

export class GameManager {
    constructor(apiUrl = 'http://localhost:3000/api') {
        // Inicializar propiedades
        this.apiUrl = apiUrl;
        this.dragAndDropManager = new DragAndDropManager(() => this.saveGameState());
        this.initializeGame();
        this.setupEventListeners();
    }

    async initializeGame() {
        try {
            // Intentar cargar el estado del juego desde la API
            const response = await fetch(`${this.apiUrl}/state`);
            const state = await response.json();
            this.renderGameState(state);
        } catch (error) {
            // Si hay un error, reiniciar el juego
            console.error('Error loading game state:', error);
            await this.resetGame();
        }
    }

    async resetGame() {
        try {
            // Reiniciar el estado del juego a través de la API
            const response = await fetch(`${this.apiUrl}/reset`, { method: 'POST' });
            const state = await response.json();
            this.renderGameState(state);
        } catch (error) {
            console.error('Error resetting game:', error);
        }
    }

    async saveGameState() {
        // Obtener el estado actual del juego
        const state = {
            deck: this.getCardsFromContainer('deck'),
            hearts: this.getCardsFromContainer('hearts'),
            diamonds: this.getCardsFromContainer('diamonds'),
            clubs: this.getCardsFromContainer('clubs'),
            spades: this.getCardsFromContainer('spades')
        };

        try {
            // Guardar el estado del juego a través de la API
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
        // Obtener las cartas de un contenedor específico
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
        // Renderizar el estado del juego en la interfaz de usuario
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
        // Configurar los event listeners
        document.getElementById('resetButton').addEventListener('click', () => this.resetGame());
        this.dragAndDropManager.setupDragAndDrop();
    }
    
}
