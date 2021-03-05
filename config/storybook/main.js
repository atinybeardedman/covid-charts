const path = require('path');

module.exports = {
  stories: [
    '../../src/**/*.stories.js'
  ],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs',
    '@storybook/addon-storysource'
  ],

  webpackFinal: async (config, { configType }) => {

    config.resolve.extensions.push('.vue', '.css', '.less', '.scss', '.sass', '.html')

    // Use Sass loader for vuetify components
    config.module.rules.push({
      test: /\.sass$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'vue-style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            additionalData: "@import '@/styles/variables.scss';"
          }
        }
      ],
    });

    config.module.rules.push({
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
          vue: 'vue/dist/vue.js',
          'vue$': 'vue/dist/vue.esm.js',          
        },
      },
    });

    // Return the altered config
    return config;
  },
};