import axios from "axios";

const api = axios.create({
  baseURL: "https://fspp-api.onrender.com/",
});

export default api;