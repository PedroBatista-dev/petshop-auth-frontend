const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin(
  {
    // Primeiras opções: Configurações específicas do Module Federation
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
  },
  {
    // Segundas opções: Outras configurações gerais do Webpack (não relacionadas diretamente ao Module Federation)
    output: {
      uniqueName: 'shellHost',
      publicPath: 'auto',
      libraryTarget: 'var',
    },
    optimization: {
      runtimeChunk: false,
    },
  }
);