import instanceConfig from "./config-instance.js";
const deepmerge = require("deepmerge");

const baseConfig = {
    hostip: {
        endpoint: "service.tunnelmole.com",
        port: "80"
    },
    runtime: {
        enableLogging: true
    }    
}


const config = deepmerge(baseConfig, instanceConfig);

export default config;