import DOM from "../utils/DOM";
import {requestEvent, store, updateStoreMap} from "../store";
import {getRandomInt} from "../utils/index";

export default class Card {
    target: HTMLElement;
    text: string;
    cardItem: HTMLElement;
    id: number;
    constructor(target: HTMLElement, text: string) {
        this.target = target;
        this.text = text;
        this.id = Date.now() + getRandomInt(0, 10000);
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
        console.log("dragstart");
        this.cardItem.style.opacity = '0.3';

        if (!e.dataTransfer) return;
        e.dataTransfer.setData('cardItem', JSON.stringify({
            id: this.id,
            text: this.text
        }));
    }

    dragEndHandler() {
        console.log("dragend");
        this.cardItem.style.opacity = '1';
        this.cardItem.classList.remove('over');
    }

    dragEnterHandler() {
        console.log("dragenter");
        this.cardItem.classList.add('over');
    }

    dragLeaveHandler() {
        console.log("dragleave");
        this.cardItem.classList.remove('over');
    }

    dragOverHandler(e: DragEvent) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        console.log("dragover");
        return false;
    }

    dropHandler(e: DragEvent) {
        e.stopPropagation();
        if (!e.dataTransfer) return;
        const moveCardItem = e.dataTransfer.getData('cardItem');
        console.log("drop--", moveCardItem);
        updateStoreMap(moveCardItem, "del", this.id, 0);
        updateStoreMap(moveCardItem, "add", this.id, 0);
        return false;
    }




}