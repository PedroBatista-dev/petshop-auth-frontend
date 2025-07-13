const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  output: {
    uniqueName: 'shellHost',
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
      name: 'shellHost', // Nome do seu Host
      remotes: {
        // Remotos que este Host vai carregar
        'authMfe': 'authMfe@http://localhost:4201/remoteEntry.js', // <-- Auth MFE
        'financeiroMfe': 'financeiroMfe@http://localhost:4202/remoteEntry.js', // <-- Financeiro MFE
      },
      shared: {
        ...shareAll({
          singleton: true,
          strictVersion: true,
          requiredVersion: 'auto',
        }),
      },
    }),
  ],
});
