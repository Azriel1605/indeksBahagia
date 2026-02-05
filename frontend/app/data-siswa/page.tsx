"use client"

import { useState, useEffect } from "react"
// Hapus import RadarChart
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Save,
  X,
  LayoutDashboard,
  TrendingUp,
  ClipboardList,
  AlertTriangle,
  Send,
} from "lucide-react"
import { dataAPI } from "@/lib/api"
import RouteGuard from "@/components/route-guard"
// Impor komponen chart baru
import LineChartSekolah from "@/components/ui/line-chart"

// Interface SiswaData (Sama)
interface SiswaData {
  id: number
  username: string
  email: string
  role: string // Tetap ada di sini karena data dari API masih mengirimnya
  kode: string | null
  kelas: string | null
  skor_harian_terbaru: number | null
  created_at: string
}

// Interface Detail Dashboard (Disederhanakan)
interface SiswaDashboardDetail {
  id: number
  username: string
  email: string
  role: string
  kode: string | null
  kelas: string | null
  skor_terbaru: number | null

  // tren_30_hari dan dimensi DIHAPUS
  
  catatan_bk: {
    id: number
    date: string
    message: string
    creator_name: string
  }[]

  riwayat_alert: {
    id: number
    date: string
    jenis_alert: string
    status: string
  }[]
}

interface FilterOptions {
  // roles DIHAPUS
  kelas_list: string[]
}

function DataTableContent() {
  const [data, setData] = useState<SiswaData[]>([])
  const [selectedSiswaDashboard, setSelectedSiswaDashboard] = useState<SiswaDashboardDetail | null>(null)
  const [isDashboardOpen, setIsDashboardOpen] = useState(false)
  const [newNoteMessage, setNewNoteMessage] = useState("")

  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isTableLoading, setIsTableLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  // roles DIHAPUS dari filterOptions state
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ kelas_list: [] })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [perPage, setPerPage] = useState(10)

  const [searchTerm, setSearchTerm] = useState("")
  // roleFilter DIHAPUS
  const [kelasFilter, setKelasFilter] = useState("all")

  const [sortBy, setSortBy] = useState("username")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const [searchDebounce, setSearchDebounce] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchFilterOptions()
    fetchData(true)
  }, [])

  useEffect(() => {
    if (!isInitialLoading) {
      setCurrentPage(1)
      fetchData()
    }
  }, [searchDebounce, kelasFilter, sortBy, sortOrder]) // roleFilter DIHAPUS dari dependency array

  useEffect(() => {
    if (!isInitialLoading) {
      fetchData()
    }
  }, [currentPage, perPage])

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("")
        setError("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message, error])

  const fetchFilterOptions = async () => {
    try {
      const response = await dataAPI.getSiswaFilterOptions()
      if (response.ok) {
        const options = await response.json()
        
        // TAMBAHAN: Logika Sorting
        // Pastikan kelas_list ada dan berupa array sebelum di-sort
        if (options.kelas_list && Array.isArray(options.kelas_list)) {
          options.kelas_list.sort((a: string, b: string) => 
            // Numeric: true memastikan "2" dianggap lebih kecil dari "10"
            a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
          );
        }

        setFilterOptions(options) // API backend sekarang hanya mengembalikan kelas_list
      }
    } catch (error) {
      console.error("Error fetching filter options:", error)
    }
  }

  const fetchData = async (initial = false) => {
    if (initial) setIsInitialLoading(true)
    else setIsTableLoading(true)

    try {
      const filters = {
        search: searchDebounce,
        // role DIHAPUS
        kelas: kelasFilter === "all" ? "" : kelasFilter,
        sort_by: sortBy,
        sort_order: sortOrder,
      }

      const response = await dataAPI.getSiswa(currentPage, perPage, filters)
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
        setTotalPages(result.pages)
        setTotalItems(result.total)
        setSelectedIds([])
        setSelectAll(false)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Gagal memuat data siswa")
    } finally {
      if (initial) setIsInitialLoading(false)
      else setIsTableLoading(false)
    }
  }

  const fetchDashboardData = async (id: number) => {
    try {
      const response = await dataAPI.getSiswaDashboard(id)
      if (response.ok) {
        const data = await response.json()
        setSelectedSiswaDashboard(data) // Data tidak lagi berisi 'dimensi' or 'tren_30_hari'
        setIsDashboardOpen(true)
        setNewNoteMessage("")
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setError("Gagal memuat detail data dashboard siswa")
    }
  }

  const handleSaveNote = async () => {
    if (!selectedSiswaDashboard || !newNoteMessage) return

    setIsSaving(true)
    try {
      const response = await dataAPI.addNote(selectedSiswaDashboard.id, newNoteMessage)
      if (response.ok) {
        setMessage("Catatan berhasil disimpan")
        await fetchDashboardData(selectedSiswaDashboard.id)
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Gagal menyimpan catatan")
      }
    } catch (error) {
      setError("Terjadi kesalahan saat menyimpan catatan")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="h-4 w-4" />
    return sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const clearFilters = () => {
    setSearchTerm("")
    // setRoleFilter DIHAPUS
    setKelasFilter("all")
    setCurrentPage(1)
  }

  const getScoreBadge = (score: number | null) => {
    if (score === null || score === undefined) {
      return "bg-gray-100 text-gray-800"
    }
    if (score < 59) {
      return "bg-red-100 text-red-800"
    }
    if (score < 80) {
      return "bg-yellow-100 text-yellow-800"
    }
    return "bg-green-100 text-green-800"
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedIds(data.map((item) => item.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
      setSelectAll(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data siswa?`)) return

    try {
      const response = await dataAPI.bulkDeleteSiswa(selectedIds)
      if (response.ok) {
        setMessage(`${selectedIds.length} data berhasil dihapus`)
        fetchData()
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Gagal menghapus data")
      }
    } catch (error) {
      setError("Terjadi kesalahan saat menghapus data")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data siswa ini?")) return

    try {
      const response = await dataAPI.deleteSiswa(id)
      if (response.ok) {
        setMessage("Data berhasil dihapus")
        fetchData()
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Gagal menghapus data")
      }
    } catch (error) {
      setError("Terjadi kesalahan saat menghapus data")
    }
  }

  const TableSkeleton = () => (
    // ... (Skeleton tetap sama)
    <div className="space-y-3">
      {[...Array(perPage)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  )

  // getRadarData DIHAPUS

  if (isInitialLoading) {
    // ... (Loading state tetap sama)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Data Siswa</h1>
          <p className="mt-2 text-gray-600">Kelola dan lihat data siswa yang terdaftar</p>
        </div>

        {/* Messages */}
        {message && (
          <Alert className="mb-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Daftar Siswa</CardTitle>
            <CardDescription>Total {totalItems} data siswa terdaftar</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari username, email, kode, atau kelas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  
                  {/* Filter Role DIHAPUS */}

                  <Select value={kelasFilter} onValueChange={setKelasFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kelas</SelectItem>
                      {filterOptions.kelas_list.map((kelas) => (
                        <SelectItem key={kelas} value={kelas}>
                          {kelas}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedIds.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-700">{selectedIds.length} item dipilih</span>
                  <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus Terpilih
                  </Button>
                </div>
              )}
            </div>

            {/* Data Table */}
            <div className="relative">
              {isTableLoading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              )}

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                {isTableLoading ? (
                  <TableSkeleton />
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 w-12">
                          <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} aria-label="Select all" />
                        </th>
                        <th className="text-left p-4">
                          <Button variant="ghost" onClick={() => handleSort("username")} className="font-semibold">
                            Username
                            {getSortIcon("username")}
                          </Button>
                        </th>
                        <th className="text-left p-4">
                          <Button variant="ghost" onClick={() => handleSort("email")} className="font-semibold">
                            Email
                            {getSortIcon("email")}
                          </Button>
                        </th>
                        {/* Kolom Role bisa dihapus jika tidak ingin ditampilkan */}
                        {/* <th className="text-left p-4">
                          <Button variant="ghost" onClick={() => handleSort("role")} className="font-semibold">
                            Role
                            {getSortIcon("role")}
                          </Button>
                        </th> */}
                        <th className="text-left p-4">
                          <Button variant="ghost" onClick={() => handleSort("kode")} className="font-semibold">
                            Kode
                            {getSortIcon("kode")}
                          </Button>
                        </th>
                        <th className="text-left p-4">
                          <Button variant="ghost" onClick={() => handleSort("kelas")} className="font-semibold">
                            Kelas
                            {getSortIcon("kelas")}
                          </Button>
                        </th>
                        <th className="text-left p-4">Skor Harian</th>
                        <th className="text-center p-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((siswa) => (
                        <tr key={siswa.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <Checkbox
                              checked={selectedIds.includes(siswa.id)}
                              onCheckedChange={(checked) => handleSelectItem(siswa.id, checked as boolean)}
                              aria-label={`Select ${siswa.username}`}
                            />
                          </td>
                          <td className="p-4 font-medium">{siswa.username}</td>
                          <td className="p-4 text-sm">{siswa.email}</td>
                          {/* <td className="p-4">{siswa.role}</td> */}
                          <td className="p-4 font-mono text-sm">{siswa.kode || "-"}</td>
                          <td className="p-4">{siswa.kelas || "-"}</td>
                          <td className="p-4">
                            <Badge className={getScoreBadge(siswa.skor_harian_terbaru)}>
                              {siswa.skor_harian_terbaru !== null ? siswa.skor_harian_terbaru.toFixed(2) : "N/A"}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => fetchDashboardData(siswa.id)}>
                                <LayoutDashboard className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(siswa.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Mobile Cards (Kolom Role juga dihapus dari sini) */}
              <div className="lg:hidden space-y-4">
                {isTableLoading ? (
                  // ... (Skeleton Mobile tetap sama)
                  <div className="space-y-4">
                    {[...Array(perPage)].map((_, i) => (
                      <div key={i} className="p-4 border rounded-lg">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : (
                  data.map((siswa) => (
                    <div key={siswa.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={selectedIds.includes(siswa.id)}
                            onCheckedChange={(checked) => handleSelectItem(siswa.id, checked as boolean)}
                            aria-label={`Select ${siswa.username}`}
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">{siswa.username}</h3>
                            <p className="text-sm text-gray-500">{siswa.email}</p>
                          </div>
                        </div>
                        <Badge className={getScoreBadge(siswa.skor_harian_terbaru)}>
                          {siswa.skor_harian_terbaru !== null ? siswa.skor_harian_terbaru.toFixed(2) : "N/A"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Kelas:</span>
                          <p className="font-medium">{siswa.kelas || "-"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Kode:</span>
                          <p className="font-medium font-mono">{siswa.kode || "-"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => fetchDashboardData(siswa.id)}>
                          <LayoutDashboard className="h-4 w-4 mr-1" />
                          Dashboard
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(siswa.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pagination */}
            {/* ... (Pagination tetap sama) */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">
                  Menampilkan {(currentPage - 1) * perPage + 1} - {Math.min(currentPage * perPage, totalItems)} dari{" "}
                  {totalItems} data
                </span>
                <Select value={perPage.toString()} onValueChange={(value) => setPerPage(Number(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-gray-600">per halaman</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Sebelumnya
                </Button>
                <span className="text-sm text-gray-600">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Selanjutnya
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Modal (MODIFIED) */}
        <Dialog open={isDashboardOpen} onOpenChange={setIsDashboardOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedSiswaDashboard ? (
              <>
                <DialogHeader>
                  <DialogTitle>Dashboard Siswa: {selectedSiswaDashboard.username}</DialogTitle>
                  <DialogDescription>
                    Profil individu, tren, dan tindak lanjut untuk{" "}
                    <span className="font-medium">{selectedSiswaDashboard.email}</span>
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  {/* ... (Info dasar siswa tetap sama) */}
                   <div className="p-3 bg-gray-50 rounded-lg">
                    <Label className="text-xs text-gray-500">Kelas</Label>
                    <p className="font-semibold">{selectedSiswaDashboard.kelas || "-"}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Label className="text-xs text-gray-500">Kode</Label>
                    <p className="font-semibold font-mono">{selectedSiswaDashboard.kode || "-"}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Label className="text-xs text-gray-500">Skor SHI Terbaru</Label>
                    <p className={`font-semibold text-lg ${
                        selectedSiswaDashboard.skor_terbaru && selectedSiswaDashboard.skor_terbaru < 59 ? "text-red-600" : "text-green-600"
                    }`}>
                      {selectedSiswaDashboard.skor_terbaru ? selectedSiswaDashboard.skor_terbaru.toFixed(2) : "N/A"}
                    </p>
                  </div>
                </div>

                <Tabs defaultValue="grafik" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="grafik">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Grafik Tren
                    </TabsTrigger>
                    <TabsTrigger value="catatan">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Catatan BK
                    </TabsTrigger>
                    <TabsTrigger value="alert">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Riwayat Alert
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab 1: Grafik Tren (MODIFIED) */}
                  <TabsContent value="grafik" className="mt-4 space-y-8">
                    
                    {/* Komponen Line Chart LAMA DIHAPUS */}

                    {/* Komponen Line Chart BARU DITAMBAHKAN */}
                    <LineChartSekolah userId={selectedSiswaDashboard.id} />

                    {/* Indeks Dimensi (Radar Chart) DIHAPUS */}
                    
                  </TabsContent>

                  {/* Tab 2: Catatan Guru BK (Tetap sama) */}
                  <TabsContent value="catatan" className="mt-4">
                    {/* ... (Isi tab catatan tetap sama) */}
                    <h3 className="font-semibold text-lg mb-4">Catatan & Tindak Lanjut</h3>

                    {selectedSiswaDashboard.skor_terbaru && selectedSiswaDashboard.skor_terbaru < 59 ? (
                      <div className="mb-6 p-4 border border-yellow-300 bg-yellow-50 rounded-lg">
                        <Label htmlFor="new-note" className="font-semibold text-yellow-800">
                          Siswa ini memiliki skor SHI di bawah 59. Tambahkan catatan tindak lanjut:
                        </Label>
                        <Textarea
                          id="new-note"
                          className="mt-2"
                          placeholder="Tulis rencana tindak lanjut atau hasil konseling..."
                          value={newNoteMessage}
                          onChange={(e) => setNewNoteMessage(e.target.value)}
                        />
                        <Button onClick={handleSaveNote} disabled={isSaving || !newNoteMessage} className="mt-3 w-full sm:w-auto">
                          {isSaving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4 mr-2" />
                          )}
                          {isSaving ? "Menyimpan..." : "Simpan Catatan"}
                        </Button>
                      </div>
                    ) : (
                       <Alert className="mb-6">
                        <AlertDescription>Skor siswa saat ini tidak di bawah batas minimum (59) untuk catatan tindak lanjut.</AlertDescription>
                      </Alert>
                    )}

                    <h4 className="font-semibold mb-3">Riwayat Catatan</h4>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                      {selectedSiswaDashboard.catatan_bk.length > 0 ? (
                        selectedSiswaDashboard.catatan_bk.map((note) => (
                          <div key={note.id} className="text-sm p-3 bg-gray-50 rounded-md border">
                            <p className="mb-2">{note.message}</p>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>Oleh: <strong>{note.creator_name}</strong></span>
                              <span>{new Date(note.date).toLocaleString("id-ID")}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">Belum ada catatan.</p>
                      )}
                    </div>
                  </TabsContent>

                  {/* Tab 3: Riwayat Alert (Tetap sama) */}
                  <TabsContent value="alert" className="mt-4">
                    {/* ... (Isi tab alert tetap sama) */}
                    <h3 className="font-semibold text-lg mb-4">Riwayat Alert (SHI &lt; 59)</h3>
                    {selectedSiswaDashboard.riwayat_alert.length > 0 ? (
                       <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Tanggal</th>
                              <th className="text-left p-2">Jenis Alert</th>
                              <th className="text-left p-2">Status Penanganan</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedSiswaDashboard.riwayat_alert.map((alert) => (
                              <tr key={alert.id} className="border-b">
                                <td className="p-2">{new Date(alert.date).toLocaleDateString("id-ID")}</td>
                                <td className="p-2">
                                  <Badge variant="destructive">{alert.jenis_alert}</Badge>
                                </td>
                                <td className="p-2">{alert.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                       </div>
                    ) : (
                       <p className="text-gray-500 text-sm">Tidak ada riwayat alert.</p>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default function DataTablePage() {
  return (
    <RouteGuard requireAuth={true} allowedRoles={['admin', 'guru']}>
      <DataTableContent />
    </RouteGuard>
  )
}