export default interface ForwardedRequestMessage
{
    type: string,
    requestId: string,
    url: string,
    method: string,
    headers: any,
    body: any,
}