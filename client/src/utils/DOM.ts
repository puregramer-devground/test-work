interface Params {
    tagName: string;
    class: string;
    text?: string;
    parent?: HTMLElement;
}

export default class DOM {
    constructor() {
        throw new Error("DOM은 static class 입니다.");
    }
    static createElement(params: Params) {
        const element = document.createElement(`${params.tagName}`);

        if (params.class) {
            element.setAttribute("class", params.class);
        }

        if (params.text) {
            element.innerHTML = params.text;
        }

        if (params.parent) {
            params.parent.appendChild(element);
        }

        return element;
    }
}

