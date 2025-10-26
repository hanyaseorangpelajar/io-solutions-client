import axios from "axios";

// 1. Ambil base URL API dari environment variable
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// 2. Buat instance Axios
const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 3. Interceptor: Modifikasi request SEBELUM dikirim
apiClient.interceptors.request.use(
  (config) => {
    // Cek apakah token ada di localStorage (atau tempat Anda menyimpannya nanti)
    // Kita gunakan 'authToken' sesuai nama variabel di Postman
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    if (token) {
      // Jika token ada, tambahkan header Authorization
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Lakukan sesuatu jika ada error saat konfigurasi request
    return Promise.reject(error);
  }
);

// 4. (Opsional) Interceptor: Modifikasi response SETELAH diterima
apiClient.interceptors.response.use(
  (response) => {
    // Jika response sukses (status 2xx), langsung kembalikan datanya
    return response.data;
  },
  (error: any) => {
    // Let Axios errors pass through, so they can be handled in try/catch blocks.
    // The previous implementation was creating a new error, which lost the
    // original context like `error.response`.
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx.
      // We will just forward the original Axios error.
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
