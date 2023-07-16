#!/usr/bin/env node

sendMessage({
    type: "cli-initialise",
    data: {
        nodeVersion: process.version ? process.version : "Unknown",
        platform: process.platform ? process.platform : "Unknown"
    }
});

// sourceMapSupport makes TypeScript line numbers show up in stack traces, making debugging much easier
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import program from 'commander';
import dispatchCommand from '../src/cli/dispatch-command.js';
import { sendMessage } from '../src/telemetry/send-message.js';

// This will make tunnelmole appear in the process list
process.title = "tunnelmole";

async function run()
{
    program
        .name('tunnelmole')
        .usage(
`

Get a random public URL: "tmole <port>"
For example you would run "tmole 80" (without the quotes) if your local server is running on port 80.
Your server will then be accessible under a random URL like https://f38fg.tunnelmole.net which will be shown in the output.
This method is free and is a good way to get started.

Get a public URL that does not change: "tmole <port> as <subdomain>.tunnelmole.net"
For example you would run "tmole 80 as myapi.tunnelmole.net" (without the quotes) if your server runs on port 80 and you want to make it available with the domain myapi.tunnelmole.net
This method requires a subscription which comes with an API key. Get one at https://dashboard.tunnelmole.com from $5.99 per month and support the development of this app.

tunnelmole.com URLs are accessible from any unrestricted internet connection in the world. You don't need special firewall rules or network config, all traffic is routed through this client app from our servers to your local server.

More detailed instructions, cookbooks and more are available at https://tunnelmole.com/docs
`
        )
        .version('2.1.12')
        .arguments('[arg0]')
        .option('--set-api-key <apiKey>', 'Set your API key. After purchasing a subscription you can copy and paste the command shown on the page')
        .description('tmole - Share your local server with a Public URL')
        .action(dispatchCommand);

    program.parse(process.argv);
}

(async function() {
    await run();
})();
