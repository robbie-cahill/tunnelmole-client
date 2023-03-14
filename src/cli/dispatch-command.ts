import { Command } from "commander";
import exposeServer from "../expose-server";
import { setApiKey } from "../identity/api-key-service";

const isNumber = require("is-number");

export default async function dispatchCommand(arg0 : any, command : Command) {
    // Handle argument actions e.g. "tmole <port>" or "tmole serve"
    if (isNumber(arg0)) {
        exposeServer(command);
        return;
    }

    // Handle options like --set-api-key
    const apiKey = command.setApiKey || undefined;
    if (typeof apiKey === 'string') {
        await setApiKey(apiKey);
        return;
    }

    // No actions to dispatch based on arguments. Show help.
    command.help();
}