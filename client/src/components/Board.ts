import List from "./List";
import DOM from "../utils/DOM";
import {setStore, store} from "../store";
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

    requestEvent(data: {}) {
        fetch("http://localhost:7777/add", {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(data),
        })
            .then(response => {
                console.log("response: ", response);
                // response.json();
            })
            .catch(e => {
                console.log("requestEvent error: ", e);
            })

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
                text: card.text
            };
        });
    }

    normalize(isRequest: boolean) {
        const normalizedList: object[] = [];
        this.list.forEach((list: List, index: number) => {
            normalizedList.push({
                index,
                title: list.title,
                cardList: this.getCardList(list.cardList)
            });

        });

        setStore({
            data: normalizedList
        });

        if (isRequest) this.requestEvent(store);
    }

    update(data: {title:string, cardList:[]}[]) {
        this.list = [];
        this.listContainer.innerHTML = "";

        data.forEach(list => {
            console.log("update: ", list);
            this.addList(list.title, !!list.title, list.cardList, false);
        });

    }


}