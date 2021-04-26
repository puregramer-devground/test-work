define("components/Card", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Card = /** @class */ (function () {
        function Card(text) {
            this.text = text;
        }
        return Card;
    }());
    exports.default = Card;
});
define("components/List", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var List = /** @class */ (function () {
        function List() {
            this.cardList = [];
        }
        return List;
    }());
    exports.default = List;
});
define("utils/DOM", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DOM = /** @class */ (function () {
        function DOM() {
            throw new Error("DOM은 static class 입니다.");
        }
        DOM.createElement = function (params) {
            var element = document.createElement("" + params.tagName);
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
        };
        return DOM;
    }());
    exports.default = DOM;
});
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
define("components/Board", ["require", "exports", "utils/DOM"], function (require, exports, DOM_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Board = /** @class */ (function () {
        function Board(target, name) {
            this.target = target;
            this.name = name;
            this.list = [];
            // this.boardObj = null;
            this.init();
        }
        Board.prototype.init = function () {
            this.appendDOM();
        };
        Board.prototype.appendDOM = function () {
            console.log("appendDOM");
            var board = DOM_1.default.createElement({
                tagName: "div",
                class: "board-container",
                parent: this.target
            });
        };
        Board.prototype.render = function () {
        };
        return Board;
    }());
    exports.default = Board;
});
define("index", ["require", "exports", "components/Board"], function (require, exports, Board_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    window.addEventListener("DOMContentLoaded", (function (event) {
        console.log("DOMContentLoaded!");
        var workRoot = document.getElementById("workRoot");
        var testWork = new Board_1.default(workRoot, "TEST-WORK");
        // console.log("workRoot: ", workRoot);
    }));
});
//# sourceMappingURL=index.js.map