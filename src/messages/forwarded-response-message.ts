
export default interface ForwardedResponseMessage
{
    type: "forwardedResponse",
    requestId: string,
    url: string,
    statusCode: number,
    headers: any,
    body: string // Base64 encoded
}