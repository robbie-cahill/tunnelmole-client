import { Headers } from "../http/headers";

export default interface ForwardedRequestMessage
{
    type: string,
    requestId: string,
    url: string,
    method: string,
    headers: Headers,
    body: string,
}