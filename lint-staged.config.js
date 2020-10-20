module.exports = {
  '*.ts': [
    'yarn lint:eslint --ext .ts',
    'yarn lint:prettier',
    'git add',
    'yarn test:unit:file',
  ],
  '{!(package)*.json,*.code-snippets,.*rc}': [
    'yarn lint:prettier --parser json',
    'git add',
  ],
  'package.json': ['yarn lint:prettier', 'git add'],
  '*.vue': [
    'yarn lint:eslint --ext .vue',
    'yarn lint:prettier',
    'git add',
    'yarn test:unit:file',
  ],
  '*.scss': ['yarn lint:prettier', 'git add'],
  '*.md': ['yarn lint:markdownlint', 'yarn lint:prettier', 'git add'],
  '*.{png,jpeg,jpg,gif}': ['imagemin-lint-staged', 'git add'],
}
