import chalk from 'chalk';
import { HTTP_STATUS_MESSAGES } from './constants.js';

const getStatusString = (statusCode : number) : string => {
    const message = HTTP_STATUS_MESSAGES[statusCode] || 'Unknown status code';

    let formattedMessage : string;

    if (statusCode >= 100 && statusCode < 200) {
        // Informational responses: Blue
        formattedMessage = chalk.blue.bold(`[${statusCode} ${message}]`);
    } else if (statusCode >= 200 && statusCode < 300) {
        // Successful responses: Green
        formattedMessage = chalk.green.bold(`[${statusCode} ${message}]`);
    } else if (statusCode >= 300 && statusCode < 400) {
        // Redirection messages: Cyan
        formattedMessage = chalk.cyan.bold(`[${statusCode} ${message}]`);
    } else if (statusCode >= 400 && statusCode < 500) {
        // Client errors: Yellow
        formattedMessage = chalk.yellow.bold(`[${statusCode} ${message}]`);
    } else if (statusCode >= 500 && statusCode < 600) {
        // Server errors: Red
        formattedMessage = chalk.redBright.bold(`[${statusCode} ${message}]`);
    } else {
        // Fallback: White
        formattedMessage = chalk.white.bold(`[${statusCode} ${message}]`);
    }

    return formattedMessage;
}

export { getStatusString };
