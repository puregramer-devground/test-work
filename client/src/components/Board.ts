import List from "./List";
import DOM from "../utils/DOM";
import {setStore} from "../store";
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

        // dummy test
        // setTimeout(() => {
        //     this.update();
        // }, 2000);
    }

    init() {
        this.render();
        this.addList("", false, []);
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
    }

    update() {
        this.list = [];
        this.listContainer.innerHTML = "";

        dummy.forEach(list => {
            console.log("update: ", list);
            this.addList(list.title, !!list.title, list.cardList);

            /*if (list.cardList) {
                for (let i = 0; i < list.cardList.length; i++) {

                }
            }*/
        });

    }


}