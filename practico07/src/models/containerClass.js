const fs = require('fs')

class Container {
    constructor(filename){
        this.filename = filename
    }

    /*
        Load Data Every Time you Run a function.
    */
    async getAll(){
        try {
            const fileData = await fs.promises.readFile(this.filename)
            return JSON.parse(fileData, 'utf-8')
        } catch(error){
            return []
        }
    }

    /*
        Read & Find
    */
    async getById(id){
        const objCollection = await this.getAll()
        return objCollection.find(obj => {
            return obj.id === id
            })
    }

    /*
        Add Object to Collection
    */
    async save( obj ){
        const objCollection = await this.getAll()
        obj.id = Math.max(...objCollection.map(obj => obj.id), 0) + 1      
        objCollection.push( obj )
        await this.write( objCollection )
        return obj.id
    }

    /*
        Write Collection to File
    */
    async write(objCollection =[]){
        try {
            await fs.promises.writeFile(this.filename, JSON.stringify(objCollection,null,2),'utf-8')
        } catch(error){
            console.log('File Write Error')
        }
    }

    /*
        Find obj by id
    */
    async getById(id){
        const array = await this.getAll()
        const objeto = array.filter(function (array) { return array.id == id; })
        return (objeto.length > 0) ? objeto[0] : null
    }

    /*
        Modify By Id
        Borrado
    */
    async modifyById(objeto){
        await this.deleteById(objeto.id)
        const array = await this.getAll()
        array.push(objeto)
        await this.write(array)
        return objeto.id
    }

    /*
        Delete object with id
    */
    async deleteById(id){
        const objCollection = await this.getAll()
        await this.write( objCollection.filter( obj => { return obj.id !== id }) )
    }

    /*
        Delete All
    */
    async deleteAll(){
        await this.write()
    }
}

module.exports = Container