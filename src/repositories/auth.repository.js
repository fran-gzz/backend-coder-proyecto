export default class AuthRepository {
    constructor( dao ) {
        this.dao = dao
    }
    create  = async ( data ) => await this.dao.create( data );
    readAll = async () => await this.dao.readAll()
    readOne = async ( email ) => await this.dao.readOne( email )
    update  = async ( id, data ) => await this.dao.update( id, data )
    delete  = async ( id ) => await this.dao.delete( id )
}