export const ENV = "production"

export const API = ENV === "development" ? "http://localhost:3000/" : "/.netlify/functions/api/"