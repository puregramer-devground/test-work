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

        this.cardItem.draggable = true;
        this.cardItem.addEventListener('dragstart', this.dragStartHandler.bind(this), false);
        this.cardItem.addEventListener('drop', this.dropHandler.bind(this), false);
        this.cardItem.addEventListener('dragend', this.dragEndHandler.bind(this), false);
        this.cardItem.addEventListener('dragenter', this.dragEnterHandler.bind(this), false);
        this.cardItem.addEventListener('dragleave', this.dragLeaveHandler.bind(this), false);
        this.cardItem.addEventListener('dragover', this.dragOverHandler.bind(this), false);

    }

    dragStartHandler(e: DragEvent) {
        console.log("dragstart", e.dataTransfer);
        this.cardItem.style.opacity = '0.3';

        if (!e.dataTransfer) return;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.cardItem.innerHTML);
    }

    dragEndHandler() {
        this.cardItem.style.opacity = '1';
        this.cardItem.classList.remove('over');
    }

    dragEnterHandler() {
        this.cardItem.classList.add('over');
    }

    dragLeaveHandler() {
        this.cardItem.classList.remove('over');
    }

    dragOverHandler(e: DragEvent) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        if (!e.dataTransfer) return ;
        e.dataTransfer.dropEffect = "move";
        return false;
    }

    dropHandler(e: DragEvent) {
        e.stopPropagation();
        console.log("drop", e.dataTransfer);
        if (!e.dataTransfer) return;
        e.dataTransfer.dropEffect = "move";
        this.cardItem.innerHTML = e.dataTransfer.getData('text/html');
        return false;
    }

}