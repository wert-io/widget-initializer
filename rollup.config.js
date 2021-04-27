import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';

import { version } from './package.json';

export default {
  input: 'browser-script-entry.js',
  output: {
    file: `dist/wert-${version}.js`,
    format: 'iife',
  },
  plugins: [
    commonjs(),
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
