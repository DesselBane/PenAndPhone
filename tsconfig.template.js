module.exports = {
  compilerOptions: {
    target: 'esnext',
    module: 'esnext',
    strict: true,
    jsx: 'preserve',
    importHelpers: true,
    moduleResolution: 'node',
    skipLibCheck: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    sourceMap: true,
    baseUrl: '.',
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    types: ['webpack-env', 'jest', 'shims-vue.d.ts', 'cypress'],

    lib: ['esnext', 'dom', 'dom.iterable', 'scripthost'],
  },
  include: [
    'src/**/*.ts',
    'src/**/*.tsx',
    'src/**/*.vue',
    'tests/**/*.ts',
    'tests/**/*.tsx',
  ],
  exclude: ['node_modules'],
}
