'use strict';

class Logger {
    isDebugLog: boolean;
    isErrorLog: boolean;

    log(...args: any) {
        let newArgs = [];

        args.forEach((item) => {
            if (item instanceof Error) {
                newArgs.push(JSON.stringify(item, Object.getOwnPropertyNames(item)));
            } else if (typeof item === 'object') {
                newArgs.push(JSON.stringify(item));
            } else {
                newArgs.push(item);
            }
        });

        if (this.isDebugLog) {
            console.debug(...newArgs);
        } else if (this.isErrorLog) {
            console.error(...newArgs);
        } else {
            console.log(...newArgs);
        }
    }

    debug(...args: any) {
        this.isDebugLog = true;
        // Call the log function with the same arguments
        this.log.apply(this, [...arguments]);
        this.isDebugLog = false;
    }

    error(...args: any) {
        this.isErrorLog = true;
        // Call the log function with the same arguments
        this.log.apply(this, [...arguments]);
        this.isErrorLog = false;
    }
}

export const logger = new Logger();