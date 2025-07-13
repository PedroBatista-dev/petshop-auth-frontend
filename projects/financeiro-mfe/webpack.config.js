const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');
const path = require('path');

module.exports = withModuleFederationPlugin(
  { // Primeiro argumento: Opções específicas do Module Federation Plugin
    name: 'financeiroMfe',
    filename: 'remoteEntry.js',
    exposes: {
      './Routes': './projects/financeiro-mfe/src/app/app.routes.ts',
    },
    shared: {
      ...shareAll({
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto',
      }),
    },
  },
  { // Segundo argumento: Outras configurações gerais do Webpack
    output: {
      uniqueName: 'financeiroMfe',
      publicPath: 'auto',
      libraryTarget: 'var',
    },
    optimization: {
      runtimeChunk: false,
    },
    context: path.resolve(__dirname, './'), // Define o contexto para a pasta onde este webpack.config.js está (projects/auth-mfe)
    resolve: {
      modules: ['node_modules', path.resolve(__dirname, 'node_modules')]
    }
  }
);