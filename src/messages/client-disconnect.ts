/**
 * Sent to get the client to disconnect/exit with a message to be printed to the console
 */
export default interface ClientDisconnect {
    type: string,
    exitCode?: number
}