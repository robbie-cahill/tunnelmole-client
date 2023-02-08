import instanceConfig from "./config-instance";
const deepmerge = require("deepmerge");

const baseConfig = {
    hostip: {
        domain: "service.tunnelmole.com",
        port: "80"
    },
    runtime: {
        debug: true
    }
}


const config = deepmerge(baseConfig, instanceConfig);

export default config;