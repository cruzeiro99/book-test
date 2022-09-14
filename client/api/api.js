import axios from "axios"
import { ENV, API } from "constants";

const api = axios.create({
	baseURL: API
})

export default api;