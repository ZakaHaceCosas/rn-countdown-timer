const fs = require('fs')
const esbuild = require('esbuild')
const pkg = require('../package.json')

esbuild
  .build({
    outfile: pkg.main,
    entryPoints: [pkg.source],
    bundle: true,
    minify: true,
    external: ['react', 'react-native', 'react-native-svg'],
    format: 'esm',
  })
  .then(() => {
    fs.copyFile('./src/shared/types.ts', './lib/index.d.ts', (err) => {
      if (err) {
        throw err
      }
    })
  })
