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
  (error) => {
    // --- Penanganan Error Dasar ---
    let errorMessage = "Terjadi kesalahan pada server.";

    if (error.response) {
      // Request dibuat dan server merespons dengan status error (4xx, 5xx)
      console.error("API Error Response:", error.response.data);
      errorMessage =
        error.response.data?.message ||
        error.response.statusText ||
        errorMessage;

      // Contoh: Jika error 401 (Unauthorized), mungkin token expired, paksa logout
      if (error.response.status === 401 && typeof window !== "undefined") {
        // Hapus token lama
        localStorage.removeItem("authToken");
        // Redirect ke halaman login (Anda mungkin perlu cara lain di Next.js)
        // window.location.href = '/sign-in';
        console.warn("Token tidak valid atau kedaluwarsa. Mohon login ulang.");
      }
    } else if (error.request) {
      // Request dibuat tapi tidak ada respons diterima (masalah jaringan?)
      console.error("API No Response:", error.request);
      errorMessage =
        "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
    } else {
      // Sesuatu terjadi saat menyiapkan request
      console.error("API Request Setup Error:", error.message);
      errorMessage = error.message;
    }

    // Kembalikan error agar bisa ditangani di komponen/tempat pemanggilan
    // Anda bisa juga melempar error kustom di sini
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
