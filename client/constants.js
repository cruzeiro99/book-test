export const ENV = "development"
// export const ENV = "production"

let {href} = window.location;

export const API = ENV === "development" ? "http://localhost:3000/" : href+".netlify/functions/api/"