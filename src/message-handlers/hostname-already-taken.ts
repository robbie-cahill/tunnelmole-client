export default async function hostnameAlreadyTaken(message: any) {
    console.error(message.hostname + " is already taken, please choose a different hostname");
    process.exit(0);
}