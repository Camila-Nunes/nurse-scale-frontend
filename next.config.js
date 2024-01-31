// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

const path = require('path');

module.exports = {
  // ...
  // Sua configuração existente do Next.js aqui
  // ...
  webpack(config, { buildId, dev, isServer, defaultLoaders, webpack }) {
    // Configurar TypeScript para usar o outDir
    config.resolve.alias['@'] = path.resolve(__dirname, 'out');
    
    return config;
  },
};