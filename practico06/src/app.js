const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const { routerContainer } = require("./api/routerContainer")

const exphbs = require('express-handlebars')
const Container = require('./models/containerClass.js')

let filename = __dirname + '/data/productos.json'

const productContainer = new Container(filename)

let filechat = __dirname + '/data/chat.json'
const chatContainer = new Container(filechat)

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const mensajes = []

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))

app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'index.hbs',
  layoutsDir: './views/layouts',
  partialsDir: './views/partials'
}))

//app.set('view engine', 'hbs')
app.set('views', './views')

/*
  Muestra el Form de Carga, La carga es por ApiRest, usamos /api/productos para insertar
*/
app.get('/', async (req, res) => {
  const products = await productContainer.getAll();
  isProductsEmpty = products.length == 0
  res.render('main.hbs', {
    productsIcon: [
      {url:'https://cdn2.iconfinder.com/data/icons/international-food/64/ramen-128.png'},
      {url:'https://cdn2.iconfinder.com/data/icons/international-food/64/gyoza-128.png'},
      {url:'https://cdn2.iconfinder.com/data/icons/international-food/64/fish-128.png'},
      {url:'https://cdn2.iconfinder.com/data/icons/international-food/64/bibimbub-128.png'},
      {url:'https://cdn2.iconfinder.com/data/icons/international-food/64/chow_mein-128.png'},
      {url:'https://cdn2.iconfinder.com/data/icons/international-food/64/curry-128.png'},
      {url:'https://cdn2.iconfinder.com/data/icons/international-food/64/hor_mok-128.png'},
      {url:'https://cdn2.iconfinder.com/data/icons/international-food/64/tod_mun-128.png'},
      {url:'https://cdn2.iconfinder.com/data/icons/international-food/64/fried_rice-128.png'},
      {url:'https://cdn2.iconfinder.com/data/icons/international-food/64/green_curry-128.png'}
    ]
  })
})

app.use('/api/productos', routerContainer)

io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado!')
  
  /* Envio los Productos */
  socket.emit('productos', await productContainer.getAll() )

  /* Escucho los mensajes enviado por el cliente y se los propago a todos */
  socket.on('productos', async (data) => {
    await productContainer.save(data)
    /* Le mando a todo el mundo el nuevo producto */
    io.sockets.emit('productos', [data] )
  })


  /* Envio los mensajes al cliente que se conectó */
  socket.emit('mensajes', await chatContainer.getAll() )

  /* Escucho los mensajes enviado por el cliente y se los propago a todos */
  socket.on('mensajes', async (data) => {
    let ts = Date.now()
    data['timestamp'] = ts

    await chatContainer.save(data)
    /* Le mando a todo el mundo el nuevo producto */
    io.sockets.emit('mensajes', [data] )
  })

})

const PORT = process.env.PORT || 8080

const connectedServer = httpServer.listen(PORT, function () {
    console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
