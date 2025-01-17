/**
 * Sent to get the client to disconnect/exit with a message to be printed to the console
 */
export default interface ClientDisconnect {
    type: string,
    message: string,
    logLevel: string,
    exitCode?: number
}