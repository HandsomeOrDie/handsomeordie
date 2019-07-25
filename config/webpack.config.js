module.exports = {
    dev:{
        proxyTable:{
            "/finone-quantexecutor/metadata":{
                // target:"http://52.82.16.188:8888",
                target:"http://52.82.34.230:8080",
                changeOrigin:true
            },
            "/finone-quantexecutor-spdb":{
                target:"http://52.82.34.230:8080",
                // target:"http://192.168.2.174:8080",
                changeOrigin:true
            }
        }
    }
};
