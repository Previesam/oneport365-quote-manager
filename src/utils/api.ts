import axios from "axios";

const Api = axios.create({
  baseURL: "https://test-api.oneport365.com/api/admin/quotes/assessment/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default Api;
