import ClientDisconnect from "../messages/client-disconnect";

/**
 * Print the disconnection message to the console and then exit
 * 
 * @param message 
 */
export default function clientDisconnect(message: ClientDisconnect) {
    const { exitCode } = message;

    process.exit(exitCode ?? 0);
}
