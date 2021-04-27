import List from "./List";
import DOM from "../utils/DOM";

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
    }

    init() {
        this.render();
        this.addList("");
        // this.addList("");
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

    addList(title: string) {
        this.list.push(new List(this.listContainer, title));

        console.log(this.list);
    }


}