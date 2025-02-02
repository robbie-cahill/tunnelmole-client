import { ConnectionInfo } from "../websocket/connection-info";

export default interface InitialiseMessage
{
    type: string,
    clientId: string,
    apiKey?: string,
    subdomain?: string,
    connectionInfo: ConnectionInfo
}