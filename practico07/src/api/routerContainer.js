const sqlContainer = require('../models/sqlContainer.js')
const { optionsDatabaseMariaDb, optionsDatabaseSqlite3 } = require( '../models/databaseConfig.js' )

const productContainer = new sqlContainer( 
    optionsDatabaseMariaDb, {
        tableName: 'productos',
        searchId: 'id',
        tableColumns: {
        title: 'string',
        price: 'float',
        thumbnail: 'string',
        description: 'string',
        ranking: 'integer',
        id: 'primary'
        }
    } 
)

const { Router } = require('express');  

const routerContainer = Router();

/*
    Get Products
*/
routerContainer.get('/', async (req, res) => {
    res.json(await productContainer.getAll())
});

/*
    Get Product By Id
*/
routerContainer.get('/:id', async (req,res) => {
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
    Load Product
*/
routerContainer.post('/', async (req, res) => {
    const id = await productContainer.save(req.body)
    res.json({id: id})
});

/*
    Modify Product
    Replace!
*/
routerContainer.put('/:id', async (req, res) => {
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
    res.json({mensaje: 'Producto actualizado'})
});

/*
    Delete Product
*/
routerContainer.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    if(isNaN(id)){
        return res.json({error: 'El parametro ingresado no es un numero'})
    }

    const result = await productContainer.getById(id)
    if(result == null){
        return res.json({error: 'Producto no encontrado'})
    }

    await productContainer.deleteById(id)
    res.json({mensaje: 'Producto eliminado'})
});

exports.routerContainer = routerContainer;