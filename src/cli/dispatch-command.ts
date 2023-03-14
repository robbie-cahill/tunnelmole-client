import { Command } from "commander";
import tunnelmoleServer from "../tunnelmole-server";
import { setApiKey } from "../identity/api-key-service";
import { Options } from "../options";

const isNumber = require("is-number");

export default async function dispatchCommand(arg0 : any, command : Command) {
    const options : Options = {};

    // Handle argument actions e.g. "tmole <port>" or "tmole serve"
    if (isNumber(arg0)) {
        options.port = parseInt(arg0);
    } else {
        console.error('Please specify a number as the port, you passed in ' + arg0);
    }
    
    if (typeof command.args[1] === 'string' && command.args[1].toLowerCase() === 'as' && typeof command.args[2] === 'string') {
        options.domain = command.args[2];
    } else if (typeof command.args[1] === 'string' && command.args[1] === "AS" && typeof command.args[2] !== 'string') {
        console.info("Please enter the domain you want to expose e.g. foo.tunnelmole.com");
    } 

    if (options.port) {
        tunnelmoleServer(options);
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