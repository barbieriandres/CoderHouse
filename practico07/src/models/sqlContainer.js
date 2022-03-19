/*
const { optionsDatabaseMariaDb, optionsDatabaseSqlite3 } = require( './databaseConfig.js' )

{
  tableName = 'productos',
  searchId = 'id',
  tableColumns = {
    title: 'string',
    price: 'float',
    thumbnail: 'string',
    description: 'string',
    ranking: 'integer',
    id: 'primary'
  }
}

{
    tableName = 'chat',
    searchId = 'id',
    tableColumns = {
        usermail: 'string',
        input: 'string',
        timestamp: 'timestamp',
        id: 'primary'
    }
}
*/

class sqlContainer {
    constructor( knexOptions, dataModel){
        this.knex = require('knex')(knexOptions)
        this.dataModel = dataModel

        this.knex
            .schema
            .hasTable( dataModel.tableName )
            .then( exists=> {
                if (!exists) {
                    this.knex // **** BuildTable
                        .schema
                        .createTable( dataModel.tableName, table => {
                            for ( const [col, type] of Object.entries(dataModel.tableColumns) ){
                                switch (type){
                                    case 'primary':
                                        table.increments( col ).primary();
                                        break;
                                    case 'float':
                                        table.float( col );
                                        break;
                                    case 'integer':
                                        table.integer( col );
                                        break;
                                    case 'timestamp':
                                        table.timestamp( col ).defaultTo(this.knex.fn.now())
                                        break;
                                    default:
                                        table.string( col );
                                        break;
                                }
                            }
                        })
                        .then(console.log(`created ${dataModel.tableName} table`));
                }
            })
    }

    /*
        Load Data Every Time you Run a function.
    */
    async getAll(){
        try {
            return await this.knex
                            .from( this.dataModel.tableName )
                            .select('*')
        } catch(error){
            return []
        }

    }

    /*
        Read & Find
    */
    async getById(id){
        return await this.knex
                            .from( this.dataModel.tableName )
                            .select('*')
                            .where( this.dataModel.searchId, id )
    }

    /*
        Add Object to Collection
    */
    async save( obj ){
        return await this.knex( this.dataModel.tableName ).insert( obj )
    }

    /*
        Modify By Id
        Borrado
    */
    async modifyById( obj ){
        await this.deleteById( obj.id )
        await this.save( obj )
        return obj.id
    }

    /*
        Delete object with id
    */
    async deleteById( id ){
        await this.knex( this.dataModel.tableName )
                    .where( this.dataModel.searchId, id )
                    .del()
    }

    /*
        Delete All
    */
    async deleteAll(){
        await this.knex( this.dataModel.tableName )
                .del()
    }
}

module.exports = sqlContainer