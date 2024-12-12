// Card.js
export class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }

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