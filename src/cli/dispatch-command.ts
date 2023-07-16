import { Command } from "commander";
import tunnelmole from "../tunnelmole.js";
import { Options } from "../options.js";
import isNumber from 'is-number';

/**
 * Build Options from the command line input, then pass them off to tunnelmole()
 */
export default async function dispatchCommand(arg0 : any, command : Command) {
    const options : Options = {};

    if (isNumber(arg0)) {
        options.port = parseInt(arg0);
    }
    
    if (typeof command.args[1] === 'string' && command.args[1].toLowerCase() === 'as' && typeof command.args[2] === 'string') {
        options.domain = command.args[2];
    } else if (typeof command.args[1] === 'string' && command.args[1] === "AS" && typeof command.args[2] !== 'string') {
        console.info("Please enter the domain you want to expose e.g. foo.tunnelmole.net");
    } 

    // Set the API key if an API key is passed in
    const apiKey = command.setApiKey || undefined;
    if (typeof apiKey === 'string') {
        options.setApiKey = command.setApiKey;
    }

    if (options.port || options.setApiKey) {
        // We have enough to Launch Tunnelmole
        tunnelmole(options);
        return;
    }

    // No actions to dispatch based on arguments. Show help.
    command.help();
}