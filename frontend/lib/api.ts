// 📁 lib/api.ts

import { UserRole } from "@/hooks/use-auth";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
export const dynamic = "force-dynamic";

// ... (fungsi apiCall tetap sama)
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders = {
    "Content-Type": "application/json",
  }

  const config: RequestInit = {
    ...options,
    credentials: "include", 
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    return response
  } catch (error) {
    console.error("API call failed:", error)
    throw error
  }
}

// ... (authAPI tetap sama)
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    apiCall("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    apiCall("/api/logout", {
      method: "POST",
    }),

  checkAuth: () => apiCall("/api/check-auth"),

  validateToken: (token: string) =>
    apiCall(`/api/validate-token?token=${encodeURIComponent(token)}`, {
      method: "GET",
    }),


  forgotPassword: (email: string) =>
    apiCall("/api/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    apiCall("/api/reset-password", {
      method: "PUT",
      headers: {
      "Content-Type": "application/json"
    },
      body: JSON.stringify({ token, password }),
    }),

  createAccount: (email: string) =>
    apiCall("/api/create-account", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetAccount: (token: string, password: string, username:string) =>
    apiCall("/api/reset-account", {
      method: "PUT",
      headers: {
      "Content-Type": "application/json"
    },
      body: JSON.stringify({ token, password, username }),
    }),


  }


    



// --- dataAPI (MODIFIED) ---
export const dataAPI = {

  /**
   * Mengambil daftar siswa (filter role DIHAPUS).
   */
  getSiswa: (page = 1, perPage = 10, filters: any = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...filters, // filters sekarang hanya: search, kelas, sort_by, sort_order
    })
    return apiCall(`/api/siswa?${params.toString()}`)
  },

  /**
   * Mengambil data dashboard (backend telah dimodifikasi).
   */
  getSiswaDashboard: (id: number) => {
    return apiCall(`/api/siswa/dashboard/${id}`);
  },

  /**
   * Mengambil opsi filter (hanya kelas).
   */
  getSiswaFilterOptions: () => {
    return apiCall(`/api/siswa/filters`);
  },

  /**
   * Endpoint BARU untuk tren harian (7 hari).
   */
  getSiswaTrendHarian: (userId: number) => {
    return apiCall(`/api/siswa/tren/harian/${userId}`);
  },

  /**
   * Endpoint BARU untuk tren mingguan (4 pekan).
   */
  getSiswaTrendMingguan: (userId: number) => {
    return apiCall(`/api/siswa/tren/mingguan/${userId}`);
  },

  /**
   * Menambah catatan BK baru ke seorang siswa.
   */
  addNote: (targetId: number, message: string) => {
    return apiCall("/api/notes", {
      method: "POST",
      body: JSON.stringify({
        target_id: targetId,
        message: message,
      }),
    });
  },

  /**
   * Menghapus satu siswa berdasarkan ID.
   */
  deleteSiswa: (id: number) => {
    return apiCall(`/api/siswa/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Menghapus beberapa siswa sekaligus (bulk delete).
   */
  bulkDeleteSiswa: (ids: number[]) => {
    return apiCall("/api/siswa/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ ids: ids }),
    });
  },

  // --- FUNGSI LAMA ANDA (Tetap sama) ---
  // ... (getAccessClass, submitSurveyHarian, dst.)

  getAccessClass: () =>
    apiCall("/api/access-classes"),

  submitSurveyHarian: (data: any) =>
    apiCall("/api/submit-form-harian", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  submitSurveyMingguan: (data: any) =>
    apiCall("/api/submit-form-mingguan", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getSurveyStatus: (type: "harian" | "mingguan") =>
  apiCall("/api/status-survey", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type }),
  }),

  toggleSurveyAccess: (type: "harian" | "mingguan", action: "open" | "close") =>
  apiCall("/api/toggle-survey", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type, action }),
  }),

  validInput: (type: "harian" | "mingguan") =>
    apiCall(`/api/valid-input/${type}`),

  counterSubmit: (type: "harian" | "mingguan") =>
  apiCall("/api/counter-submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type }),
  }),

  getSHIToday: (type: "harian" | "mingguan") =>
  apiCall("/api/shi-overall", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type }),
  }),

  getOpenQuestion: (type: "harian" | "mingguan") =>
    apiCall("/api/word-cloud", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type }),
    }),

  getAlerts: (kelas: string, date: string) =>
    apiCall("/api/get-alerts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ kelas, date }),
    }),

  getHeatMap: (kelas: string, date: string, page: number = 1, limit: number = 20) =>
  apiCall("/api/heatmap", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ kelas, date, page, limit }),
  }),

  getTopLowTren: (kelas: string, date: string) =>
    apiCall("/api/get-top-low-tren", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ kelas, date }),
    }),

  getBarChart: (date: string) =>
    apiCall("/api/get-barchart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date }),
    }),

  /* PUBLIK: Mengambil tren harian rata-rata keseluruhan.
   */
  getOverallTrendHarian: () => {
    return apiCall(`/api/tren/overall/harian`);
  },

  /**
   * PUBLIK: Mengambil tren mingguan rata-rata keseluruhan.
   */
  getOverallTrendMingguan: () => {
    return apiCall(`/api/tren/overall/mingguan`);
  },
}