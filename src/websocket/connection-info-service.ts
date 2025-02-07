import { version } from "../../version.js";
import { ConnectionInfo } from "./connection-info";

/**
 * Basic connection info, to be used for upgrade notifications and the like
 */
const connectionInfo: ConnectionInfo = {
    isCli: false,
    isNpm: Boolean(process.env.npm_lifecycle_event),
    nodeVersion: process.version
}

const setIsCli = (isCli: boolean) => {
    connectionInfo.isCli = isCli;
};

const getConnectionInfo = () => {
    connectionInfo.tunnelmoleVersion = version
    return connectionInfo;
}

export {
    getConnectionInfo,
    setIsCli
}