import { createLogger, format, transports } from 'winston';
import chalk from 'chalk';




function newLogger(){

    const logger = createLogger({
    level: 'info',
    format: (
        format.simple()/*,
        format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()*/
    ),
    //defaultMeta: { service: 'your-service-name' },
    transports: [
        //
        // - Write to all logs with level `info` and below to `quick-start-combined.log`.
        // - Write all logs error (and below) to `quick-start-error.log`.
        //
        new transports.File({ filename: 'quick-start-error.log', level: 'error', options: { flags: 'w' } }),
        new transports.File({ filename: 'quick-start-combined.log', options: { flags: 'w' } })
    ]
    });

    //
    // If we're not in production then **ALSO** log to the `console`
    //

//const LEVEL = Symbol.for('level');

//const colorizeFormat = format.colorize({ colors: { info: 'blue' }});

    /*const info = colorizeFormat.transform({
        [LEVEL]: 'info',
        level: 'info',
        message: 'my message'
      }, { all: true });*/



    if (process.env.NODE_ENV !== 'production'){
        logger.add(new transports.Console({
            format: format.combine(
            format.colorize({message:true, colors: { error: 'red', info: 'white'} }),
            format.simple()
            )
            
        }));
    }

    
    

    return logger;
}

function logMessage(i:number, linksLen:number, status:number, elapsed_time:number, url:string){
        return `${i+1}/${linksLen} - ${status} -  ${Math.floor(elapsed_time)} ms - ${url}`;


    
}

const logger = newLogger();

export {
    newLogger,
    logMessage,
    logger
}