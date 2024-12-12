import { Card } from '../models/Card.js';

export class DragAndDropManager {
    constructor(saveGameStateCallback) {
        // Inicializar la callback para guardar el estado del juego
        this.saveGameState = saveGameStateCallback;
    }

    setupDragAndDrop() {
        // Configurar eventos de arrastrar y soltar para las cartas y contenedores
        const cards = document.querySelectorAll('.card');
        const containers = document.querySelectorAll('.card-container');

        cards.forEach(card => {
            card.addEventListener('dragstart', this.handleDragStart);
            card.addEventListener('dragend', () => this.saveGameState());
        });

        containers.forEach(container => {
            container.addEventListener('dragover', this.handleDragOver);
            container.addEventListener('drop', (e) => this.handleDrop(e));
        });
    }

    handleDragStart(e) {
        // Manejar el inicio del arrastre de una carta
        e.dataTransfer.setData('text/plain', JSON.stringify({
            suit: e.target.dataset.suit,
            value: e.target.dataset.value
        }));
    }

    handleDragOver(e) {
        // Permitir que el contenedor acepte el arrastre
        e.preventDefault();
    }

    handleDrop(e) {
        // Manejar el evento de soltar una carta en un contenedor
        e.preventDefault();
        const cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
        const targetContainer = e.target.closest('.card-container');

        if (!targetContainer) return;

        const draggedCard = document.querySelector(`[data-suit="${cardData.suit}"][data-value="${cardData.value}"]`);

        if (targetContainer.id === 'deck' || targetContainer.dataset.acceptSuit === cardData.suit) {
            if (draggedCard) {
                const card = new Card(cardData.suit, cardData.value);
                draggedCard.remove();
                targetContainer.innerHTML += card.getHTML();
                this.setupDragAndDrop();
            }
        } else {
            this.showAlert(`Esta carta debe ir en el mazo de ${this.getSuitName(cardData.suit)}`);
        }
    }

    showAlert(message) {
        // Mostrar una alerta con un mensaje específico
        const alert = document.getElementById('alert');
        alert.querySelector('.alert-message').textContent = message;
        alert.classList.add('show-alert');
        setTimeout(() => {
            alert.classList.remove('show-alert');
        }, 2000);
    }

    getSuitName(suit) {
        // Obtener el nombre del palo en español
        const suitNames = {
            'hearts': 'corazones',
            'diamonds': 'diamantes',
            'clubs': 'tréboles',
            'spades': 'picas'
        };
        return suitNames[suit];
    }
}