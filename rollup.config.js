import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import { version } from './package.json';

const createPlugins = () => [
  nodeResolve(),
  commonjs(),
  json(),
  babel({
    babelrc: false,
    presets: [
      [
        '@babel/preset-env',
        {
          targets: 'defaults, ie >= 11',
          // debug: true,
        },
      ],
    ],
    babelHelpers: 'bundled',
  }),
];

export default [
  {
    input: 'browser-script-entry.js',
    output: {
      file: `dist/wert-${version}.js`,
      format: 'iife',
    },
    plugins: createPlugins(),
  },
  {
    input: 'browser-script-entry-esm.js',
    output: {
      file: `dist/wert-${version}.esm.js`,
      format: 'es',
    },
    plugins: createPlugins(),
  },
];
