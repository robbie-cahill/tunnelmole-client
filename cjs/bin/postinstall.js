#!/usr/bin/env node
// eslint-disable-next-line
const axios = require("axios");

const installTelemetry = async () => {
  const telemetryEndpoint = `https://service.tunnelmole.com/tunnelmole-log-telemetry`;

  if (process.env.TUNNELMOLE_TELEMETRY === "0") {
    return;
  }

  // Need to find out what percentage of users who have installed Tunnelmole are using incompatible older Node versions
  // Using axios for commonjs support and maximum backwards compatiblity with old node versions
  axios
    .post(telemetryEndpoint, {
    type: "post-install",
    data: {
        nodeVersion: process.version ? process.version : "Unknown",
        platform: process.platform ? process.platform : "Unknown"
    }
    }).then(function () {
      // Ignore the response
    }).catch(function () {
      // Ignore the error
    });
};

installTelemetry();

console.log(`
━━━━╮╱╱╱╱╱╱╱╱╱╱╭╮╱╱╱╱╱╱╭╮
┃╭╮╭╮┃╱╱╱╱╱╱╱╱╱╱┃┃╱╱╱╱╱╱┃┃
╰╯┃┃┣┫╭┳━╮╭━╮╭━━┫┃╭╮╭┳━━┫┃╭━━╮
╱╱┃┃┃┃┃┃╭╮┫╭╮┫┃━┫┃┃╰╯┃╭╮┃┃┃┃━┫
╱╱┃┃┃╰╯┃┃┃┃┃┃┃┃━┫╰┫┃┃┃╰╯┃╰┫┃━┫
╱╱╰╯╰━━┻╯╰┻╯╰┻━━┻━┻┻┻┻━━┻━┻━━╯
Congrats! Tunnelmole is now installed 😃
Now what?
- Get a random public URL for a local server: "tmole <port>" e.g. "tmole 80" if your server is running on port 80
- Get a customized public URL for a local server: "tmole 80 as mysite.tunnelmole.net"
- Read the docs for more detailed instructions https://tunnelmole.com/docs
`);
