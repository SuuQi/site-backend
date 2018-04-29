const store = {};

export function storeSet (key, value, exp) {
    store[key] = {
        value,
        exp: exp + Date.now()
    };
}

export function storeGet (key) {
    if (store.hasOwnProperty(key)
        && Date.now() < new Date(store[key].exp)) {
        return store[key].value;
    }
}
