import DOM from "../utils/DOM";

export default class Card {
    target: HTMLElement;
    text: string;
    cardItem: HTMLElement;
    constructor(target: HTMLElement, text: string) {
        this.target = target;
        this.text = text;
        this.cardItem = DOM.createElement({
            tagName: "div",
            class: "card-item",
            text: text,
            parent: this.target
        });
    }

}