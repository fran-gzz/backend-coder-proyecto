export default class TicketRepository {
    constructor( dao ) {
        this.dao = dao
    }
    create   = async ( data ) => await this.dao.create( data )
    readAll  = async () => await this.dao.readAll()
    readOne  = async ( id ) => await this.dao.readById( id )
    update   = async ( id, data ) => await this.dao.update( id, data )
    delete   = async( id ) => await this.dao.delete( id )
}