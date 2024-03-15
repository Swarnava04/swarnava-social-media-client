import axios from "axios";
import {
  KEY_ACCESS_TOKEN,
  getItem,
  removeItem,
  setItem,
} from "./localStorageManager";
import store from "../redux/store";
import { setLoading, setToast } from "../redux/slices/appConfigSlice";
import { TOAST_FAILURE } from "../App";
export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL,
  withCredentials: true,
});
axiosClient.interceptors.request.use((request) => {
  const accessToken = getItem(KEY_ACCESS_TOKEN);
  request.headers[
    "Access-Control-Allow-Origin"
  ] = `https://swarnava-social-media-client.vercel.app`;
  request.headers["Authorization"] = `Bearer ${accessToken}`;
  store.dispatch(setLoading(true));
  return request;
});

axiosClient.interceptors.response.use(
  async (response) => {
    store.dispatch(setLoading(false)); //this is for using loading bars during api calls
    const data = response.data;
    // console.log(response);
    if (data.status === "ok") {
      return data; //everyything is fine
    }
    const originalRequest = response.config;
    const statusCode = data.statusCode;
    const error = data.message;
    store.dispatch(
      setToast({
        type: TOAST_FAILURE,
        message: error,
      })
    );

    //this condition specifies that if the statusCode is 401 but it is because of refresh token getting expired, then it will redirect to the login page and remove the item
    // if (statusCode === 401 && originalRequest.url ===`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`) {
    //   removeItem(KEY_ACCESS_TOKEN);
    //   window.location.replace("/login", "_self");
    //   return Promise.reject(error);
    // }

    if (statusCode === 401 && !originalRequest._retry) {
      //only access token has expired
      //only access token has expired
      originalRequest._retry = true;
      const response = await axios
        .create({
          withCredentials: true,
        })
        .get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`);
      console.log(
        "respone from backend after refresh api being called",
        response
      );
      if (response.data.status === "ok") {
        // console.log(response);
        setItem(KEY_ACCESS_TOKEN, response.data.result);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.result}`;
        // console.log(originalRequest);
        return axios(originalRequest);
      } else {
        //refreshtoken is expired, thus we go back to the login page
        removeItem(KEY_ACCESS_TOKEN);
        window.location.replace("/login", "_self");
        return Promise.reject(error);
      }
    }
    //this is to handle any unexpected server error other than the code written above
    return Promise.reject(error);
  },
  async (error) => {
    store.dispatch(setLoading(false));
    store.dispatch(
      setToast({
        type: TOAST_FAILURE,
        message: error,
      })
    );
    return Promise.reject(error); //this is to handle network error
  }
);
