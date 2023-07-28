## Tunnelmole
![Tunnelmole](https://raw.githubusercontent.com/robbie-cahill/tunnelmole-client/main/docs/img/tunnelmole.png)

Tunnelmole is a simple tool to give your locally running HTTP(s) servers a public URL. For example, you could get a public URL for
- A web server
- A Docker container
- An API
- A React or node application
- A static website

So, you could have your application running locally on port `8080`, then by running `tmole 8080` you could have a URL such as `https://df34.tunnelmole.net` routing to your locally running application.

### Quick Demo
*Getting a Public URL for the Tunnelmole Website, which is running locally*
![Tunnelmole Example](https://raw.githubusercontent.com/robbie-cahill/tunnelmole-client/main/docs/img/tunnelmole-demo.gif)

Tunnelmole has been compared to a similar tool known as `ngrok`, but is open source.

If you are using the default configuration you will get a HTTPs URL for free.

Heres what you could do with your new public URL
- Automate your life. With a public URL, IFTTT and other automation services can send you webhooks which your code can then react to
- Test and debug webhooks locally without stubbing requests. Set a breakpoint, then trigger the webhook provider to hit your URL
- Use your phone to test the mobile version of your site. A real device will always be better than using an emulator or devtools to do mobile testing
- Test advanced HTTPs only features such as Web Notifications and PWA's locally
- Cross device testing with real devices. Hop on another computer or device running the same or a different OS, then hit the public URL Tunnelmole generated for you
- Share it with anyone over the internet such as a friend, colleague or client to show off your work

### Installation
There are a couple of ways to install Tunnelmole.

If you have **NodeJS 16.10** or later, you can install Tunnelmole by running
```
sudo npm install -g tunnelmole
```

Alternatively you can install the latest precompiled binary for your platform. This has the right version of Node built in. You don't need any specific version of Node installed for this approach
#### Linux
Copy and paste the following into a terminal
```
curl -s https://tunnelmole.com/sh/install-linux.sh | sudo bash 
```

#### Mac
Copy and paste the following into a terminal
```
 curl -s https://tunnelmole.com/sh/install-mac.sh --output install-mac.sh && sudo bash install-mac.sh 
```

#### Windows
We recommend installing with NPM on Windows as it sets up `.cmd` files that will allow you to run `tmole` from any folder on the command line or Powershell.

Alternatively, download the `exe` file for Windows [here](https://tunnelmole.com/downloads/tmole.exe) and put it somewhere in your PATH.


#### Install with NPM
To install Tunnelmole with NPM you need to have NodeJS installed. If not, get it from (https://nodejs.org/).

`npm install -g tunnelmole`

#### Using Tunnelmole
- Start your web application locally and note down the port number its listening on
- Run `tmole <port number>`, replacing `<port number>` with your applications port number. For example, if your application listens on port `8080`, run `tmole 8080`.

Here's what it should look like
```
$ tmole 8080
http://evgtkh-ip-49-145-166-122.tunnelmole.net is forwarding to localhost:8080
https://evgtkh-ip-49-145-166-122.tunnelmole.net is forwarding to localhost:8080
```

Now, just go to either one of the URLs shown with your web browser.

You can also use another device, for example try hitting one of the URLs with your phones browser or a different computer.

The URLs are public - this means you can also share them with collaborators and others over the internet.

#### Custom subdomain
Sometimes, it can be useful to have a domain that does not change frequently. To use a custom subdoman run
`tmole 8080 as <yourdomain>.tunnelmole.net`.

If you are using the hosted service (which is the default) and you want to use a custom subdomain you'll need to purchase a subscription [Learn More](https://dashboard.tunnelmole.com?utm_source=tunnelmoleClientGithub).

Otherwise, you can self host. To learn more go to the [Tunnelmole Service](https://github.com/robbie-cahill/tunnelmole-service/) GitHub repo.

### Integrating with NodeJS and TypeScript projects with NPM
Tunnelmole is available as an NPM dependency for integration with NodeJS and TypeScript projects.

#### Install as an npm dependency
To integrate tunnelmole with your project you first need to install it as an NPM dependency.
```
npm install --save tunnelmole
```

#### Starting tunnelmole using code
First import `tunnelmole`. Both ES and CommonJS modules are supported.

Importing `tunnelmole` as an ES module
```javascript
import { tunnelmole } from 'tunnelmole';
```

Importing `tunnelmole` as a CommonJS module
```javascript
const tunnelmole = require('tunnelmole/cjs');
```

Once the module is imported you can start tunnelmole with the code below, changing port 3000 to the port your application listens on if it is different.
```javascript
tunnelmole({
    port: 3000
});
```

Tunnelmole will start in the background and you'll see output in the console log similar to the Tunnelmole command line application which will include the public URLs that now point to your application. The function is `async` and won't block execution of the rest of your code.

If you want to use a custom subdomain, you could also pass the domain as an option.
```javascript
tunnelmole({
    port: 3000,
    domain: '<your tunnelmole domain e.g. mysite.tunnelmole.net>'
});
```
Again if you are using the hosted service (which is the default) and you want to use a custom subdomain you'll need to purchase a subscription [Learn More](https://dashboard.tunnelmole.com?utm_source=tunnelmoleClientGithub).

Otherwise, you can self host. To learn more about this option go to the [Tunnelmole Service](https://github.com/robbie-cahill/tunnelmole-service/) GitHub repo.

#### Using Tunnelmole with NPM scripts
Installing Tunnelmole as an NPM dependency will make the following executables available in your project:
```
node_modules/.bin/tmole
node_modules/.bin/tunnelmole
```

They both work identically to the Tunnelmole command line application.

You can run them manually in the same way as the command line application (for example `node node_modules/.bin/tmole 3000`), but its far more convenient to integrate them with NPM scripts in `package.json`. This way, you can automate starting your application and generating a public URL with a single command. For example:
```json
{
    "name": "myapp",
    "version": "0.0.1",
    "scripts": {
        "start": "dist/index.js",
        "start-public": "npm run start && tmole 3000"
    }
}
```

In this example, `npm run start-public` will simultaneously start your application and get tunnelmole to generate public URLs tunneling to port 3000. Replace port 3000 with the port your application listens on if it is different. You will see the public URLs in the command line output.

This allows you to start your application and get a public URL with a single command, instead of needing to run two commands in separate terminals.

### Building from source
#### Prerequisites
- TypeScript 4.4 or later
- Node 15 or later

#### Install the dependencies with `npm`
Run `npm install`

#### Copy the example config
`cp config-instance.example.ts config-instance.ts`

The default settings are fine unless you want to self host your own [tunnelmole service](https://github.com/robbie-cahill/tunnelmole-service/), in which case you'll need to modify the config to point to your server.

#### Start Tunnelmole
To start Tunnelmole, run `npm start`. 

This does a few things for you automatically:
- First, the code will compile
- Tunnelmole will then start
- Every time you make changes, the code will recompile and Tunnelmole will automatically restart. This saves you time as you won't need to manually recompile and restart Tunnelmole yourself. This feature is also known as Hot Reload.

Alternatively you can invoke Tunnelmole manually with
`node dist/bin/tunnelmole.js <port number to forward to>` after compiling the code with `npm run build`.

#### Debugging
This project has sourcemaps enabled, so you can set breakpoints in the TypeScript `.ts` files and they should behave normally.

If Tunnelmole crashes and you get a Stack Trace it will refer to the TypeScript files and line numbers which should make tracking down problematic code easier.

To set up debugging for Visual Studio Code, copy over the example config.
```
cp .vscode/launch.json.example .vscode/launch.json
```
Once this is done, run "Launch Tunnelmole" from the Run and Debug menu.

While debugging, hot reload is not supported as you'd loose your debug connection each time Tunnelmole restarts. So for every change, you will need to recompile the code (i.e. with `npm run build`) and then restart the debugger.

You can optionally run `npm run watch` to automatically recompile code as you make changes.

By default, Launch Tunnelmole invokes Tunnelmole to forward to port 8001 locally. You can change this by changing the port in the `.vscode/launch.json` config under the "args" section.

### How it works
![How Tunnelmole Works](https://raw.githubusercontent.com/robbie-cahill/tunnelmole-client/main/docs/img/how-tunnelmole-works.png)

Tunnelmole sets up a persistent Websocket connection between your device and a host machine running the [tunnelmole service](https://github.com/robbie-cahill/tunnelmole-service/). By default, this is the hosted tunnlemole service at [https://tunnelmole.com](https://tunnelmole.com?utm_source=tmoleClientGithubRepo) but you can self host.

As requests come in to the public URL, these requests are sent back through the Websocket connection to the client running on your machine.

The client then forwards on the request to your locally running web server.

Responses are handled in reverse. Your client forwards them to the Tunnelmole service, which then serves them up at the public URL.

### Telemetry
To help improve the developer experience of Tunnelmole, some anonymized Telemetry data is collected by default.

For example
- Your NodeJS version and OS
- Crash reports which may include stack traces to assist in detecting and debugging unforseen issues that were not detected during testing (especially the "it worked on my machine" type).

To disable the telemetery, add the variable `TUNNELMOLE_TELEMETRY=0` to your environment.

On Linux and Mac, to opt out for a single run of Tunnelmole you could put this in front of the `tmole` command, for example
```
TUNNELMOLE_TELEMETRY=0 tmole 80
```

To opt out by default:
- On Linux or Mac add `export TUNNELMOLE_TELEMETRY=0` to your shells startup script, usually `.bashrc` or `.zshrc` but it will be different if you are not using bash or zsh as your shell. Then log out and back in to apply the changes. 
- On Windows add `TUNNELMOLE_TELEMETRY=0` to your environment variables using the System utility https://www.computerhope.com/issues/ch000549.htm. Then restart your computer to apply the changes.



### Contributing
There is no big company behind Tunnelmole and currently there is only one maintainer so any help is greatly appreciated!.

If you'd like a bug fixed or missing feature added, the fastest way to make that happen is to implement the changes yourself.

This repo has a few features to help with your developer experience including sample debugging configuration and hot reload.

Here are some different ways you can help
- Help with testing Tunnelmole. Install the latest binary or build the latest source release and do your best to break it. If you're able to, create an issue.
- Spreading the word. As previously mentioned, there is no big company or marketing department. That leaves it up to you to help others by introducing them to Tunnelmole. Sharing Tunnelmole on social media sites and creating blog articles will help you look good and help other developers.
- Fixing bugs
- Making feature requests. To do this, create a GitHub issue and describe the feature you think Tunnelmole should have
- Implementing features

For any code changes, you will need to fork this repo and submit a PR. If you've never done this before, GitHub has a very good guide [here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork).

### FAQs

#### Is Tunnelmole fully open source?
Both the Tunnelmole client and server are fully open source. 

You are free to self host or use our hosted service.

We welcome issue reports and PRs from the community.

Feel free to look over the code and see exactly what Tunnelmole is doing before running it.

The Tunnelmole client is licensed under the MIT license. The service is licensed under the Gnu Affero General Public License, version 3.

#### Does Tunnemole hide my IP?
In the past the Tunnelmole service did hide IP addresses. Unfortunately this encouraged bad actors to use the service. They would tunnel phishing sites through the service, then the abuse reports would get sent to my hosting provider instead of theirs.

Because of this, Tunnelmole now adds an `X-Forwarded-For` header with your IP in every response. So you can't use the Tunnelmole hosted service to hide your origin server. For the randomly generated URLs your IP is also added to the URL itself.

However, you can always self host Tunnelmole and remove the code that adds this header if you want. This would allow you to hide your origin server. You'll then be responsible for securing your service. The IP of the server you self host on will still be visible.


#### How can I help
Read the above "Contributing" section to learn how to contribute.

### Links and resources
- Project Website with guides and documentation: [https://tunnelmole.com](https://tunnelmole.com?utm_source=tmoleClientGithubRepo)
- A good overview of Websocket: [https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

