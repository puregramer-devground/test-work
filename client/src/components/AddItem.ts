import DOM from "../utils/DOM";
type CallBack = (text: string) => void;
type CloseCallBack = () => void;

export default class AddItem {
    target: HTMLElement;
    type: string;
    callBack: CallBack;
    closeCallBack: CloseCallBack;
    addItemBox: HTMLElement;
    constructor(target: HTMLElement, type: string, callBack: CallBack, closeCallBack: CloseCallBack) {
        this.target = target;
        this.type = type;
        this.callBack = callBack;
        this.closeCallBack = closeCallBack;
        this.addItemBox = DOM.createElement({
            tagName: "div",
            class: "add-item-box",
            parent: this.target
        });

        this.init();
    }

    init() {
        this.render();
    }

    getPlaceholder() : string {
        switch (this.type) {
            case "LIST":
                return  "Enter list title...";
            case "CARD":
                return  "Enter a title for this card...";
            default:
                return "";
        }
    }

    getButtonName() : string {
        switch (this.type) {
            case "LIST":
                return  "Add list";
            case "CARD":
                return  "Add card";
            default:
                return "";
        }
    }

    get el() {
        return this.addItemBox;
    }

    render() {
        if (this.type === "LIST") this.addItemBox.style.display = "block";
        const addItemInput = DOM.createElement({
            tagName: "input",
            class: this.type === "CARD" ? "add-item-input" : "",
            parent: this.addItemBox
        }) as HTMLInputElement;
        addItemInput.placeholder = this.getPlaceholder();
        addItemInput.focus();

        const addItemButton = DOM.createElement({
            tagName: "button",
            class: "add-item-button",
            text: this.getButtonName(),
            parent: this.addItemBox
        });
        addItemButton.addEventListener("click", (e) => {
            if (addItemInput.value) {
                this.callBack(addItemInput.value);
                addItemInput.value = "";
            }
        });

        const addItemClose = DOM.createElement({
            tagName: "a",
            class: "add-item-close",
            text: "<i></i>",
            parent: this.addItemBox
        });
        addItemClose.addEventListener("click", (e) => {
           this.closeCallBack();
        });

    }
}