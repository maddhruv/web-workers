import analyze from 'rollup-plugin-analyzer'
import minify from 'rollup-plugin-babel-minify'

export default {
  input: 'index.js',
  output: {
    file: 'dist.js',
    format: 'commonjs',
    name: 'WebWorker'
  },
  plugins: [
    minify(),
    analyze()
  ]
}
