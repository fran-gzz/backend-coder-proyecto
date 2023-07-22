export const serverErrorResponse = ( res, status ) => {
    switch ( status ) {
        case 400:
            return res.status( status ).json({
                ok: false,
                status: status,
                title: 'No se pudo procesar su solicitud.',
                message: 'Verifique los datos ingresados e intente nuevamente.',
            });
        case 401:
            return res.status( status ).json({
                ok: false,
                status: status,
                title: 'No autorizado',
                message: 'Credenciales inválidas.',
            });
        case 403:
            return res.status( status ).json({
                ok: false,
                status: status,
                title: 'Acceso denegado',
                message: 'El usuario no tiene permisos para realizar esta acción.',
            });
        case 404:
            return res.status( status ).json({
                ok: false,
                status: status,
                title: 'Oops...',
                message: 'No existe el elemento solicitado',
            });
        case 500:
            return res.status( status ).json({
                ok: false,
                status: status,
                title: 'Error interno del servidor.',
                message: 'Lamentamos el inconveniente, estamos trabajando para solucionarlo pronto.',
            });
        default:
            return res.status( 418 ).json({
                ok: false,
                status: 418,
                title: 'Error desconocido',
                message: 'Ocurrió un error desconocido.',
            });
    }
};