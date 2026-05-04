import axios from "axios";

const API_URL = process.env.VITE_API_URL || "http://localhost:5000/api";

export default axios.create({ 
  baseURL: API_URL 
});