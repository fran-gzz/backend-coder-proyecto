export default class CustomError {
    static createError({ name='error', cause, message, code = 1 }){
        const error = new Error(message, { cause });
        error.name = name;
        error.code = code;
        error.message = message
        throw error;
    }
}