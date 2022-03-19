
## Ejercicio MongoDB

```
mongosh -u admin -p coderhouse
use ecommerce
```

### Cargo Datos!
```
db.productos.insertMany([
  {
    "title": "De Todo un Poco",
    "price": 120,
    "thumbnail": "https://cdn2.iconfinder.com/data/icons/international-food/64/ramen-256.png",
    "description": "De todo un poco con Huevo y papas...",
    "ranking": 1
  },
  {
    "title": "Empanadas",
    "price": 580,
    "thumbnail": "https://cdn2.iconfinder.com/data/icons/international-food/64/gyoza-256.png",
    "description": "3 Empanadas...",
    "ranking": 4
  },
  {
    "title": "Fideos Pasteros",
    "price": 900,
    "thumbnail": "https://cdn2.iconfinder.com/data/icons/international-food/64/chow_mein-256.png",
    "description": "Queres Pasta, comete unos Fideos.",
    "ranking": 2
  },
  {
    "title": "Sopita de Calabazita",
    "price": 1280,
    "thumbnail": "https://cdn2.iconfinder.com/data/icons/international-food/64/hor_mok-256.png",
    "description": "Estimamos que es sopa...",
    "ranking": 0
  },
  {
    "title": "Galletitas Con Pepitas",
    "price": 1700,
    "thumbnail": "https://cdn2.iconfinder.com/data/icons/international-food/64/tod_mun-256.png",
    "description": "CoooooooooooKiiiiieeeessss!!!!",
    "ranking": 5
  },
  {
    "title": "Tablita de Algo",
    "price": 2300,
    "thumbnail": "https://cdn2.iconfinder.com/data/icons/international-food/64/fish-128.png",
    "description": "Pinta pescado con algunas cosas...",
    "ranking": 4
  },
  {
    "title": "Super Soup",
    "price": 2860,
    "thumbnail": "https://cdn2.iconfinder.com/data/icons/international-food/64/fried_rice-128.png",
    "description": "Esta sopa te vuela la peluca... y te saca el frio.. tmb",
    "ranking": 3
  },
  {
    "title": "Super Soupx2",
    "price": 3350,
    "thumbnail": "https://cdn2.iconfinder.com/data/icons/international-food/64/fried_rice-128.png",
    "description": "Esta sopa te vuela la peluca... y te saca el frio.. tmb",
    "ranking": 2
  },
  {
    "title": "Super Soupx3",
    "price": 4320,
    "thumbnail": "https://cdn2.iconfinder.com/data/icons/international-food/64/fried_rice-128.png",
    "description": "Esta sopa te vuela la peluca... y te saca el frio.. tmb",
    "ranking": 1
  }
])

db.chat.insertMany([
  {
    "usermail": "jmbonelli@teco.com.ar",
    "input": "Que lindo dia para Pedir Pizza!"
  },
  {
    "usermail": "jmbonelli@teco.com.ar",
    "input": "Obvio, alta Muzza me pediria..."
  }
])
```

### Checkeo de que cargo docuemntos en las collections
```
show collections

db.productos.countDocuments()

db.chat.countDocuments()
```

### Insert Uno para probar
```
db.productos.insertOne({
    "title": "Super Soupx4",
    "price": 4990,
    "thumbnail": "https://cdn2.iconfinder.com/data/icons/international-food/64/fried_rice-128.png",
    "description": "Esta sopa te vuela la peluca... y te saca el frio.. tmb",
    "ranking": 0
  })
```

### Hago un par de cuentas y busquedas
```
db.productos.find({ "price": { $lt : 1000 } })

db.productos.find({ "price": { $gt : 1000, $lt: 3000 } })

db.productos.find({ "price": { $gt: 3000 } })
```

### Hago un par de Updates!
```
db.productos.updateMany({},{ $set: { "stock" : 100 } })

db.productos.updateMany({ "price": { $gt : 4000 }},{ $set: { "stock" : 0 } })
```

### Borro algunos documentos.
```
db.productos.deleteMany({ "price" : { $lt: 1000 }})
```

### Creo un Usuario!
```
db.createUser( { user: "pepe", pwd: "asd456", roles: [ { role: "read", db: "ecommerce"} ]})
```

##### Fin..

