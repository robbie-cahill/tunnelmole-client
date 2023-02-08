export default interface ClientLog {
    clientId: string;
    eventKey: string;
    eventValue: string; // Literally send it as a string, JSON encoded
}