module.exports = {
  webpack: function(config, env) {
    return config;
  },

  jest: function(config) {
    return Object.assign({}, config, {
      // bail: true,
      notify: true,
      // notifyMode: 'failure-success', // not yet supported
      verbose: false,
    });
  },

  devServer: function(configFunction) {
    return configFunction;
  }
}
