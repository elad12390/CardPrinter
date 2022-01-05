
import fs from 'fs';
import chokidar from 'chokidar';
import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import {BehaviorSubject, delay, Observable} from 'rxjs';

const log = console.log.bind(console);
const port = 3000
const app = express()
const server = http.createServer(app);
const io = new Server(server);

const cardsFolder = './cards/';

app.use('/cards', express.static('cards'))

const cards = (files) => `
${files.map(file => `
    <div class="card">
        <img src="./cards/${file}"/>
    </div>
`).join('')}
`

let bodySubject = new BehaviorSubject('');



fs.readdir(cardsFolder, (err, files) => {
    bodySubject.next(cards(files))
})

fs.watch(cardsFolder, () => {
    fs.readdir(cardsFolder, (err, files) => {
        bodySubject.next(cards(files))
    })
})

app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <style>
                :root {
                    --a4-height: 29.7cm;
                    --a4-width: 21cm;
                    --card-height: 88mm;
                    --card-width: 63mm;
                }
                .container {
                    display: grid;
                    grid-template-columns: var(--card-width) var(--card-width) var(--card-width);
                    grid-template-rows: var(--card-height) var(--card-height) var(--card-height);
                    grid-auto-flow: row;
                    align-items: center;
                    justify-content: center;
                    align-content: center;
                    position: relative;
                    margin: 0;
                    width: var(--a4-width);
                    height: var(--a4-height);
                }
                .card {
                    position:relative;
                    background: white;
                }
                .card img {
                    z-index: 20000;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: var(--card-width);
                    height: var(--card-height);
                    object-fit: cover;
                }
            </style>
            <script src="https://cdn.socket.io/4.4.0/socket.io.min.js" integrity="sha384-1fOn6VtTq3PWwfsOrk45LnYcGosJwzMHv+Xh/Jx5303FVOXzEnw0EpLv30mtjmlj" crossorigin="anonymous"></script>
            <script>
                const socket = io();
                socket.on('body', ((body) => {
                    document.querySelector('.container').innerHTML = body;
                }).bind(this))
            </script>
        </head>
            <body class="container"></body>
        </html>
    `);
})

io.on('connection', (socket) => {
    console.log('connection established')
    const subscription = bodySubject
        .pipe(
            delay(200)
        ).subscribe(cards => socket.emit('body', cards))
    socket.on('disconnect', () => subscription.unsubscribe())
})

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
