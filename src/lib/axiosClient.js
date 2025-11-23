import axios from "axios";
import { config } from "../config/env";

const axiosClient = axios.create({
  baseURL: config.API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default axiosClient;
