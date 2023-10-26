import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
    input: 'dist/bin/tunnelmole.js',
    output: {
        file: "tunnelmole.bundle.js",
        format: 'cjs'
    },
    plugins: [
        nodeResolve(),
        commonjs(),
        json()
    ]
};