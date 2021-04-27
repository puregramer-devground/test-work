import Card from "./Card";
import DOM from "../utils/DOM";
import AddItem from "./AddItem";

export default class List {
    target: HTMLElement;
    title: string;
    cardList: Card[];
    listBox: HTMLElement;
    cardContainer: HTMLElement;
    addCardItemBox: AddItem;
    addListItemBox: AddItem;
    addCardButton: HTMLElement;
    isShowAddItem: Boolean;
    constructor(target: HTMLElement, title: string) {
        this.target = target;
        this.title = title;
        this.cardList = [];
        this.isShowAddItem = false;
        this.listBox = DOM.createElement({
            tagName: "div",
            class: "list-box",
            parent: this.target
        });
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
            this.cardList.push(new Card(this.cardContainer, text));

        }, () => {
            this.isShowAddItem = false;
            this.visibleAddItem();
        });

        this.init();
    }

    init() {
        if (this.title) this.render();
    }

    update() {
        this.clean();
        this.visibleAddItem();
        this.init();
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