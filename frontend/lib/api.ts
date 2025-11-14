import { UserRole } from "@/hooks/use-auth";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
export const dynamic = "force-dynamic";

// API helper function
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders = {
    "Content-Type": "application/json",
  }

  const config: RequestInit = {
    ...options,
    credentials: "include", // Important for session cookies
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

// Specific API functions
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

  forgotPassword: (email: string) =>
    apiCall("/api/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    apiCall("/api/reset-password", {
      method: "PUT",
      headers: {
      "Content-Type": "application/json" // ⬅️ tambahkan ini
    },
      body: JSON.stringify({ token, password }),
    }),

  // resetPassword: (token: string, newPassword: string) =>
  //   apiCall(`/api/forgot-password/${encodeURIComponent(token)}`,{
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ password: newPassword })
  //   }),
  }

export const dataAPI = {
  getLansia: (page = 1, perPage = 10, filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...filters,
    })
    return apiCall(`/api/lansia?${params}`)
  },

  getLansiaDetail: (id: number) => apiCall(`/api/lansia/${id}`),

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
}
