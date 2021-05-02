import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import {eventsHandler} from "./middleware/events.js";
import {addEvent} from "./middleware/datas.js";

const app = express();
const PORT = 7777;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/events', eventsHandler);
app.post('/add', addEvent);

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
});
