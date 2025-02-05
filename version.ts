import { readFile } from 'fs/promises';

const getPackageVersion = async(): Promise<string> => {
    try {
        const data = await readFile('./package.json', 'utf8');
        const packageJson = JSON.parse(data);

        return packageJson.version ?? "Unknown - version seems to be missing from package.json";
    } catch (error) {
        console.info('Error reading package.json:', error);
        return "Error reading version from package.json"
    }
}

export { getPackageVersion }
