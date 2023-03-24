import events from 'events';

const eventHandler = new events.EventEmitter();

const URL_ASSIGNED = 'url-assigned';

export { 
    eventHandler, 
    URL_ASSIGNED 
}