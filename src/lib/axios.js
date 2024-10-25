import axios from "axios";
import { AUTH_SERVER_URL } from "../utils/constant";

export default axios.create({
    baseURL: AUTH_SERVER_URL,

})