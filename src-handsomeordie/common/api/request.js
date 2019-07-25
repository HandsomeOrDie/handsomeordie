import axios from "axios";
import qs from "qs";

axios.defaults.timeout = 10000;

axios.interceptors.request.use(
    config => {
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

axios.interceptors.response.use(
    res => {
        return res;
    },
    err => {
        return Promise.reject(err);
    }
);

export default async (url, params = {}, method = "POST", isUpload = false) => {
    const getCookie = name => {
        let value = "; " + document.cookie;
        let parts = value.split("; " + name + "=");
        if (parts.length === 2)
            return parts
                .pop()
                .split(";")
                .shift();
    };

    method = method.toUpperCase();
    if (method === "GET") {
        const res = await axios.get(url, {
            params
        });
        return res.data;
    } else if (method === "DELETE") {
        const res = await axios.delete(url, {
            params
        });
        return res.data;
    } else if (method === "POST") {
        const normal = {
            transformRequest: [
                function(data) {
                    return qs.stringify(data);
                }
            ],
            headers: { "X-CSRFToken": getCookie("csrftoken") }
        };
        const upload = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };
        const res = await axios.post(url, params, isUpload ? upload : normal);
        // console.log(res);
        return res.data;
    } else if (method === "POST_JSON") {
        const res = await axios.post(url, params, {
            headers: { "Content-Type":"application/json"}
            // headers: { "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}
        });
        return res.data;
    } else if (method === "GET_ENCODE") {
        const res = await axios.get(url);
        return res.data;
    }
};
