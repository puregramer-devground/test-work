import {clients, datas, setClients} from "../globals.js";

export function eventsHandler(request, response) {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);

    const data = `data: ${JSON.stringify(datas)}\n\n`;

    response.write(data);

    const clientId = Date.now();

    const newClient = {
        id: clientId,
        response
    };

    clients.push(newClient);

    request.on('close', () => {
        console.log(`${clientId} Connection closed`);
        setClients(clients.filter(client => client.id !== clientId));
    });
}

