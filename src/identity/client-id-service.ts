import { nanoid } from 'nanoid';
import { storage } from '../node-persist/storage.js';

const initialiseClientId = async () : Promise<void> => {
    // @todo Check for an existing client id before overwriting it with a new one
    const existingClientId = await getClientId();
    if (!existingClientId) {
        const clientId = nanoid();
        storage.setItem('clientId', clientId);
    }
}

const getClientId = async () : Promise<string> => {
    const clientId = storage.getItem('clientId');
    return clientId;
}

export {
    initialiseClientId,
    getClientId
}