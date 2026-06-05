import apiClient from "@/lib/apiClient";

/**
 * Mengunggah satu file gambar ke server.
 * @param file File object dari input
 * @returns {Promise<string>} URL publik dari gambar yang diunggah
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await apiClient.post<{ url: string }>(
    "/upload/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  const relativeUrl = response.data.url;

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  return `${apiBaseUrl.replace(/\/$/, "")}${relativeUrl}`;
}
