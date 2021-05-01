import List from "./List";
import DOM from "../utils/DOM";
import {CardList, NormalizedList, requestEvent, setStore, store} from "../store";
import Card from "./Card";

export default class Board {
    target: HTMLElement;
    name: string;
    list: List[];
    listContainer: HTMLElement;
    constructor(target: HTMLElement, name: string) {
        this.target = target;
        this.name = name;
        this.list = [];
        this.listContainer = DOM.createElement({
            tagName: "section",
            class: "list-container"
        });

        this.init();
        this.responseEvent();
    }

    init() {
        this.render();
        this.addList("", false, [], true);
    }

    responseEvent() {
        const events = new EventSource('http://localhost:7777/events');
        events.onmessage = (event) => {
            // console.log("responseEvent: ", event.data);
            const response = JSON.parse(event.data);
            this.update(response.length ? response[0].data : response.data);
        };
    }

    render() {
        console.log("Board render");
        const board = DOM.createElement({
            tagName: "div",
            class: "board-container",
            parent: this.target
        });
        const header = DOM.createElement({
            tagName: "header",
            class: "board-header",
            text: this.name,
            parent: board
        });
        board.appendChild(this.listContainer);

    }

    addList(title: string, isUpdate: boolean, cardList: {text:string}[], isRequest: boolean) {
        const listInstance = new List(this, this.listContainer, title, () => {
            this.addList("", false, [], true);
        });
        this.list.push(listInstance);
        if (isUpdate) listInstance.clean();

        if (cardList.length > 0) {
            cardList.forEach(card => {
                listInstance.pushCard(card.text, isRequest);
            });
        }

        this.normalize(isRequest);
    }

    getCardList(cardList: Card[]) {
        return cardList.map((card: Card, index: number) => {
            return {
                index,
                text: card.text,
                id: card.id
            };
        });
    }

    normalize(isRequest: boolean) {
        const normalizedList: NormalizedList[] = [];
        this.list.forEach((list: List, index: number) => {
            normalizedList.push({
                index,
                id: list.id,
                title: list.title,
                cardList: this.getCardList(list.cardList)
            });

        });
        console.log("normalizedList ", normalizedList);
        setStore({
            data: normalizedList
        });

        if (isRequest) requestEvent(store);
    }

    update(data: {title:string, cardList:CardList[]}[]) {
        this.list = [];
        this.listContainer.innerHTML = "";

        data.forEach(list => {
            console.log("update: ", list);
            this.addList(list.title, !!list.title, list.cardList, false);
        });

    }


}