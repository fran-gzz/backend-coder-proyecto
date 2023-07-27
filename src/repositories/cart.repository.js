export default class CartRepository {
    constructor( dao ) {
        this.dao = dao 
    }
    create   = async () => await this.dao.create()
    readAll  = async () => await this.dao.readAll()
    readOne  = async ( id ) => await this.dao.readOne( id )
    update   = async ( id, data ) => await this.dao.update( id, data )
    delete   = async( id ) => await this.dao.delete( id )
}