
export let store = {};
export function setStore(newStore: {}) {
    store = newStore;
    console.log("store: ", store);
}
