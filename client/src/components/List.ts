import Card from "./Card";
import DOM from "../utils/DOM";
import AddItem from "./AddItem";
import Board from "./Board";
import {updateStoreMap} from "../store";
import {getRandomInt} from "../utils/index";
type UpdateCallBack = () => void;

export default class List {
    target: HTMLElement;
    parent: Board;
    title: string;
    id: number;
    cardList: Card[];
    listBox: HTMLElement;
    cardContainer: HTMLElement;
    addCardItemBox: AddItem;
    addListItemBox: AddItem;
    addCardButton: HTMLElement;
    isShowAddItem: Boolean;
    updateCallBack: UpdateCallBack;

    constructor(parent: Board, target: HTMLElement, title: string, updateCallBack: UpdateCallBack) {
        this.parent = parent;
        this.target = target;
        this.title = title;
        this.id = Date.now() + getRandomInt(0, 1000);
        this.cardList = [];
        this.isShowAddItem = false;
        this.updateCallBack = updateCallBack;
        this.listBox = DOM.createElement({
            tagName: "div",
            class: "list-box",
            parent: this.target
        });

        this.listBox.draggable = true;
        this.listBox.addEventListener('drop', this.dropHandler.bind(this), false);
        this.listBox.addEventListener('dragend', this.dragEndHandler.bind(this), false);
        this.listBox.addEventListener('dragenter', this.dragEnterHandler.bind(this), false);
        this.listBox.addEventListener('dragleave', this.dragLeaveHandler.bind(this), false);
        this.listBox.addEventListener('dragover', this.dragOverHandler.bind(this), false);

        this.cardContainer = DOM.createElement({
            tagName: "div",
            class: "card-container"
        });
        this.addCardButton = DOM.createElement({
            tagName: "a",
            class: "add-card",
            text: "<i></i><span>Add a card</span>",
        });
        this.addCardButton.addEventListener("click", (e) => {
            this.isShowAddItem = true;
            this.visibleAddItem();
        });
        this.addListItemBox = new AddItem(this.listBox, "LIST", (text: string) => {
            this.title = text;
            this.update();
        }, () => {});
        this.addCardItemBox = new AddItem(this.listBox, "CARD", (text: string) => {
            this.pushCard(text, true);
        }, () => {
            this.isShowAddItem = false;
            this.visibleAddItem();
        });

        this.init();

    }

    init() {
        if (this.title) {
            this.render();
        }
    }

    pushCard(text: string, isRequest: boolean) {
        this.cardList.push(new Card(this.cardContainer, text));
        this.parent.normalize(isRequest);
    }

    update() {
        this.clean();
        this.visibleAddItem();
        this.init();
        this.updateCallBack();
    }

    clean() {
        this.addListItemBox.el.style.display = "none";
    }

    visibleAddItem() {
        if (this.isShowAddItem) {
            this.addCardItemBox.el.style.display = "block";
            this.addCardButton.style.display = "none";
        } else {
            this.addCardButton.style.display = "flex";
            this.addCardItemBox.el.style.display = "none";
        }
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
        console.log("list drop--", moveCardItem);
        updateStoreMap(moveCardItem, "del", 0, this.id);
        updateStoreMap(moveCardItem, "add", 0, this.id);
        return false;
    }

    dragEndHandler() {
        console.log("list dragend");
        this.listBox.classList.remove('over');
    }

    dragEnterHandler() {
        console.log("list dragenter");
        this.listBox.classList.add('over');
    }

    dragLeaveHandler() {
        console.log("list dragleave");
        this.listBox.classList.remove('over');
    }

    render() {
        const listTitle = DOM.createElement({
            tagName: "input",
            class: "list-title",
        }) as HTMLInputElement;
        listTitle.value = this.title;
        this.listBox.insertBefore(listTitle, this.addCardItemBox.el);
        this.listBox.insertBefore(this.cardContainer, this.addCardItemBox.el);
        this.listBox.appendChild(this.addCardButton);
    }

}