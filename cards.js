
export const cards = (files) => `
${files.map(file => `
    <div class="card">
        <img src="./cards/${file}"/>
    </div>
`).join('')}
`
