## Tunnelmole
Tunnelmole is a simple tool to give your locally running HTTP(s) servers a public URL. For example, you could get a public URL for
- A web server
- A Docker container
- An API
- A React or node application
- A static website

So, you could have your application running locally on port `8080`, then by running `tmole 8080` you could have a URL such as `https://df34.tunnelmole.com` routing to your locally running application.

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
If you want to start using Tunnelmole right away without building it from source, the easiest method is to install the pre-built binary for your platform.

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
Download the `exe` file for Windows [here](https://tunnelmole.com/downloads/tmole.exe) and put it somewhere in your PATH.

If you're good with Powershell, feel free to come up with an easier copy/paste install method and send in a PR!.

#### Using Tunnelmole
- Start your web application locally and note down the port number its listening on
- Run `tmole <port number>`, replacing `<port number>` with your applications port number. For example, if your application listens on port `8080`, run `tmole 8080`.

Here's what it should look like
```
$ tmole 8080
http://evgtkh-ip-49-145-166-122.tunnelmole.com is forwarding to localhost:8080
https://evgtkh-ip-49-145-166-122.tunnelmole.com is forwarding to localhost:8080
```

Now, just go to either one of the URLs shown with your web browser.

You can also use another device, for example try hitting one of the URLs with your phones browser or a different computer.

The URLs are public - this means you can also share them with collaborators and others over the internet.

### Building from source
#### Prerequisites
- TypeScript 4.4 or later
- Node 15 or later

#### Install the dependencies with `npm`
Run `npm install`

#### Copy the example config
`cp config-instance.example.ts config-instance.ts`

The default settings are fine unless you want to self host your own [tunnelmole service](https://github.com/robbie-cahill/tunnelmole-service/), in which case you'll need to modify the config to point to your server.

#### Build the project
Run `npm run build`. If you want live recompilation every time you make a change run `npm run watch`.

#### Run Tunnelmole
Now run `npm start`. This uses `nodemon` which will automatically restart Tunnelmole every time the compiled JavaScript is updated. You can get hot reload if you combine this with `npm run watch`.

You can also invoke the compiled client manually with
`node dist/src/index.js <port number to forward to>`

### How it works
![How Tunnelmole Works](docs/img/how-tunnelmole-works.png)

Tunnelmole sets up a persistent Websocket connection between your device and a host machine running the [tunnelmole service](https://github.com/robbie-cahill/tunnelmole-service/). By default, this is the hosted tunnlemole service at [https://tunnelmole.com](https://tunnelmole.com?utm_source=tmoleClientGithubRepo) but you can self host.

As requests come in to the public URL, these requests are sent back through the Websocket connection to the client running on your machine.

The client then forwards on the request to your locally running web server.

Responses are handled in reverse. Your client forwards them to the Tunnelmole service, which then serves them up at the public URL.

### Contributing
There is no big company behind Tunnelmole and currently there is only one maintainer so any help is greatly appreciated!.

If you'd like a bug fixed or missing feature added, the fastest way to make that happen is to implement the changes yourself.

This repo has a few features to help with your developer experience including sample debugging configuration and hot reload.

Here are some different ways you can help
- Help with testing Tunnelmole. Install the latest binary or build the latest source release and do your best to break it. If you're able to, create an issue.
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

You will always be able to run and modify the Tunnelmole client and service free of charge forever provided you comply with the terms of the GNU Affero General Public License, version 3.

#### Does Tunnemole hide my IP?
In the past the Tunnelmole service did hide IP addresses. Unfortunately this encouraged bad actors to use the service. They would tunnel phishing sites through the service, then the abuse reports would get sent to my hosting provider instead of theirs.

Because of this, Tunnelmole now adds an `X-Forwarded-For` header with your IP in every response. So you can't use the Tunnelmole hosted service to hide your origin server. For the randomly generated URLs your IP is also added to the URL itself.

However, you can always self host Tunnelmole and remove the code that adds this header if you want. This would allow you to hide your origin server. You'll then be responsible for securing your service. The IP of the server you self host on will still be visible.


#### How can I help
Read the above "Contributing" section to learn how to contribute.

### Links and resources
- Project Website with guides and documentation: [https://tunnelmole.com](https://tunnelmole.com?utm_source=tmoleClientGithubRepo)
- A good overview of Websocket: [https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)