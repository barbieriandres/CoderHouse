import express from 'express'
import session from 'express-session'
import { engine as exphbs } from 'express-handlebars'

const { Router } = express

import {
    productosDao as productosApi,
    carritosDao as carritosApi
} from './daos/index.js'

//------------------------------------------------------------------------
// Instancio servidor

const app = express()

//--------------------------------------------
// Configuro Renderer
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

//--------------------------------------------
// Defino variables de Session
app.use(
    session({
      secret: 'L1ttl3DarkS3cr3t',
      saveUninitialized: true,
      resave: true
    })
  );

//--------------------------------------------
// Login & Logout Basico con Front Siempre
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

//--------------------------------------------
// Valido Session y Admin
const usuarioAdmin = process.env.ADMINUSER

function crearErrorNoEsAdmin(ruta, metodo) {
    const error = {
        error: -1,
    }
    if (ruta && metodo) {
        error.descripcion = `ruta '${ruta}' metodo '${metodo}' no autorizado`
    } else {
        error.descripcion = 'no autorizado'
    }
    return error
}

function usuarioValido(req, res, next) {
  if ( req.session.username ){
    next()
  } else {
    res.json(crearErrorNoEsAdmin())
  }
}

function soloAdmins(req, res, next) {
  if ( req.session.username == usuarioAdmin){
    next()
  } else {
    res.json(crearErrorNoEsAdmin())
  }
}

//--------------------------------------------
// Ruta Default: 
// Muestra el Form de Carga, La carga es por ApiRest, usamos /api/productos para insertar
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

// ###################################################################
//
// Aca hay reglas de Negocio... en el Ruteo, pero bue..
// Deberia haber pensado antes como hacer esto y no tirar codigo por tirar..
//
// ###################################################################
const productosRouter = new Router()

productosRouter.get('/', async (req, res) => {
    const productos = await productosApi.listarTodo()
    res.json(productos)
})

productosRouter.get('/:id', async (req, res) => {
    res.json(await productosApi.listar(req.params.id))
})

productosRouter.post('/', soloAdmins, async (req, res) => {
    res.json(await productosApi.guardar(req.body))
})

productosRouter.put('/:id', soloAdmins, async (req, res) => {
    res.json(await productosApi.actualizar(req.body))
})

productosRouter.delete('/:id', soloAdmins, async (req, res) => {
    res.json(await productosApi.borrar(req.params.id))
})

//--------------------------------------------
// configuro router de carritos

/*
Carrito
    [] -> {
        cid : ##,
        username: req.session.username,
        timestamp: epoch,
        productos: [ 
            {
                id: ##,
                timestamp: epoch,
                qty: ##
            } 
        ]
    }
*/

const carritosRouter = new Router()

carritosRouter.get('/', async (req, res) => {
  let cartAll = await carritosApi.listarTodo()

  let cartExist = cartAll.find( obj => obj.username == req.session.username )
  if (cartExist == null){
      return res.json({error: 'Todavia no Tenes Carrito, Agrega un producto'})
  }

  for( let prod of cartExist['productos']){
      let pp = await productosApi.listar( prod.id )
      for(let key in pp){
          if ( ! Object.keys(prod).includes(key) ){
              prod[key] = pp[key]
          }
      }
  }
  return res.json( cartExist )
})

carritosRouter.get('/:id', usuarioValido, async (req,res) => {
  const cid = req.params.id
  //if(isNaN(cid)){
  //    return res.json({error: 'El parametro ingresado no es un numero'})
  //}

  let cartExist = await carritosApi.listar(cid)
  if(cartExist == null){
      return res.json({error: 'Carrito no encontrado'})
  }

  if (cartExist.username != req.session.username){
      return res.json( { error: `Carrito no es tuyo = ${cid}` } )
  }

  for( let prod of cartExist['productos']){
      let pp = await productosApi.listar( prod.id )
      for(let key in pp){
          if ( ! Object.keys(prod).includes(key) ){
              prod[key] = pp[key]
          }
      }
  }
  return res.json(cartExist)
})

carritosRouter.get('/:id/productos', usuarioValido, async (req, res) => {
  const cid = req.params.id
  console.log(cid)
  //if(isNaN(cid)){
  //    return res.json({error: 'El parametro ingresado no es un numero'})
  //}

  let cartExist = await carritosApi.listar(cid)
  if(cartExist == null){
      return res.json({error: 'Carrito no encontrado'})
  }

  if (cartExist.username != req.session.username){
      return res.json( { error: `Carrito no es tuyo = ${cid}` } )
  }

  for( let prod of cartExist['productos']){
      let pp = await productosApi.listar( prod.id )
      for(let key in pp){
          if ( ! Object.keys(prod).includes(key) ){
              prod[key] = pp[key]
          }
      }
  }

  return res.json(cartExist['productos'])
})

carritosRouter.post('/', usuarioValido, async (req, res) => {
  let ts = Date.now()
  let data = {}

  let cartAll = await carritosApi.listarTodo()

  let cartExist = cartAll.find( obj => obj.username == req.session.username )

  let cid = null
  if (cartExist == null){
      // No tiene ningun carrito creado, le Creamos Uno!
      data['timestamp'] = ts
      data['username'] = req.session.username
      data['productos'] = []
      cid = await carritosApi.guardar( data )
  }

  console.log(cid)
  return res.json({ id: cid || cartExist.id })
})

carritosRouter.post('/:id/productos', usuarioValido, async (req, res) => {
  let ts = Date.now()
  let data = {}
  let prodId = req.body.id

  const cid = req.params.id
  //if(isNaN(cid)){
  //    return res.json({error: 'El parametro ingresado no es un numero'})
  //}

  let cartExist = await carritosApi.listar(cid)
  if(cartExist == null){
      return res.json( { error: `Carrito no encontrado id = ${cid}` } )
  }

  if (cartExist.username != req.session.username){
      return res.json( { error: `Carrito no es tuyo = ${cid}` } )
  }

  let prodExist = cartExist['productos'].find( obj => obj.id == prodId )
  if(prodExist == null){
      // Producto nuevo!
      cartExist['productos'].push({
          'id': prodId,
          'timestamp': ts,
          'qty': 1,
      })
  } else {
      // Aumento Qty
      prodExist['qty'] += 1
  }

  // Luego de modificar el carrito, lo reemplazo
  await carritosApi.actualizar( cartExist )

  // Al regenerar el Carrito, podria cambiar el ID.
  return res.json({message: 'producto agregado'})
})

carritosRouter.delete('/:id', usuarioValido, async (req, res) => {
  const id = req.params.id
  //if(isNaN(id)){
  //    return res.json({error: 'El parametro ingresado no es un numero'})
  //}

  let cartExist = await carritosApi.listar(id)
  if(cartExist == null){
      return res.json({error: 'Carrito no encontrado'})
  }

  if(cartExist.username != req.session.username){
      return res.json( { error: `Carrito no es tuyo = ${cid}` } )
  }

  await carritosApi.borrar(id)
  return res.json({message: 'Carrito eliminado'})
})

carritosRouter.delete('/:id/productos/:idProd', usuarioValido, async (req, res) => {
  const cid = req.params.id
  const id = req.params.idProd
  const force = (req.body.force==="true" || req.body.force ===true || req.body.force ==="1" || req.body.force ===1 )

  //if(isNaN(cid)){
  //    return res.json({error: 'El parametro ingresado no es un numero'})
  //}

  let cartExist = await carritosApi.listar(cid)
  if(cartExist == null){
      return res.json( { error: `Carrito no encontrado id = ${cid}` } )
  }

  if (cartExist.username != req.session.username){
      return res.json( { error: `Carrito no es tuyo = ${cid}` } )
  }

  // Borro solo 1, si quedan zero, Borro Producto?
  // Existe?
  let prodCheck = cartExist['productos'].find( obj => obj.id == id )

  if ( (! force) && (prodCheck['qty'] > 1)){
      prodCheck['qty'] -= 1
      await carritosApi.actualizar( cartExist )
      return res.json({message: 'producto decontado'})
  } else {
      let prodKeep = cartExist['productos'].filter( obj => obj.id != id )
      cartExist['productos'] = prodKeep
      await carritosApi.actualizar( cartExist )
      return res.json({message: 'producto eliminado'})
  }
})

app.use('/api/productos', productosRouter)
app.use('/api/carritos', carritosRouter)

export default app