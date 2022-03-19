const express = require('express')
const session = require('express-session');
const exphbs = require('express-handlebars')

const { productsApi } = require("./api/products")
const { cartApi } = require("./api/cart")

const app = express()

app.use(
  session({
    secret: 'L1ttl3DarkS3cr3t',
    saveUninitialized: true,
    resave: true
  })
);

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))

app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'index.hbs',
  layoutsDir: './views/layouts',
  partialsDir: './views/partials'
}))

app.set('views', './views')

/*
  Muestra el Form de Carga, La carga es por ApiRest, usamos /api/productos para insertar
*/
app.get('/', async (req, res) => {
  let sess = req.session
  if(sess.username) {
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
  } else {
    res.render('login.hbs', {})
  }
})

/*
  Login & Logout Basico
*/
app.post('/login',(req,res) => {
  req.session.username = req.body.username;
  res.redirect('/');
});

app.get('/logout',(req,res) => {
  let sess = req.session
  if(sess.username) {
    req.session.destroy((err) => {
        if(err) {
          return console.log(err);
        }
        res.redirect('/');
    })
  } else {
    res.redirect('/');
  }
})

/*
  Todo Json y Renderizado en Front!
*/
app.use('/api/products', productsApi)

/*
  Todo Json y Renderizado en Front!
*/
app.use('/api/cart', cartApi)

const PORT = process.env.PORT || 8080

const Server = app.listen(PORT, function () {
    console.log(`Servidor Http escuchando en el puerto ${Server.address().port}`)
})
Server.on('error', error => console.log(`Error en servidor ${error}`))
