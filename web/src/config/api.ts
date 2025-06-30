import axios from "axios";
import {env} from "./env";

const api = axios.create({
    baseURL: env.VITE_URL_API,
});

export {api};
