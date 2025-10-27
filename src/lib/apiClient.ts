import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    config.headers["Cache-Control"] = "no-cache";
    config.headers["Pragma"] = "no-cache";
    config.headers["Expires"] = "0";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: any) => {
    if (error.response) {
      return Promise.reject(error);
    }
    return Promise.reject(
      new Error(
        "Terjadi kesalahan jaringan atau koneksi. Silakan periksa internet Anda."
      )
    );
  }
);

export default apiClient;
