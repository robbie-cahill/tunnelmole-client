/**
 * Wrapper around the ugly NodeJS async import() to make importing Tunnelmole in CommonJS projects much simpler
 *
 * @param {} options 
 */

const tunnelmole = async function(options) {
    const tunnelmole = await import('../dist/src/index.js');
    tunnelmole.tunnelmole(options);
};

module.exports = tunnelmole;