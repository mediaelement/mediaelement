module.exports = {
  syntax: 'postcss-scss',
  plugins: [
    require('autoprefixer')({
      Browserslist: ['last 5 versions'],
    }),
    require('cssnano')({
      preset: 'default',
    }),
    require('postcss-sorting')({
      order: [
        'custom-properties',
        'dollar-variables',
        'declarations',
        'at-rules',
        'rules',
      ],
      'properties-order': 'alphabetical',
      'unspecified-properties-position': 'bottom',
    }),
    require('postcss-reporter')({
      clearReportedMessages: true,
    }),
    require('stylelint')({
      extends: './stylelintrc.json',
    })
  ]
};
