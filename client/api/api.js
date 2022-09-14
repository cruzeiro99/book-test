import axios from "axios"
import { ENV, API } from "constants";

const api = axios.create({
	baseURL: API
})
export const URIS = {
	image: (id) => `${API}/bookImage/${id}`
}

export default api;