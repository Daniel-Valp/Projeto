/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['static.wikia.nocookie.net', 'localhost', 'cdn.theatlantic.com'],  // Adicionando o domínio da imagem
  },
};

module.exports = nextConfig;
