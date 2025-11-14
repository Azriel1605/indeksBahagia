"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Heart,
  Home,
  TrendingUp,
  MapPin,
  Activity,
  AlertTriangle,
  CheckCircle,
  Eye,
  Loader2,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from "recharts"
import { dataAPI } from "@/lib/api"
import RouteGuard from "@/components/route-guard"
import SimpleWordcloud from "@/components/word-cloud"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

interface UrgentNeedDetail {
  id: number
  nama_lengkap: string
  nik: string
  alamat_lengkap: string
  rt: string
  rw: string
  kebutuhan: string[]
}

function DashboardContent() {
  const [isLoading, setIsLoading] = useState(true)
  return (
    <SimpleWordcloud />
  )

}

export default function DashboardPage() {
  return (
    <RouteGuard requireAuth={true} allowedRoles={['admin', 'guru']}>
      <DashboardContent />
    </RouteGuard>
  )
}
