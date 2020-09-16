const config = {
  lintOnSave: process.env.NODE_ENV !== 'production',
  publicPath: process.env.IS_GITHUB_DEPLOY === 'true' ? '' : '/',
  configureWebpack: () => {
    const config = {}
    config.devtool = 'source-map'
    config.resolve = {
      symlinks: false,
      alias: require('./aliases.config').webpack,
    }
    
    return config
  },
  css: {
    // Enable CSS source maps.
    sourceMap: false,
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .options({
        svgo: {
          plugins: [
            {
              cleanupIDs: false,
            },
            {
              removeViewBox: false,
            },
            {
              removeDimensions: true,
            },
            {
              addAttributesToSVGElement: {
                attributes: [
                  {
                    role: 'img',
                  },
                ],
              },
            },
          ],
        },
      })
  },
}

module.exports = config
