import {readFileSync} from 'fs';
import resolve from 'rollup-plugin-node-resolve';
import flow from 'rollup-plugin-flow';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

const external = [
  'debug',
  'koa',
  'koa-bodyparser',
  'koa-mount',
  'koa-router',
  'koa-session',
  'node-fetch',
  'url',
];

const banner = readFileSync('./banner.js', 'utf-8').replace(
  '${version}',
  pkg.version,
);

export default {
  input: 'src/index.js',
  external,
  experimentalDynamicImport: true,
  plugins: [
    flow(),
    resolve({
      only: ['aquameta-datum', 'isomorphic-fetch', 'ramda'],
    }),
  ],
  output: [
    {
      banner,
      name: 'aquameta',
      file: pkg.main,
      format: 'cjs',
    },
    {
      banner,
      file: pkg.module,
      format: 'es',
    },
  ],
};
