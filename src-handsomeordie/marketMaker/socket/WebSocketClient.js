import Config from "./Config";
import Global from "./Global";
import { isArray } from "util";

let socket = window.atmosphere;
let subSocket = [];
let isConnecting = false;
let broadcastSubscriptions = {};
let broadcastSubscriptionSeq = 0;
let subscriptionCache = [];

function connect(params) {
    console.log("web socket do connect");
    if (isConnecting) {
        console.log("isConnecting, return.");
        return;
    }
    isConnecting = true;
    // clear cache
    if (subSocket) {
        if (broadcastSubscriptions) {
            for (let mtype in broadcastSubscriptions) {
                let subscriptions = broadcastSubscriptions[mtype];
                subscriptions.forEach((item, index, allItems) => {
                    unsubscribeMessage(item);
                });
                // subscriptions.map((item,index)=>{
                //     unsubscribeMessage(item);
                // })
            }
        }
        // disconnect
        socket.unsubscribe();
    }
    broadcastSubscriptions = {};
    broadcastSubscriptionSeq = 0;


    let req = new socket.AtmosphereRequest();
    console.log("%c@@@@req.url", "color:green", JSON.parse(localStorage.getItem("userInfo")));
    req.url = "http://" +(localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).subscribeDomain : "") + Config.context +
        "/subscribe/websocket";

    console.log(`req.url=${req.url}`);
    req.contentType = "application/json";
    req.logLevel = "info";
    //		req.transport = 'long-polling';
    req.transport = "websocket";
    req.fallbackTransport = "long-polling";
    //		req.fallbackTransport = 'websocket';
    req.timeout = 30000000;
    // req.maxReconnectOnClose = 429496729;
    req.reconnectInterval = 5000;
    // req.connectTimeout = 10000;
    if (JSON.parse(localStorage.getItem("userInfo")).token) {
        req.headers = {
            token: JSON.parse(localStorage.getItem("userInfo")).token
        };
    }

    req.onOpen = function (response) {
        console.log(req.url + ", Connection opened, transport: " + response.transport);
        isConnecting = false;
        if (subscriptionCache.length > 0) {
            subscriptionCache.forEach((item, index, allItems) => {
                subscribeMessage(item);
            });
            // subscriptionCache((item,index)=>{
            //     subscribeMessage(item);
            // })
            subscriptionCache = [];
        }
        params && params.onOpen && params.onOpen();
    };
    req.onClose = function (response) {
        console.log(req.url + ", onClose");
        params && params.onClose && params.onClose();
    };
    req.onError = function (response) {
        console.log(req.url + ", onError");
        params && params.onError && params.onError();
        // Ext.Msg.alert('Warn', 'Connection error, please try do refresh page.');
    };
    req.onReconnect = function (response) {
        console.log(req.url + ", onReconnect");
        params && params.onReconnect && params.onReconnect();
    };
    req.onClientTimeout = function (response) {
        console.log(req.url + ", onClientTimeout");
        if (isConnecting === false) {
            connect();
        }
    };
    req.onMessage = function (response) {
        var message = response.responseBody;

        var json = null;
        try {
            json = eval("(" + message + ")");

        } catch (e) {
            console.log(message);
            console.log("This doesn't look like a valid JSON: ", message);
            return;
        }
        // Fire callbacks
        if (isArray(json)) {
            //    forEach(json, function (item, index, allItems) {
            //         fireBroadcastMessage(item);
            //     });
            json.map((item, index) => {
                fireBroadcastMessage(item);
            });
        }
        else
            fireBroadcastMessage(json);
    };

    subSocket = socket.subscribe(req);
}

function fireBroadcastMessage(message) {
    var subscriptions = broadcastSubscriptions[message["mtype"]];
    if (subscriptions) {
        subscriptions.map((item, index) => {
            var filtered = false;
            if (typeof item["filter"] === "function") {
                // filtered = Ext.callback(item['filter'], item['scope'], [message]);
                filtered = item["filter"].apply(this, [message]);
            }
            if (filtered !== true) {
                // if (typeof item["callback"]) {
                // console.log('fireBroadcastMessage...');
                // Ext.callback(item['callback'], item['scope'], [message]);
                item["callback"].apply(this, [message]);

            }
            // }
        });
    }
}

/*
* @param subscription {mtype: string, params: object, filter: function, callback: function, scope: object}
* @return subscriptionId
*/
function subscribeMessage(subscription) {
    if (isConnecting) {
        subscriptionCache.push(subscription);
        console.log("isConnecting, add subscription to cache.");
        return;
    }

    var mtype = subscription["mtype"];
    var params = subscription["params"];
    // determine need subscribe to server
    var need = true;
    var subscriptions = broadcastSubscriptions[mtype];
    // console.log(subscriptions);
    if (subscriptions) {
        // Ext.Array.each(subscriptions, function (item, index, allItems) {
        //     if (Ext.Object.equals(item['params'], params)) {
        //         need = false;
        //         return false;
        //     }
        // });
        subscriptions.map((item, index) => {
            if (item["params"] === params) {
                need = false;
                return false;
            }
        });
    }

    var subscriptionId = broadcastSubscriptionSeq++;
    subscription["subscriptionId"] = subscriptionId;

    if (!subscriptions) {
        subscriptions = [];
        broadcastSubscriptions[mtype] = subscriptions;
    }
    subscriptions.push(subscription);
    // console.log('Added subscription, mtype: ' + mtype + ', params: ' + Ext.encode(params));

    if (need) {
        var content = {
            stype: "subscribe",
            mtype: mtype,
            params: params
        };
        var json = JSON.stringify(content);
        subSocket.push(json);
        console.log("Subscribe to server: " + json);
    }
    return subscriptionId;
}

/*
* @param subscription {subscriptionId: number, mtype: string}
*/
function unsubscribeMessage(subscription) {
    var subscriptionId = subscription["subscriptionId"];
    var mtype = subscription["mtype"];
    // remove
    var subscriptions = broadcastSubscriptions[mtype];
    if (!subscriptions)
        return;
    var exist = false;
    var params = null;
    // Ext.Array.each(subscriptions, function (item, index, allItems) {
    //     if (item['subscriptionId'] == subscriptionId) {
    //         exist = true;
    //         params = item['params']
    //         Ext.Array.remove(subscriptions, item);
    //         console.log('Removed subscription, mtype: ' + mtype + ', params: ' + Ext.encode(params));
    //         return false;
    //     }
    // });
    subscriptions.map((item, index) => {
        if (item["subscriptionId"] === subscriptionId) {
            exist = true;
            params = item["params"];
            // Ext.Array.remove(subscriptions, item);
            subscriptions.splice(index, 1);
            // console.log('Removed subscription, mtype: ' + mtype + ', params: ' + Ext.encode(params));
            return false;
        }
    });
    if (exist === false)
        return;
    // determine need to unsubscribe to server
    var need = true;
    // Ext.Array.each(subscriptions, function (item, index, allItems) {
    //     if (Ext.Object.equals(item['params'], params)) {
    //         need = false;
    //         return false;
    //     }
    // });
    subscriptions.map((item, index) => {
        if (item["params"] == params) {
            need = false;
            return false;
        }
    });
    if (need) {
        var content = {
            stype: "unsubscribe",
            mtype: mtype,
            params: params
        };
        var json = JSON.stringify(content);
        subSocket.push(json);
        console.log("Unsubscribe to server: " + json);
    }
}

export default { connect, subscribeMessage, unsubscribeMessage };
