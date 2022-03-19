const express = require('express')
const Container = require('./containerClass.js')
const app = express()

app.use(express.static(__dirname + '/public'));

let visitas = 0
let filename = './productos.json' 
const productContainer = new Container(filename)

app.get('/', (req,res) => {
  visitas += 1
  res.send(`
    <html>
    <header>
      <link href="style.css" rel="stylesheet" type="text/css">
      <script src="script.js"></script>
    </header>
    <body>
      <h1>BM: Practico 3</h1>
      <a href='./'>Home</a>
      <a href='#' onclick='load("./productos");'>Productos</a>
      <a href='#' onclick='load("./productoRandom");'>ProductoRandom</a>
      <p>Visitas: ${visitas}</p>
      <pre></pre>
    </body>
    </html>
    `)
})

app.get('/productos', async (req,res) => {
  let prods = await productContainer.getAll()
  console.log( prods )
  res.json( prods )
})

app.get('/productoRandom', async (req,res) => {
  let prods = await productContainer.getAll()
  let prod = prods[Math.floor(Math.random()*prods.length)];
  console.log( prod )
  res.json( prod )
})

const PORT = process.env.PORT || 8080

const server = app.listen( PORT, () => {
  console.log(`Server is Up: ${server.address().port}`)
})

server.on('error', error => console.log(error))