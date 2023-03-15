import instanceConfig from "./config-instance";
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