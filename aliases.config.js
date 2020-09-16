const path = require('path')
const fs = require('fs')
const prettier = require('prettier')

const aliases = {
  /**
   * Needed to test @paessler/spectrum with `yarn link`
   *
   * Yarn link copies the whole node_modules folder from the local spectrum folder
   * which results in spectrum loading a different instance of vue
   */
  'vue/dist/vue.runtime.esm.js': path.resolve(
    __dirname,
    'node_modules/vue/dist/vue.runtime.esm.js'
  ),
  '@fixtures': 'tests/unit/fixtures',
  '@router': 'src/router',
  '@components': 'src/components',
  '@store': 'src/store',
  '@styles': 'src/styles',
  '@src': 'src',
}

module.exports = {
  webpack: {},
  jest: {},
  jsconfig: {},
}

for (const alias in aliases) {
  const aliasTo = aliases[alias]
  module.exports.webpack[alias] = resolveSrc(aliasTo)
  const aliasHasExtension = /\.\w+$/.test(aliasTo)
  module.exports.jest[`^${alias}$`] = aliasHasExtension
    ? `<rootDir>/${aliasTo}`
    : `<rootDir>/${aliasTo}/index.js`
  module.exports.jest[`^${alias}/(.*)$`] = `<rootDir>/${aliasTo}/$1`
  module.exports.jsconfig[`${alias}/*`] = [`${aliasTo}/*`]
  module.exports.jsconfig[alias] = aliasTo.includes('/index.')
    ? [aliasTo]
    : [
        `${aliasTo}/index.js`,
        `${aliasTo}/index.json`,
        `${aliasTo}/index.vue`,
        `${aliasTo}/index.scss`,
        `${aliasTo}/index.css`,
      ]
}

const jsconfigTemplate = require('./jsconfig.template') || {}
const jsconfigPath = path.resolve(__dirname, 'jsconfig.json')

fs.writeFile(
  jsconfigPath,
  prettier.format(
    JSON.stringify({
      ...jsconfigTemplate,
      compilerOptions: {
        ...(jsconfigTemplate.compilerOptions || {}),
        paths: module.exports.jsconfig,
      },
    }),
    {
      ...require('./.prettierrc'),
      parser: 'json',
    }
  ),
  (error) => {
    if (error) {
      console.error(
        'Error while creating jsconfig.json from aliases.config.js.'
      )
      throw error
    }
  }
)

function resolveSrc(_path) {
  return path.resolve(__dirname, _path)
}
