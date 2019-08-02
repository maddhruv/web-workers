import analyze from 'rollup-plugin-analyzer'
import minify from 'rollup-plugin-babel-minify'

export default [
  {
    input: 'index.js',
    output: {
      file: 'dist/umd/index.js',
      format: 'umd',
      name: 'WebWorker'
    },
    plugins: [
      minify(),
      analyze()
    ]
  },
  {
    input: 'index.js',
    output: {
      file: 'dist/esm/index.js',
      format: 'esm',
      name: 'WebWorker'
    },
    plugins: [
      minify(),
      analyze()
    ]
  }
]
