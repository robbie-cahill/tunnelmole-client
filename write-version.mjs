#!/usr/bin/env node
// Regenerates version.ts from the "version" field in package.json.
//
// version.ts used to be maintained by hand, so it drifted from package.json. Tunnelmole 2.4.1
// shipped a CLI that reported "2.4.0" because only package.json was bumped
// (see https://www.npmjs.com/package/tunnelmole/v/2.4.1). It also meant the tunnelmoleVersion
// sent to the service in connectionInfo reported the wrong version.
//
// This script runs automatically via the "prebuild" and "version" npm scripts, so version.ts
// can't drift any more. Run it by hand with: node write-version.mjs
//
// It is an .mjs file (rather than .js) so it still runs while the "prerollup" script has
// temporarily removed "type": "module" from package.json.

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const rootDir = dirname(fileURLToPath(import.meta.url));
const packageJsonPath = join(rootDir, 'package.json');
const versionFilePath = join(rootDir, 'version.ts');

const { version } = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

if (typeof version !== 'string' || version.trim() === '') {
    console.error(`No usable "version" field found in ${packageJsonPath}`);
    process.exit(1);
}

const contents = `// Generated from package.json by write-version.mjs. Do not edit by hand.
const version = '${version}';
export { version };
`;

const existing = (() => {
    try {
        return readFileSync(versionFilePath, 'utf8');
    } catch {
        return null;
    }
})();

if (existing === contents) {
    console.log(`version.ts is up to date with version ${version}`);
} else {
    writeFileSync(versionFilePath, contents);
    console.log(`version.ts generated with version ${version}`);
}
