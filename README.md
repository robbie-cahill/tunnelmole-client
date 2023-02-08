## Tunnelmole
Tunnelmole is a simple tool to give your locally web applications a public URL.

So, you could have your app running locally on port `8080`, then by running `tmole 8080` you could have a URL such as `https://df34.tunnelmole.com` routing to your locally running application.

Tunnelmole has been compared to a similar tool known as ngrok, but is open source.

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

#### Using `tmole`
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
If you don't like the idea of downloading and running untrusted binaries from the internet, or you want to contribute to the project, you can build your own local copy of `tmole` from source.

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

#### Run `tmole`
Now run `npm start`. This uses `nodemon` which will automatically restart `tmole` every time the compiled JavaScript is updated. You can get hot reload if you combine this with `npm run watch`.

You can also invoke the compiled client manually with
`node dist/src/index.js <port number to forward to>`

### How it works
![How Tunnelmole Works](docs/img/how-tunnelmole-works.png)

`tmole` sets up a persistent Websocket connection between your device and a host machine running the [tunnelmole service](https://github.com/robbie-cahill/tunnelmole-service/). By default, this is the hosted tunnlemole service at [https://tunnelmole.com](https://tunnelmole.com) but you can self host.

As requests come in to the public URL, these requests are sent back through the Websocket connection to the client running on your machine.

The client then forwards on the request to your locally running web server.

Responses are handled in reverse. Your client forwards them to the Tunnelmole service, which then serves them up at the public URL.

### FAQs
#### Does Tunnemole hide my IP?
In the past the Tunnelmole service did hide IP addresses. Unfortunately this encouraged bad actors to use the service. They would tunnel phishing sites through the service, then the abuse reports would get sent to my hosting provider instead of theirs.

Because of this, Tunnelmole now adds an `X-Forwarded-For` header with your IP in every response. So you can't use the `tmole` hosted service to hide your origin server. For the randomly generated URLs your IP is also added to the URL itself.

However, you can always self host `tmole` and remove the code that adds this header if you want. This would allow you to hide your origin server. You'll then be responsible for securing your service. The IP of the server you self host on will still be visible.

#### Is the URL always randomly generated? Can I choose the subdomain?
The simplest way to do this is to [purchase a paid subscription](https://dashboard.tunnelmole.com/) for ~$5 per month. You can then run tmole like this to get a custom subdomain: `tmole 8080 as myapp.tunnelmole.com`

You can also self host `tmole`. This is more work but great if you want total control. Its not a good time vs money investment if you are doing it to save money on the subscription fee even at minimum wage rates in most countries.

#### Is tmole open source?
Both the tmole client and server are fully open source. You can self host or use our hosted service.

Feel free to look over the code and see exactly what `tmole` is doing before running it.

You will always be able to run and modify the `tmole` client and service free of charge forever provided you comply with the terms of the GNU Affero General Public License, version 3.

Pull requests are welcome!

#### How do you pay the bills? How can I support the project?
I pay the bills through paid subscriptions to the hosted `tmole` service. If you'd like to support this project, purchasing a paid subscription is the best way to do it.


### Links and resources
- Project Website with guides and documentation: [https://tunnelmole.com](https://tunnelmole.com?utm_source=tmoleClientGithubRepo)
- A good overview of Websocket: [https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)