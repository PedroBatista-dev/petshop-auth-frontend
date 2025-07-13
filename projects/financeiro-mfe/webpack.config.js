const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  output: {
    uniqueName: 'financeiroMfe',
    publicPath: 'auto',
  },
  optimization: {
    runtimeChunk: false,
  },
  experiments: {
    outputModule: true,
  },
  plugins: [
    new ModuleFederationPlugin({
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
    }),
  ]

});
