import InvalidSubscriptionMessage from "../messages/invalid-subscription-message.js";

export default function invalidSubscription(message: InvalidSubscriptionMessage): void {
    if (typeof message.apiKey === 'string') {
        console.info(
            'You have set the invalid api key ' + message.apiKey + '.\n\n' +
            'There is no active subscription associated with this api key, please check your account at https://dashboard.tunnelmole.com\n' +
            'Please set an api key for a valid subscription with "tmole --set-api-key <your_new_api_key>"\n\n' +
            'Falling back to free mode with a random subdomain.\n'
        );
    } else {
        console.info(
            'Custom tunnelmole.net subdomains are a premium feature and require a subscription.' + "\n\n" +
            'To get started, sign up at https://dashboard.tunnelmole.com.' + "\n\n" +
            'Tunnelmole is an open source project so you can also try self hosting, if you prefer to spend time instead of money.' + '\n' + 
            'Head over to https://github.com/robbie-cahill/tunnelmole-service to learn more.\n\n' +
            'Falling back to free mode with a random subdomain.\n\n'
        );
    }
}