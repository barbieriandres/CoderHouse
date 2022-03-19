const Container = require('../modules/containerClass.js')
const { Router } = require('express');

let filename_prods = __dirname + '/../data/products.json' 
const productContainer = new Container(filename_prods)

let filename = __dirname + '/../data/carts.json' 
const cartContainer = new Container(filename)

const rr = Router();

/*
Carrito
    [] -> {
        cid : ##,
        username: req.session.username,
        timestamp: epoch,
        products: [ 
            {
                id: ##,
                timestamp: epoch,
                qty: ##
            } 
        ]
    }
*/

// Authenticate MiddleWare
const authenticate = function (req, res, next) {
    if ( req.session.username ){
        next();
    } else {
        return res.json({error: 'Not Authorized'})    
    }
}

/*
    Get Carritos
*/
rr.get('/', authenticate, async (req, res) => {
    let cartAll = await cartContainer.getAll()

    let cartExist = cartAll.find( obj => obj.username == req.session.username )
    if (cartExist == null){
        return res.json({error: 'Todavia no Tenes Carrito, Agrega un producto'})
    }

    for( let prod of cartExist['products']){
        let pp = await productContainer.getById( prod.id )
        for(let key in pp){
            if ( ! Object.keys(prod).includes(key) ){
                prod[key] = pp[key]
            }
        }
    }
    return res.json( cartExist )
});

/*
    Get Carrito By Id
*/
rr.get('/:cid', authenticate, async (req,res) => {
    const cid = parseInt(req.params.cid)
    if(isNaN(id)){
        return res.json({error: 'El parametro ingresado no es un numero'})
    }

    let cartExist = await cartContainer.getById(cid)
    if(cartExist == null){
        return res.json({error: 'Carrito no encontrado'})
    }

    if (cartExist.username != req.session.username){
        return res.json( { error: `Carrito no es tuyo = ${cid}` } )
    }

    for( let prod of cartExist['products']){
        let pp = await productContainer.getById( prod.id )
        for(let key in pp){
            if ( ! Object.keys(prod).includes(key) ){
                prod[key] = pp[key]
            }
        }
    }
    return res.json(cartExist)
})

/*
    Get Productos in Carrito
*/
rr.get('/:cid/products', authenticate, async (req,res) => {
    const cid = parseInt(req.params.cid)
    if(isNaN(cid)){
        return res.json({error: 'El parametro ingresado no es un numero'})
    }

    let cartExist = await cartContainer.getById(cid)
    if(cartExist == null){
        return res.json({error: 'Carrito no encontrado'})
    }

    if (cartExist.username != req.session.username){
        return res.json( { error: `Carrito no es tuyo = ${cid}` } )
    }

    for( let prod of cartExist['products']){
        let pp = await productContainer.getById( prod.id )
        for(let key in pp){
            if ( ! Object.keys(prod).includes(key) ){
                prod[key] = pp[key]
            }
        }
    }

    return res.json(cartExist['products'])
})

/*
    Load Carrito
*/
rr.post('/', authenticate, async (req, res) => {
    let ts = Date.now()
    let data = req.body

    let cartAll = await cartContainer.getAll()
    let cartExist = cartAll.find( obj => obj.username == req.session.username )

    let cid = null
    if (cartExist == null){
        // No tiene ningun carrito creado, le Creamos Uno!
        data['timestamp'] = ts
        data['username'] = req.session.username
        data['products'] = []
        cid = await cartContainer.save( req.body )
    }

    return res.json({ id: cid || cartExist.id })
});

/*
    Load Prod to Carrito
*/
rr.post('/:cid/products', authenticate, async (req, res) => {
    let ts = Date.now()
    let data = req.body
    data['timestamp'] = ts
    data['id'] = parseInt( data['id'] )

    const cid = parseInt(req.params.cid)
    if(isNaN(cid)){
        return res.json({error: 'El parametro ingresado no es un numero'})
    }

    let cartExist = await cartContainer.getById(cid)
    if(cartExist == null){
        return res.json( { error: `Carrito no encontrado id = ${cid}` } )
    }

    if (cartExist.username != req.session.username){
        return res.json( { error: `Carrito no es tuyo = ${cid}` } )
    }

    let prodExist = cartExist['products'].find( obj => obj.id == data['id'] )
    if(prodExist == null){
        // Producto nuevo!
        cartExist['products'].push({
            'id': data['id'],
            'timestamp': ts,
            'qty': 1,
        })
    } else {
        // Aumento Qty
        prodExist['qty'] += 1
    }    

    await cartContainer.modifyById( cartExist )

    // Al regenerar el Carrito, podria cambiar el ID.
    return res.json({message: 'producto agregado'})
});


/*
    Delete Carrito
*/
rr.delete('/:id', authenticate, async (req, res) => {
    const id = parseInt(req.params.id)
    if(isNaN(id)){
        return res.json({error: 'El parametro ingresado no es un numero'})
    }

    let cartExist = await cartContainer.getById(id)
    if(cartExist == null){
        return res.json({error: 'Carrito no encontrado'})
    }

    if(cartExist.username != req.session.username){
        return res.json( { error: `Carrito no es tuyo = ${cid}` } )
    }

    await cartContainer.deleteById(id)
    return res.json({message: 'Carrito eliminado'})
});

/*
    Delete Producto From Carrito
*/
rr.delete('/:cid/products/:id', authenticate, async (req, res) => {
    const cid = parseInt(req.params.cid)
    const id = parseInt(req.params.id)
    const force = (req.body.force==="true" || req.body.force ===true || req.body.force ==="1" || req.body.force ===1 )

    if(isNaN(cid)){
        return res.json({error: 'El parametro ingresado no es un numero'})
    }

    let cartExist = await cartContainer.getById(cid)
    if(cartExist == null){
        return res.json( { error: `Carrito no encontrado id = ${cid}` } )
    }

    if (cartExist.username != req.session.username){
        return res.json( { error: `Carrito no es tuyo = ${cid}` } )
    }

    // Borro solo 1, si quedan zero, Borro Producto?
    // Existe?
    let prodCheck = cartExist['products'].find( obj => obj.id == id )

    if ( (! force) && (prodCheck['qty'] > 1)){
        prodCheck['qty'] -= 1
        await cartContainer.modifyById( cartExist )
        return res.json({message: 'producto decontado'})
    } else {
        let prodKeep = cartExist['products'].filter( obj => obj.id != id )
        cartExist['products'] = prodKeep
        await cartContainer.modifyById( cartExist )
        return res.json({message: 'producto eliminado'})
    }
})

exports.cartApi = rr;