import axios from "axios";

const env = process.env.NEXT_PUBLIC_ENV || "dev";
const appenv = process.env.NEXT_PUBLIC_APP_ENV || "quality";

interface BaseUrlConfig {
  [key: string]: {
    [key: string]: string | undefined;
  };
}

const baseUrl: BaseUrlConfig = {
  dev: {
    quality: process.env.NEXT_PUBLIC_API_URL_DEVQ,
    production: process.env.NEXT_PUBLIC_API_URL_DEVP,
  },
  live: {
    quality: process.env.NEXT_PUBLIC_API_URL_QAS,
    production: process.env.NEXT_PUBLIC_API_URL_PRD,
  },
}

const axiosInstance = axios.create({
  baseURL: baseUrl[env][appenv],
  withCredentials: true,
});

let interceptorsApplied = false;

interface Store {
  getState(): { auth: { accessToken?: string } };
  dispatch(action: { type: string; payload?: unknown }): void;
}

const setupInterceptors = (store: Store) => {
  if (interceptorsApplied) return;
  interceptorsApplied = true;

  console.log("🔥 Axios Interceptors Initialized");

  axiosInstance.interceptors.request.use(
    (config) => {
      config.headers["Content-Type"] = "application/json";
      config.headers["Accept"] = "application/json";
      config.headers['X-Requested-With'] = 'X';
      

      // Basic Auth (client only)
      if (typeof window !== "undefined") {
        const user = process.env.NEXT_PUBLIC_API_USR;
        const pass = process.env.NEXT_PUBLIC_API_PSS;
        const basic = btoa(`${user}:${pass}`);

        if (!config.url?.includes("/auth")) {
          config.headers["Authorization"] = `Basic ${basic}`;
        }
      }

      // Bearer token for /auth APIs
      if (config.url?.includes("/auth")) {
        const { accessToken } = store.getState().auth;
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config;

      if (!original) return Promise.reject(error);

      const exclude = ["/auth/login", "/auth/register", "/auth/refresh"];
      if (exclude.some((x) => original.url.includes(x))) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;

        try {
          const res = await axiosInstance.post("/auth/refresh");
          const token = res.data?.accessToken;

          if (token) {
            store.dispatch({
              type: "auth/setAccessToken",
              payload: token,
            });

            original.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(original);
          }
        } catch (refreshErr) {
          store.dispatch({ type: "auth/logout" });
          return Promise.reject(refreshErr);
        }
      }

      return Promise.reject(error);
    }
  );
};

// const baseUrl: any = {
//   dev: {
//     quality: process.env.NEXT_PUBLIC_API_URL_DEVQ,
//     production: process.env.NEXT_PUBLIC_API_URL_DEVP,
//   },
//   live: {
//     quality: process.env.NEXT_PUBLIC_API_URL_QAS,
//     production: process.env.NEXT_PUBLIC_API_URL_PRD,
//   },
// };

// const axiosInstance = axios.create({
//   baseURL: baseUrl[env][appenv],
//   withCredentials: true,
// });

// let interceptorsApplied = false;

// const setupInterceptors = (store: any) => {
//   if (interceptorsApplied) return;
//   interceptorsApplied = true;

//   console.log("🔥 Axios Interceptors Initialized");

//   axiosInstance.interceptors.request.use(
//     (config) => {
//       config.headers["Content-Type"] = "application/json";
//       config.headers["Accept"] = "application/json";
//       config.headers['X-Requested-With'] = 'X';
      

//       // Basic Auth (client only)
//       if (typeof window !== "undefined") {
//         const user = process.env.NEXT_PUBLIC_API_USR;
//         const pass = process.env.NEXT_PUBLIC_API_PSS;
//         const basic = btoa(`${user}:${pass}`);

//         if (!config.url?.includes("/auth")) {
//           config.headers["Authorization"] = `Basic ${basic}`;
//         }
//       }

//       // Bearer token for /auth APIs
//       if (config.url?.includes("/auth")) {
//         const { accessToken } = store.getState().auth;
//         if (accessToken) {
//           config.headers["Authorization"] = `Bearer ${accessToken}`;
//         }
//       }

//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   axiosInstance.interceptors.response.use(
//     (res) => res,
//     async (error) => {
//       const original = error.config;

//       if (!original) return Promise.reject(error);

//       const exclude = ["/auth/login", "/auth/register", "/auth/refresh"];
//       if (exclude.some((x) => original.url.includes(x))) {
//         return Promise.reject(error);
//       }

//       if (error.response?.status === 401 && !original._retry) {
//         original._retry = true;

//         try {
//           const res = await axiosInstance.post("/auth/refresh");
//           const token = res.data?.accessToken;

//           if (token) {
//             store.dispatch({
//               type: "auth/setAccessToken",
//               payload: token,
//             });

//             original.headers["Authorization"] = `Bearer ${token}`;
//             return axiosInstance(original);
//           }
//         } catch (refreshErr) {
//           store.dispatch({ type: "auth/logout" });
//           return Promise.reject(refreshErr);
//         }
//       }

//       return Promise.reject(error);
//     }
//   );
// };

export default axiosInstance;
export { setupInterceptors };
