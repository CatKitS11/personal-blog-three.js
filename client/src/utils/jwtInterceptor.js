import axios from "axios";

function jwtInterceptor() {
  axios.interceptors.request.use((req) => {
    const hasToken = Boolean(window.localStorage.getItem("token"));

    if (hasToken) {
      req.headers = {
        ...req.headers,
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      };
    }

    return req;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      const msg = error?.response?.data?.error || "";

      if (status === 401 && typeof msg === "string" && msg.includes("Unauthorized")) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("userRole");
      }

      return Promise.reject(error);
    }
  );
}

export default jwtInterceptor;