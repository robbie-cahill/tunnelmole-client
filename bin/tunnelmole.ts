#!/usr/bin/env node
require('source-map-support').install();
import program from 'commander';
import { initialiseClientId } from '../src/identity/client-id-service';
import { initStorage } from '../src/node-persist/storage';
import dispatchCommand from '../src/cli/dispatch-command';

const VERSION = '1.0.2';

async function run()
{
    await initStorage();
    await initialiseClientId();

    program
        .name(' ')
        .usage(
`

Get a random public URL: "tmole <port>"
For example you would run "tmole 80" (without the quotes) if your local server is running on port 80.
Your server will then be accessible under a random URL like https://f38fg.tmole.sh which will be shown in the output.
This method is free and is a good way to get started.

Get a public URL that does not change: "tmole <port> as <subdomain>.tmole.sh"
For example you would run "tmole 80 as myapi.tmole.sh" (without the quotes) if your server runs on port 80 and you want to make it available with the domain myapi.tmole.sh
This method requires a subscription which comes with an API key. Get one at https://dashboard.tmole.sh from $5.99 per month and support the development of this app.

Tmole.sh URLs are accessible from any unrestricted internet connection in the world. You don't need special firewall rules or network config, all traffic is routed through this client app from our servers to your local server.

More detailed instructions, cookbooks and more are available at https://tmole.sh/docs
`
        )
        .version(VERSION)
        .arguments('[arg0]')
        .option('--set-api-key <apiKey>', 'Set your API key. After purchasing a subscription you can copy and paste the command shown on the page')
        .option('--debug')
        .description('tmole - Share your local server with a Public URL')
        .action(dispatchCommand);

    program.parse(process.argv);
}

(async function() {
    await run();
})();

export { program }