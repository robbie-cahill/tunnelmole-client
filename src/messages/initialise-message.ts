export default interface InitialiseMessage
{
    type: string,
    clientId: string,
    apiKey?: string,
    subdomain?: string,
    reconnect?: boolean
}