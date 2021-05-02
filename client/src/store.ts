export interface Store {
    data: NormalizedList[]
}

export interface NormalizedList {
    index: number,
    id: number;
    title: string,
    cardList: CardList[]
}

export interface CardList {
    id: number,
    index: number,
    text: string
}

export let store: Store;

export function setStore(newStore: Store) {
    store = newStore;
    console.log("setStore: ", store);
}

export function requestEvent(data: {}) {
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
        .then(response => {
            console.log("response: ", response);
            // response.json();
        })
        .catch(e => {
            console.log("requestEvent error: ", e);
        })
}

export function updateStoreMap(cardItem: string, mode: string, endId:number, listId:number) {
    const cardItemObj = JSON.parse(cardItem);
    store.data.forEach((list, index) => {
        if (list.cardList) {
            for (let i = 0; i < list.cardList.length; i++) {
                if (mode === "del" && cardItemObj.id !== endId) {
                    if (list.cardList[i].id === cardItemObj.id) {
                        list.cardList.splice(i, 1);
                        break;
                    }
                }
                if (mode === "add" && cardItemObj.id !== endId) {
                    if (list.cardList[i].id === endId) {
                        list.cardList.splice(i + 1, 0, cardItemObj);
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
    if (mode === "add") requestEvent(store);

}