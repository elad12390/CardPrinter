
const express = require('express')
const app = express()
const port = 3000
app.use('/cards', express.static('cards'))
app.get('/', (req, res) => {
    const testFolder = './cards/';
    const fs = require('fs');

    fs.readdir(testFolder, (err, files) => {

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
                    padding: 40mm;
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
        </head>
        <body class="container">
        ${files.map(file => `
            <div class="card">
                <img src="./cards/${file}"/>
            </div>
        `).join('')}
        </body>
        </html>
        
        
        `)
    });

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)

})
