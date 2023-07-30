import winston from "winston";
import { env } from './config.js'

const customWinstonOptions = {
    levels: {
        fatal:   0,
        error:   1, 
        warning: 2,
        info:    3,
        http:    4,
        debug:   5,
    },
    colors: {
        fatal:   'red',
        error:   'red', 
        warning: 'yellow',
        info:    'blue',
        htttp:   'green',
        debug:   'white',
    }
}


winston.addColors( customWinstonOptions.colors )

const createLogger = env => {
    if( env === 'PROD' ){
        return winston.createLogger({
            levels: customWinstonOptions.levels,
            level: 'info',
            transports: [
                new winston.transports.File({
                    filename: 'error.log',
                    format: winston.format.simple()
                })
            ]
        })
    } else {
        return winston.createLogger({
            levels: customWinstonOptions.levels,
            level: 'debug',
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                })
            ]
        })
    }
}
const logger = createLogger( env.enviroment )
export default logger;