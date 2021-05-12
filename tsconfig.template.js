module.exports = {
  compilerOptions: {
    target: 'esnext',
    module: 'esnext',
    moduleResolution: 'node',
    strict: true,
    jsx: 'preserve',
    sourceMap: true,
    resolveJsonModule: true,
    esModuleInterop: true,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    lib: ['esnext', 'dom'],
    types: ['vite/client'],
    baseUrl: '.',
  },
  include: ['src/**/*.ts', 'src/**/*.d.ts', 'src/**/*.tsx', 'src/**/*.vue'],

  exclude: ['node_modules'],
}
