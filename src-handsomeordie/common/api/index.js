import axios from "axios";
import fetch from "./request";

let baseURL = "";
const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV === "development") {
    baseURL = "";
}
axios.defaults.baseURL = baseURL;

// account
export const login = params => fetch("/api/v1/user/login", params, "POST");