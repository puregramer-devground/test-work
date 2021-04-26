import List from "./List";
import DOM from "../utils/DOM";

export default class Board {
    target: HTMLElement;
    name: string;
    // boardObj: HTMLElement;
    list: List[];
    constructor(target: HTMLElement, name: string) {
        this.target = target;
        this.name = name;
        this.list = [];
        // this.boardObj = null;

        this.init();
    }

    init() {
        this.appendDOM();
    }

    appendDOM() {
        console.log("appendDOM");
        const board = DOM.createElement({
            tagName: "div",
            class: "board-container",
            parent: this.target
        });
    }

    render() {

    }


}