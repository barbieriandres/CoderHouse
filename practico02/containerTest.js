const Container = require('./containerClass.js')

async function main(){
  let filename = './productos.json' 

  let prod1 = {                                                                                                                                                    
    title: 'Escuadra',
    price: 123.45,
    thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png',
  }

  let prod2 = {                                                                                                                                                    
    title: 'Calculadora',
    price: 234.56,
    thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png',
  }

  let prod3 = {                                                                                                                                                    
    title: 'Globo Terráqueo',
    price: 345.67,
    thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png',
  }

  const productContainer = new Container(filename)
  let id
  let data
  
  console.log('Load Prod1')
  id = await productContainer.save(prod1)
  console.log(`Se agrego el producto de id: ${id}`)

  console.log('Load Prod2')
  id = await productContainer.save(prod2)
  console.log(`Se agrego el producto de id: ${id}`)

  console.log('Load Prod3')
  id = await productContainer.save(prod3)
  console.log(`Se agrego el producto de id: ${id}`)

  console.log('List Products')
  data = await productContainer.getAll()
  console.log(data)

  console.log(`List Prod Id ${id}`)
  data = await productContainer.getById(id)
  console.log(data)

  console.log(`Delete Prod Id ${id}`)
  data = await productContainer.deleteById(id)

  console.log(`List Prod Id ${id}`)
  data = await productContainer.getById(id)
  console.log(data)

  console.log('List Products')
  data = await productContainer.getAll()
  console.log(data)

  //console.log(`Delete All`)
  //data = await productContainer.deleteAll()
  
  //console.log('List Products')
  //data = await productContainer.getAll()
  //console.log(data)
}

main()
