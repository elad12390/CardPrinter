
import fs from 'fs';
import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import {BehaviorSubject, delay, Observable} from 'rxjs';
import * as path from "path";
import {cards} from "./cards.js";

const port = 3000
export const app = express()
export const server = http.createServer(app);
export const io = new Server(server);
export const __dirname = path.resolve();

const cardsFolder = './cards/';

app.use('/cards', express.static('cards'))
app.use("/", (req, res) => res.sendFile(__dirname + '/index.html'));

let bodySubject = new BehaviorSubject('');
fs.readdir(cardsFolder, (err, files) => bodySubject.next(cards(files)))
fs.watch(cardsFolder, () => fs.readdir(cardsFolder, (err, files) => bodySubject.next(cards(files))))

io.on('connection', (socket) => {
    const subscription = bodySubject
        .pipe(delay(200))
        .subscribe(cards => socket.emit('body', cards))

    socket.on('disconnect', () => subscription.unsubscribe())
})

server.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
