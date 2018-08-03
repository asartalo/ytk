module.exports = {
  webpack: function(config, env) {
    return config;
  },

  jest: function(config) {
    config.bail = true;
    config.notify = true;
    return {
      ...config,
      // bail: true,
      // notify: true,
      // notifyMode: 'failure-success', // not yet supported
      verbose: true,
    };
  },

  devServer: function(configFunction) {
    return configFunction;
  }
}
