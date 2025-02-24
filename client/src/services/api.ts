import axios from "axios";
import storage from "./storage";
import Cookie from "js-cookie";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CONSUMER_SERVICE,
  headers: {
    'Content-Type': 'application/json'
  },
});

// Request interceptor
instance.interceptors.request.use(
  async (config) => {
    const token = storage.getAccessToken();
    if (token) {
      config.headers["Authorization"] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: any = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((promise: any) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });

  failedQueue = [];
};

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = 'Bearer ' + token;
            return instance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = storage.getRefreshToken();

      if (!refreshToken) {
        storage.clearStorage();
        const locale = Cookie.get("NEXT_LOCALE") || "vi";
        window.location.pathname = `/${locale}/login`;
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post("/auth/refresh", {});

        storage.updateAccessToken(data.RefreshToken.accessToken);
        storage.updateRefreshToken(data.RefreshToken.refreshToken);

        instance.defaults.headers.common["Authorization"] = 'Bearer ' + data.RefreshToken.accessToken;
        processQueue(null, data.RefreshToken.accessToken);

        return instance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        storage.clearStorage();
        const locale = Cookie.get("NEXT_LOCALE") || "vi";
        window.location.pathname = `/${locale}/login`;
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
