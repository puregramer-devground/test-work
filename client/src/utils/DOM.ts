
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
        console.log(element);
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


/*
export default class DOM {
    constructor() {
        throw new Error("DOM은 static class 입니다.");
    }

    static createElement(tagName, {attrs, text, callback, parent}) {
        const element = document.createElement(`${tagName}`);

        if (attrs) {
            DOM.insertAttributes(element, attrs);
        }

        if (callback) {
            callback(element);
        }

        if (text) {
            element.innerHTML = text;
        }

        if (parent instanceof HTMLElement) {
            parent.appendChild(element);
        }

        return element;
    }

    static insertAttributes(element, attrs) {
        if (element instanceof HTMLElement) {
            Object.keys(attrs).forEach((prop) => {
                element.setAttribute(prop, attrs[prop]);
            });
        }
    }
}*/
