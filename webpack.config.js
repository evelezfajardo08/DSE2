module.exports = function (options, webpack) {
  return {
    ...options,
    externals: [], // Fuerza a Webpack a empaquetar @nestjs/jwt dentro del bundle final
  };
};