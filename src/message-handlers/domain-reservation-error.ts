import DomainReservationError from "../messages/domain-reservation-error";

export default function domainReservationError(message: DomainReservationError) {
    console.info(
        `There was an error reserving the domain ${message.subdomain}.tunnelmole.net. Falling back to a random subdomain`
    );
}

export {
    domainReservationError
}