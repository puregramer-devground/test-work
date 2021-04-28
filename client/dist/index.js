define("utils/DOM", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DOM = /** @class */ (function () {
        function DOM() {
            throw new Error("DOM은 static class 입니다.");
        }
        DOM.createElement = function (params) {
            var element = document.createElement("" + params.tagName);
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
define("components/Card", ["require", "exports", "utils/DOM"], function (require, exports, DOM_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Card = /** @class */ (function () {
        function Card(target, text) {
            this.target = target;
            this.text = text;
            this.cardItem = DOM_1.default.createElement({
                tagName: "div",
                class: "card-item",
                text: text,
                parent: this.target
            });
        }
        return Card;
    }());
    exports.default = Card;
});
define("components/AddItem", ["require", "exports", "utils/DOM"], function (require, exports, DOM_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AddItem = /** @class */ (function () {
        function AddItem(target, type, callBack, closeCallBack) {
            this.target = target;
            this.type = type;
            this.callBack = callBack;
            this.closeCallBack = closeCallBack;
            this.addItemBox = DOM_2.default.createElement({
                tagName: "div",
                class: "add-item-box",
                parent: this.target
            });
            this.init();
        }
        AddItem.prototype.init = function () {
            this.render();
        };
        AddItem.prototype.getPlaceholder = function () {
            switch (this.type) {
                case "LIST":
                    return "Enter list title...";
                case "CARD":
                    return "Enter a title for this card...";
                default:
                    return "";
            }
        };
        AddItem.prototype.getButtonName = function () {
            switch (this.type) {
                case "LIST":
                    return "Add list";
                case "CARD":
                    return "Add card";
                default:
                    return "";
            }
        };
        Object.defineProperty(AddItem.prototype, "el", {
            get: function () {
                return this.addItemBox;
            },
            enumerable: false,
            configurable: true
        });
        AddItem.prototype.render = function () {
            var _this = this;
            if (this.type === "LIST")
                this.addItemBox.style.display = "block";
            var addItemInput = DOM_2.default.createElement({
                tagName: "input",
                class: this.type === "CARD" ? "add-item-input" : "",
                parent: this.addItemBox
            });
            addItemInput.placeholder = this.getPlaceholder();
            addItemInput.focus();
            var addItemButton = DOM_2.default.createElement({
                tagName: "button",
                class: "add-item-button",
                text: this.getButtonName(),
                parent: this.addItemBox
            });
            addItemButton.addEventListener("click", function (e) {
                if (addItemInput.value) {
                    _this.callBack(addItemInput.value);
                    addItemInput.value = "";
                }
            });
            var addItemClose = DOM_2.default.createElement({
                tagName: "a",
                class: "add-item-close",
                text: "<i></i>",
                parent: this.addItemBox
            });
            addItemClose.addEventListener("click", function (e) {
                _this.closeCallBack();
            });
        };
        return AddItem;
    }());
    exports.default = AddItem;
});
define("components/List", ["require", "exports", "components/Card", "utils/DOM", "components/AddItem"], function (require, exports, Card_1, DOM_3, AddItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var List = /** @class */ (function () {
        function List(parent, target, title, updateCallBack) {
            var _this = this;
            this.parent = parent;
            this.target = target;
            this.title = title;
            this.cardList = [];
            this.isShowAddItem = false;
            this.updateCallBack = updateCallBack;
            this.listBox = DOM_3.default.createElement({
                tagName: "div",
                class: "list-box",
                parent: this.target
            });
            this.cardContainer = DOM_3.default.createElement({
                tagName: "div",
                class: "card-container"
            });
            this.addCardButton = DOM_3.default.createElement({
                tagName: "a",
                class: "add-card",
                text: "<i></i><span>Add a card</span>",
            });
            this.addCardButton.addEventListener("click", function (e) {
                _this.isShowAddItem = true;
                _this.visibleAddItem();
            });
            this.addListItemBox = new AddItem_1.default(this.listBox, "LIST", function (text) {
                _this.title = text;
                _this.update();
            }, function () { });
            this.addCardItemBox = new AddItem_1.default(this.listBox, "CARD", function (text) {
                _this.pushCard(text);
            }, function () {
                _this.isShowAddItem = false;
                _this.visibleAddItem();
            });
            this.init();
        }
        List.prototype.init = function () {
            if (this.title)
                this.render();
        };
        List.prototype.pushCard = function (text) {
            this.cardList.push(new Card_1.default(this.cardContainer, text));
            this.parent.normalize();
        };
        List.prototype.update = function () {
            this.clean();
            this.visibleAddItem();
            this.init();
            this.updateCallBack();
        };
        List.prototype.clean = function () {
            this.addListItemBox.el.style.display = "none";
        };
        List.prototype.visibleAddItem = function () {
            if (this.isShowAddItem) {
                this.addCardItemBox.el.style.display = "block";
                this.addCardButton.style.display = "none";
            }
            else {
                this.addCardButton.style.display = "flex";
                this.addCardItemBox.el.style.display = "none";
            }
        };
        List.prototype.render = function () {
            var listTitle = DOM_3.default.createElement({
                tagName: "input",
                class: "list-title",
            });
            listTitle.value = this.title;
            this.listBox.insertBefore(listTitle, this.addCardItemBox.el);
            this.listBox.insertBefore(this.cardContainer, this.addCardItemBox.el);
            this.listBox.appendChild(this.addCardButton);
        };
        return List;
    }());
    exports.default = List;
});
define("store", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setStore = exports.store = void 0;
    exports.store = {};
    function setStore(newStore) {
        exports.store = newStore;
        console.log("store: ", exports.store);
    }
    exports.setStore = setStore;
});
define("components/Board", ["require", "exports", "components/List", "utils/DOM", "store"], function (require, exports, List_1, DOM_4, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dummy = [
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
    var Board = /** @class */ (function () {
        function Board(target, name) {
            this.target = target;
            this.name = name;
            this.list = [];
            this.listContainer = DOM_4.default.createElement({
                tagName: "section",
                class: "list-container"
            });
            this.init();
            // dummy test
            // setTimeout(() => {
            //     this.update();
            // }, 2000);
        }
        Board.prototype.init = function () {
            this.render();
            this.addList("", false, []);
        };
        Board.prototype.render = function () {
            console.log("Board render");
            var board = DOM_4.default.createElement({
                tagName: "div",
                class: "board-container",
                parent: this.target
            });
            var header = DOM_4.default.createElement({
                tagName: "header",
                class: "board-header",
                text: this.name,
                parent: board
            });
            board.appendChild(this.listContainer);
        };
        Board.prototype.addList = function (title, isUpdate, cardList) {
            var _this = this;
            var listInstance = new List_1.default(this, this.listContainer, title, function () {
                _this.addList("", false, []);
            });
            this.list.push(listInstance);
            if (isUpdate)
                listInstance.clean();
            if (cardList.length > 0) {
                cardList.forEach(function (card) {
                    listInstance.pushCard(card.text);
                });
            }
            this.normalize();
        };
        Board.prototype.getCardList = function (cardList) {
            return cardList.map(function (card, index) {
                return {
                    index: index,
                    text: card.text
                };
            });
        };
        Board.prototype.normalize = function () {
            var _this = this;
            var normalizedList = [];
            this.list.forEach(function (list, index) {
                normalizedList.push({
                    index: index,
                    title: list.title,
                    cardList: _this.getCardList(list.cardList)
                });
            });
            store_1.setStore({
                data: normalizedList
            });
        };
        Board.prototype.update = function () {
            var _this = this;
            this.list = [];
            this.listContainer.innerHTML = "";
            dummy.forEach(function (list) {
                console.log("update: ", list);
                _this.addList(list.title, !!list.title, list.cardList);
                /*if (list.cardList) {
                    for (let i = 0; i < list.cardList.length; i++) {
    
                    }
                }*/
            });
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