import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import { version } from './package.json';

export default {
  input: 'browser-script-entry.js',
  output: {
    file: `dist/wert-${version}.js`,
    format: 'iife',
  },
  plugins: [
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
  ],
};
