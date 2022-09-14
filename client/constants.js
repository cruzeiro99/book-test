export const ENV = "production"

export const API = ENV === "development" ? "http://localhost:3000" : "http://hire-me-mobix.netlify.app/.netlify/functions/api/"