
import {clients, datas} from "../globals.js";

function sendEventsToAll(newData) {
    clients.forEach(client => client.response.write(`data: ${JSON.stringify(newData)}\n\n`))
}

export function addEvent(item) {
    datas.push(item);
    return sendEventsToAll(item);
}


