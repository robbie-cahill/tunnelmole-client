import ClientDisconnect from "../messages/client-disconnect";

/**
 * Print the disconnection message to the console and then exit
 * 
 * @param message 
 */
export default function clientDisconnect(message: ClientDisconnect) {
    const { logLevel, exitCode } = message;

    if (typeof console[logLevel] !== 'undefined') {
        console[logLevel](message.message);
    } else {
        console.info(message.message);
    }

    process.exit(exitCode ?? 0);
}
