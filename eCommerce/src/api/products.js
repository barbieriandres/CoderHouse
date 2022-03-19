const Container = require('../modules/containerClass.js')
const { Router } = require('express');

const SUPERUSER = 'admin'

let filename = __dirname + '/../data/products.json' 
const productContainer = new Container(filename)

const rr = Router();

// Authenticate MiddleWare
const authenticate = function (req, res, next) {
    if ( req.session.username ){
        next();
    } else {
        return res.json({error: 'Not Authorized'})    
    }
}

const authenticateSuperUser = function (req, res, next) {
    if (req.session.username == SUPERUSER ){
        next();
    } else {
        return res.json({error: 'User Not Authorized'})
    }
}
/*
    Get Products
*/
rr.get('/', authenticate, async (req, res) => {
    res.json(await productContainer.getAll())
});

/*
    Get Product By Id
*/
rr.get('/:id', authenticate, async (req,res) => {
    const id = parseInt(req.params.id)
    if(isNaN(id)){
        return res.json({error: 'El parametro ingresado no es un numero'})
    }

    const result = await productContainer.getById(id)
    if(result == null){
        return res.json({error: 'Producto no encontrado'})
    }

    res.json(result)
})

/*
    Load Product | Se carga 1 a la vez!
*/
rr.post('/', authenticate, authenticateSuperUser, async (req, res) => {
    let ts = Date.now()
    let data = req.body
    data['timestamp'] = ts
    const id = await productContainer.save( data )
    return res.json({id: id})    
});

/*
    Modify Product
    Replace!
*/
rr.put('/:id', authenticate, authenticateSuperUser, async (req, res) => {
    const id = parseInt(req.params.id)
    if(isNaN(id)){
        return res.json({error: 'El parametro ingresado no es un numero'})
    }

    const result = await productContainer.getById(id)
    if(result == null){
        return res.json({error: 'Producto no encontrado'})
    }

    const objeto = req.body 
    Object.assign(objeto, {id: id})
    await productContainer.modifyById(objeto)
    res.json({message: 'Producto actualizado'})
});

/*
    Delete Product
*/
rr.delete('/:id', authenticate, authenticateSuperUser, async (req, res) => {
    const id = parseInt(req.params.id)
    if(isNaN(id)){
        return res.json({error: 'El parametro ingresado no es un numero'})
    }

    const result = await productContainer.getById(id)
    if(result == null){
        return res.json({error: 'Producto no encontrado'})
    }

    await productContainer.deleteById(id)
    res.json({message: 'Producto eliminado'})
});

exports.productsApi = rr;