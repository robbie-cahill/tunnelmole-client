import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';
import { version as versionModuleValue } from '../../version.js';
import { ROOT_DIR } from '../../src/filesystem/constants.js';

const packageJson = JSON.parse(readFileSync(join(ROOT_DIR, 'package.json'), 'utf8'));

describe('version', () => {
    // Guards against version.ts drifting from package.json, which is what caused 2.4.1 to
    // ship a CLI reporting "2.4.0" (version.ts was maintained by hand and the bump was missed).
    it('version.ts matches the version in package.json', () => {
        expect(versionModuleValue).toBe(packageJson.version);
    });

    // version.ts is only an input to the build. What actually gets published is the compiled
    // dist/version.js, so check the CLI end to end the way a user would.
    it('the CLI reports the same version as package.json', () => {
        const output = execFileSync(
            process.execPath,
            [join(ROOT_DIR, 'dist/bin/tunnelmole.js'), '--version'],
            {
                cwd: ROOT_DIR,
                encoding: 'utf8',
                timeout: 30000,
                env: {
                    ...process.env,
                    // Keep the test offline, the CLI sends telemetry as soon as it starts
                    TUNNELMOLE_TELEMETRY: '0'
                }
            }
        );

        expect(output.trim()).toBe(packageJson.version);
    });
});
