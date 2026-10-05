const path = require('path');
const sass = require('sass');

const storyStyles = path.resolve(__dirname, '../stories/angular/styles.scss');

module.exports = baseConfig => {
  baseConfig.module.rules.push({
    test: [/\.stories\.ts?$/, /index\.ts$/],
    loaders: [
      {
        loader: require.resolve('@storybook/addon-storysource/loader'),
        options: {
          parser: 'typescript',
        },
      },
    ],
    include: [path.resolve(__dirname, '../stories/angular')],
    enforce: 'pre',
  });

  // @angular-devkit/build-angular still installs node-sass, and sass-loader
  // picks it up for the devkit's style rules unless told otherwise.
  baseConfig.module.rules.forEach(rule => {
    (rule.use || [])
      .filter(use => use.loader === 'sass-loader')
      .forEach(use => {
        use.options = Object.assign({}, use.options, { implementation: sass });
      });
    if (rule.test instanceof RegExp && rule.test.test(storyStyles)) {
      rule.exclude = [].concat(rule.exclude || [], storyStyles);
    }
  });

  baseConfig.module.rules.push({
    test: storyStyles,
    use: ['style-loader', 'css-loader', { loader: 'sass-loader', options: { implementation: sass } }],
  });

  return baseConfig;
};
