import { program } from "..";


export default async function log(message: string, level : 'info'|'warning'|'error' = 'info') {
    program
    switch (level) {
        case 'info':
            if (program.debug) {
                console.info(message);
            }
            break;
        case 'warning':
            console.warn(message);
            break;
        case 'error':
            console.error(message);
            break;
        default:
            console.info(message);
            break;
    }
}