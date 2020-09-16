const config = {
  lintOnSave: process.env.NODE_ENV !== 'production',
  publicPath: process.env.IS_GITHUB_DEPLOY === 'true' ? 'PenAndPhone/' : '/',
}

module.exports = config
