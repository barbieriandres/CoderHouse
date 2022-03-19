class Usuario {
  constructor(nombre, apellido, libros, mascotas){

    if (typeof apellido !== 'string' || !nombre instanceof String){
      throw new Error("nombre no es string");
    }
    
    if (typeof apellido !== 'string' || !apellido instanceof String){
      throw new Error("apellido no es string");
    }
    
    if (!Array.isArray(libros) || !libros.reduce( 
      (test, current) => { return test && current.hasOwnProperty('nombre') && current.hasOwnProperty('autor') }
      , true ) ){
      throw new Error("libros no es array de objectos { nombre, autor }");
    }

    if (!Array.isArray(mascotas)){
      throw new Error("mascotas no es array");
    }

    this.nombre   = nombre;
    this.apellido = apellido;
    this.libros   = (libros === undefined) ? [] : libros;
    this.mascotas = (mascotas === undefined) ? [] : mascotas;
  }

  getFullName(){
      return `${this.nombre} ${this.apellido}`;
  }
  addMascota(mascota){
    this.mascotas.push(mascota)
  }
  countMascotas(){
    return this.mascotas.length
  }
  addLibro(nombre, autor){
    this.libros.push( { nombre: nombre, autor: autor } )
  }
  getLibros(){
    return this.libros.map( libro => libro.nombre )
  }
}

const user = new Usuario('Elon','Musk', [{nombre:'El Señor de las moscas', autor:'William Golding'},{nombre: 'Fundacion', autor: 'Issac Asimov'}],['perro','gato']);

console.log('------------------------------------')
console.log('Objecto Creado')
console.log(user)
console.log('------------------------------------')
console.log('FullName')
console.log(user.getFullName())
console.log('------------------------------------')
console.log('Cantidad Mascotas')
console.log(user.countMascotas())
console.log('------------------------------------')
console.log('Agrego Mascota')
user.addMascota('pez')
console.log('------------------------------------')
console.log('Cantidad Mascotas')
console.log(user.countMascotas())
console.log('------------------------------------')
console.log('Lista de Libros')
console.log(user.getLibros())
console.log('------------------------------------')
console.log('Agrego Libro')
user.addLibro('Veinte mill leguas de viaje submarino','Julio Verne')
console.log('------------------------------------')
console.log('Lista de Libros')
console.log(user.getLibros())