import axios from "axios";
import { BASE_URL } from "../../config";
import { dispatch, store } from "../../redux/store";
import { setCredentials } from "../../redux/auth/authSlice";
import { axiosPublic } from "./axiosClient";

let failedQueue = [];
let isRefreshing = false;

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

function getCurrentAccessToken() {
  const accessToken = store.getState().auth.token;
  return accessToken;
}

const refresh = async () => {
  const response = await axiosPublic.get("/auth/refresh", {
    withCredentials: true,
  });
  dispatch(setCredentials({ token: response.data.data }));
  return response.data.data;
};

export function createPrivateAxios() {
  const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  const reqInterceptor = axiosPrivate.interceptors.request.use(
    (config) => {
      const token = getCurrentAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const resInterceptor = axiosPrivate.interceptors.response.use(
    (response) => {
      if (
        response.headers.hasContentType("application/json") &&
        typeof response.data === "string"
      ) {
        response.data = JSON.parse(response.data);
      }
      return response;
    },
    async (error) => {
      const prevReq = error?.config;
      if (error?.response?.status === 403 && !prevReq?.sent) {
        // problem is when there are 2 req, the rt of latter req will invalid cause of rt rotation
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            // add it to queue so it can be resolve latter, when processQueue call
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return axiosPrivate(prevReq);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
        isRefreshing = true;
        prevReq.sent = true;

        try {
          await refresh();
          processQueue(null);
          return axiosPrivate(prevReq);
        } catch (err) {
          console.log(err);
          processQueue(err);
          return Promise.reject(error);
        } finally {
          // the key is here, after we finish call this refresh, isRefreshing is assigned to false
          // api1 of useEffect1 was call, right after that api2 of useEffect2 was call
          // ( 2 child componenet of a parent comp have 2 useEffect call api)
          // when api1 call, isRefreshing was false, so isRefreshing=true,  prevReq.sent = true and call refresh
          // the key is api2 was call fater that see that isRefreshing=true, ok a promise was return that push this api2 to queue
          // and promise that when processQueue was call (resolve()), it will return axiosPrivate(prevReq) (2);
          // after refresh os api1 finish, processQueue was call, good, and folow that, api1 was return axiosPrivate(prevReq);
          // after resolve was call due to processQueue, it return (2)
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosPrivate;
}
