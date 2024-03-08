import { Spot } from "@binance/connector"


// Main
// console.log(process.env.ORIG_WALLET_API_KEY, process.env.ORIG_WALLET_SECRET_KEY)
// export const Client = new Spot(process.env.ORIG_WALLET_API_KEY, process.env.ORIG_WALLET_SECRET_KEY)
// Text net
console.log(process.env.WALLET_API_KEY, process.env.WALLET_SECRET_KEY)
export const Client = new Spot(process.env.WALLET_API_KEY, process.env.WALLET_SECRET_KEY, { baseURL: "https://testnet.binance.vision" })

// Get account information
