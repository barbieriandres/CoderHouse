import { promises as fs } from 'fs'
import config from '../config.js'

class ContenedorArchivo {

    constructor(ruta) {
        this.ruta = `${config.fileSystem.path}/${ruta}`;
    }

    async listar(id) {
        const objs = await this.listarTodo()
        return objs.find(obj => {
            return obj.id === id
            }
        )
    }

    async listarTodo() {
        try {
            const objs = await fs.readFile(this.ruta, 'utf-8')
            return JSON.parse(objs, 'utf-8')
        } catch (error) {
            return []
        }
    }

    async escribir(objs =[]){
        try {
            await fs.writeFile(this.ruta, JSON.stringify(objs,null,2),'utf-8')
        } catch(error){
            console.log('File Write Error')
            console.log(error)
        }
    }

    async guardar(obj) {
        const objs = await this.listarTodo()
        obj.id = Math.max(...objs.map(obj => obj.id), 0) + 1
        objs.push(obj)

        await this.escribir( objs )
        return obj.id
    }

    async actualizar(elem) {
        await this.borrar(elem.id)
        const objs = await this.listarTodo()
        objs.push(elem)
        await this.escribir( objs )
        return elem.id
    }

    async borrar(id) {
        const objCollection = await this.listarTodo()
        await this.escribir( objCollection.filter( obj => { return obj.id !== id }) )
    }

    async borrarTodo() {
        await this.escribir()
    }
}


export default ContenedorArchivo