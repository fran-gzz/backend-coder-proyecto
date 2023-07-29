import ErrorType from "../errors/error-type.js";

export default ( error, req, res, next ) => {
    switch( error.code ){
        case ErrorType.INVALID_TYPES_ERROR:
            res.send({ status: 'error', error: error.name })
            break;
        default:
            res.send({ status: 'error', error: 'Error desconocido' })
    }
}