export const ENV = "production"

export const API = ENV === "development" ? "http://localhost:3000" : "http://hireme.netlify.app/.netlify/functions/api/"