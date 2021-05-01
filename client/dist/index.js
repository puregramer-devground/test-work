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
define("store", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateStoreMap = exports.requestEvent = exports.setStore = exports.store = void 0;
    function setStore(newStore) {
        exports.store = newStore;
        console.log("setStore: ", exports.store);
    }
    exports.setStore = setStore;
    function requestEvent(data) {
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
            .then(function (response) {
            console.log("response: ", response);
            // response.json();
        })
            .catch(function (e) {
            console.log("requestEvent error: ", e);
        });
    }
    exports.requestEvent = requestEvent;
    function updateStoreMap(cardItem, mode, endId, listId) {
        console.log("getUpdateStoreMap ", exports.store.data, cardItem, mode, endId, listId);
        var cardItemObj = JSON.parse(cardItem);
        exports.store.data.forEach(function (list, index) {
            if (list.cardList) {
                for (var i = 0; i < list.cardList.length; i++) {
                    if (mode === "del" && cardItemObj.id !== endId) {
                        if (list.cardList[i].id === cardItemObj.id) {
                            list.cardList.splice(i, 1);
                            // console.log("del -", list.cardList);
                            break;
                        }
                    }
                    if (mode === "add" && cardItemObj.id !== endId) {
                        if (list.cardList[i].id === endId) {
                            list.cardList.splice(i + 1, 0, cardItemObj);
                            // console.log("add -", list.cardList);
                            break;
                        }
                    }
                }
                if (mode === "add" && listId !== 0) {
                    if (list.id === listId) {
                        list.cardList.push(cardItemObj);
                    }
                }
            }
        });
        if (mode === "add")
            requestEvent(exports.store);
    }
    exports.updateStoreMap = updateStoreMap;
});
define("utils/index", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRandomInt = void 0;
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    exports.getRandomInt = getRandomInt;
});
define("components/Card", ["require", "exports", "utils/DOM", "store", "utils/index"], function (require, exports, DOM_1, store_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Card = /** @class */ (function () {
        function Card(target, text) {
            this.target = target;
            this.text = text;
            this.id = Date.now() + index_1.getRandomInt(0, 10000);
            this.cardItem = DOM_1.default.createElement({
                tagName: "div",
                class: "card-item",
                text: text,
                parent: this.target
            });
            this.cardItem.draggable = true;
            this.cardItem.addEventListener('dragstart', this.dragStartHandler.bind(this), false);
            this.cardItem.addEventListener('drop', this.dropHandler.bind(this), false);
            this.cardItem.addEventListener('dragend', this.dragEndHandler.bind(this), false);
            this.cardItem.addEventListener('dragenter', this.dragEnterHandler.bind(this), false);
            this.cardItem.addEventListener('dragleave', this.dragLeaveHandler.bind(this), false);
            this.cardItem.addEventListener('dragover', this.dragOverHandler.bind(this), false);
        }
        Card.prototype.dragStartHandler = function (e) {
            console.log("dragstart");
            this.cardItem.style.opacity = '0.3';
            if (!e.dataTransfer)
                return;
            e.dataTransfer.setData('cardItem', JSON.stringify({
                id: this.id,
                text: this.text
            }));
        };
        Card.prototype.dragEndHandler = function () {
            console.log("dragend");
            this.cardItem.style.opacity = '1';
            this.cardItem.classList.remove('over');
        };
        Card.prototype.dragEnterHandler = function () {
            console.log("dragenter");
            this.cardItem.classList.add('over');
        };
        Card.prototype.dragLeaveHandler = function () {
            console.log("dragleave");
            this.cardItem.classList.remove('over');
        };
        Card.prototype.dragOverHandler = function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            console.log("dragover");
            return false;
        };
        Card.prototype.dropHandler = function (e) {
            e.stopPropagation();
            if (!e.dataTransfer)
                return;
            var moveCardItem = e.dataTransfer.getData('cardItem');
            console.log("drop--", moveCardItem);
            store_1.updateStoreMap(moveCardItem, "del", this.id, 0);
            store_1.updateStoreMap(moveCardItem, "add", this.id, 0);
            return false;
        };
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
define("components/List", ["require", "exports", "components/Card", "utils/DOM", "components/AddItem", "store", "utils/index"], function (require, exports, Card_1, DOM_3, AddItem_1, store_2, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var List = /** @class */ (function () {
        function List(parent, target, title, updateCallBack) {
            var _this = this;
            this.parent = parent;
            this.target = target;
            this.title = title;
            this.id = Date.now() + index_2.getRandomInt(0, 1000);
            this.cardList = [];
            this.isShowAddItem = false;
            this.updateCallBack = updateCallBack;
            this.listBox = DOM_3.default.createElement({
                tagName: "div",
                class: "list-box",
                parent: this.target
            });
            this.listBox.draggable = true;
            this.listBox.addEventListener('drop', this.dropHandler.bind(this), false);
            this.listBox.addEventListener('dragend', this.dragEndHandler.bind(this), false);
            this.listBox.addEventListener('dragenter', this.dragEnterHandler.bind(this), false);
            this.listBox.addEventListener('dragleave', this.dragLeaveHandler.bind(this), false);
            this.listBox.addEventListener('dragover', this.dragOverHandler.bind(this), false);
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
                _this.pushCard(text, true);
            }, function () {
                _this.isShowAddItem = false;
                _this.visibleAddItem();
            });
            this.init();
        }
        List.prototype.init = function () {
            if (this.title) {
                this.render();
            }
        };
        List.prototype.pushCard = function (text, isRequest) {
            this.cardList.push(new Card_1.default(this.cardContainer, text));
            this.parent.normalize(isRequest);
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
        List.prototype.dragOverHandler = function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            console.log("dragover");
            return false;
        };
        List.prototype.dropHandler = function (e) {
            e.stopPropagation();
            if (!e.dataTransfer)
                return;
            var moveCardItem = e.dataTransfer.getData('cardItem');
            console.log("list drop--", moveCardItem);
            store_2.updateStoreMap(moveCardItem, "del", 0, this.id);
            store_2.updateStoreMap(moveCardItem, "add", 0, this.id);
            return false;
        };
        List.prototype.dragEndHandler = function () {
            console.log("list dragend");
            this.listBox.classList.remove('over');
        };
        List.prototype.dragEnterHandler = function () {
            console.log("list dragenter");
            this.listBox.classList.add('over');
        };
        List.prototype.dragLeaveHandler = function () {
            console.log("list dragleave");
            this.listBox.classList.remove('over');
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
define("components/Board", ["require", "exports", "components/List", "utils/DOM", "store"], function (require, exports, List_1, DOM_4, store_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            this.responseEvent();
        }
        Board.prototype.init = function () {
            this.render();
            this.addList("", false, [], true);
        };
        Board.prototype.responseEvent = function () {
            var _this = this;
            var events = new EventSource('http://localhost:7777/events');
            events.onmessage = function (event) {
                // console.log("responseEvent: ", event.data);
                var response = JSON.parse(event.data);
                _this.update(response.length ? response[0].data : response.data);
            };
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
        Board.prototype.addList = function (title, isUpdate, cardList, isRequest) {
            var _this = this;
            var listInstance = new List_1.default(this, this.listContainer, title, function () {
                _this.addList("", false, [], true);
            });
            this.list.push(listInstance);
            if (isUpdate)
                listInstance.clean();
            if (cardList.length > 0) {
                cardList.forEach(function (card) {
                    listInstance.pushCard(card.text, isRequest);
                });
            }
            this.normalize(isRequest);
        };
        Board.prototype.getCardList = function (cardList) {
            return cardList.map(function (card, index) {
                return {
                    index: index,
                    text: card.text,
                    id: card.id
                };
            });
        };
        Board.prototype.normalize = function (isRequest) {
            var _this = this;
            var normalizedList = [];
            this.list.forEach(function (list, index) {
                normalizedList.push({
                    index: index,
                    id: list.id,
                    title: list.title,
                    cardList: _this.getCardList(list.cardList)
                });
            });
            console.log("normalizedList ", normalizedList);
            store_3.setStore({
                data: normalizedList
            });
            if (isRequest)
                store_3.requestEvent(store_3.store);
        };
        Board.prototype.update = function (data) {
            var _this = this;
            this.list = [];
            this.listContainer.innerHTML = "";
            data.forEach(function (list) {
                console.log("update: ", list);
                _this.addList(list.title, !!list.title, list.cardList, false);
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