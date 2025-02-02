interface ConnectionInfo {
    isCli: boolean,
    isNpm: boolean,
    nodeVersion: string,
    tunnelmoleVersion?: string
}

export { ConnectionInfo }