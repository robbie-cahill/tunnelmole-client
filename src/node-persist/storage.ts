import fs from 'fs';
import { LocalStorage } from 'node-localstorage';
import os from 'os';

let storage: LocalStorage;

const initStorage = async () => {
    const homedir = os.homedir();
    const dir = homedir + '/' + '.tmole.sh';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    storage = new LocalStorage(dir + '/local-storage');

    return;
}

export {
    initStorage,
    storage
}