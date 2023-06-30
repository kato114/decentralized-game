import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const {
  MORALIS_BASE_URL,
  MORALIS_API_KEY,
  API_PROVIDER,
  ALCHEMY_BASE_URL,
  ALCHEMY_API_KEY,
} = process.env;

const moralisAxiosConfig = {
  baseURL: MORALIS_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": MORALIS_API_KEY,
  },
};

const alchemyAxiosConfig = {
  baseURL: ALCHEMY_BASE_URL + ALCHEMY_API_KEY,
};

const dgApi = axios.create(
  API_PROVIDER === "MORALIS" ? moralisAxiosConfig : alchemyAxiosConfig
);

export { dgApi };
