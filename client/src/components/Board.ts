import List from "./List";
import DOM from "../utils/DOM";
import {setStore, store} from "../store";
import Card from "./Card";

const dummy = [
    {
        "index": 0,
        "title": "test-work1",
        "cardList": [
            {
                "index": 0,
                "text": "todo 11"
            },
            {
                "index": 1,
                "text": "asd22"
            },
            {
                "index": 2,
                "text": "asdasd"
            }
        ]
    },
    {
        "index": 1,
        "title": "work22",
        "cardList": [
            {
                "index": 0,
                "text": "111"
            },
            {
                "index": 1,
                "text": "dsfqw2"
            }
        ]
    },
    {
        "index": 2,
        "title": "",
        "cardList": []
    }
];

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

        // dummy test
        // setTimeout(() => {
        //     this.update();
        // }, 2000);
    }

    init() {
        this.render();
        this.addList("", false, []);
    }

    responseEvent() {
        const events = new EventSource('http://localhost:7777/events');
        events.onmessage = (event) => {
            console.log("responseEvent: ", event.data);


            // this.update();
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
                // 'Content-Type': 'application/x-www-form-urlencoded',
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

    addList(title: string, isUpdate: boolean, cardList: {text:string}[]) {
        const listInstance = new List(this, this.listContainer, title, () => {
            this.addList("", false, []);
        });
        this.list.push(listInstance);
        if (isUpdate) listInstance.clean();

        if (cardList.length > 0) {
            cardList.forEach(card => {
                listInstance.pushCard(card.text);
            });
        }

        this.normalize();
    }

    getCardList(cardList: Card[]) {
        return cardList.map((card: Card, index: number) => {
            return {
                index,
                text: card.text
            };
        });
    }

    normalize() {
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

        this.requestEvent(store);
    }

    /*update(data) {
        this.list = [];
        this.listContainer.innerHTML = "";

        data.forEach(list => {
            console.log("update: ", list);
            this.addList(list.title, !!list.title, list.cardList);
        });

    }*/


}