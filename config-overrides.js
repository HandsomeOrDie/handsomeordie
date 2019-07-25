// In vm, react hot reload is uesless,
// so add this file to set webpack's config.

module.exports = {
    devServer: function(configFunction) {
        return function(proxy, allowedHost) {
            const config = configFunction(proxy, allowedHost);
            config.watchOptions = {
                aggregeateTimeout: 300,
                poll: 1000
            };

            return config;
        };
    }
};
