// Clase Card que representa una carta de la baraja
export class Card {
    constructor(suit, value) {
        // Inicializar propiedades de la carta
        this.suit = suit;
        this.value = value;
    }

    getHTML() {
        // Obtener los símbolos de los palos
        const suitSymbols = {
            'hearts': '♥',
            'diamonds': '♦',
            'clubs': '♣',
            'spades': '♠'
        };

        // Devolver el HTML que representa la carta
        return `
            <div class="card" draggable="true" data-suit="${this.suit}" data-value="${this.value}">
                <div class="card-value">${this.value}</div>
                <div class="card-suit ${this.suit}">${suitSymbols[this.suit]}</div>
            </div>
        `;
    }
}