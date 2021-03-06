/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require('fs')
const prettier = require('prettier')

function resolveSrc(_path) {
  return path.resolve(__dirname, _path)
}

const aliases = {
  '@components': 'src/components',
  '@styles': 'src/styles',
  '@views': 'src/views',
  '@models': 'src/models',
  '@helper': 'src/helper',
  '@store': 'src/store',
}

module.exports = {
  jest: {},
  tsconfig: {},
  vite: [],
}

for (const alias in aliases) {
  const aliasTo = aliases[alias]

  module.exports.vite.push({
    find: alias,
    replacement: resolveSrc(aliasTo),
  })

  const aliasHasExtension = /\.\w+$/.test(aliasTo)
  module.exports.jest[`^${alias}$`] = aliasHasExtension
    ? `<rootDir>/${aliasTo}`
    : `<rootDir>/${aliasTo}/index.ts`

  module.exports.jest[`^${alias}/(.*)$`] = `<rootDir>/${aliasTo}/$1`
  module.exports.tsconfig[`${alias}/*`] = [
    `${aliasTo}/*`,
    `${aliasTo}/*.ts`,
    `${aliasTo}/*.vue`,
  ]
  module.exports.tsconfig[alias] = aliasTo.includes('/index.')
    ? [aliasTo]
    : [
        `${aliasTo}/index.ts`,
        `${aliasTo}/index.json`,
        `${aliasTo}/index.vue`,
        `${aliasTo}/index.scss`,
        `${aliasTo}/index.css`,
      ]
}

const tsconfigTemplate = require('./tsconfig.template') || {}
const tsconfigPath = path.resolve(__dirname, 'tsconfig.json')

fs.writeFile(
  tsconfigPath,
  prettier.format(
    JSON.stringify({
      ...tsconfigTemplate,
      compilerOptions: {
        ...(tsconfigTemplate.compilerOptions || {}),
        paths: module.exports.tsconfig,
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
