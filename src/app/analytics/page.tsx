'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckSquare, 
  AlertTriangle,
  Brain,
  Loader2
} from 'lucide-react'

interface AnalyticsData {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
  aiSuggestions: number
  completionRate: number
  averageCompletionTime: number
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    aiSuggestions: 0,
    completionRate: 0,
    averageCompletionTime: 0
  })
  const [loading, setLoading] = useState(true)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!session?.user?.id) return

      try {
        setLoading(true)
        
        // Fetch tasks for analytics
        const tasksResponse = await fetch(`/api/tasks?userId=${session.user.id}`)
        const tasksData = await tasksResponse.json()
        
        if (tasksResponse.ok) {
          const tasks = tasksData.tasks || []
          const now = new Date()
          
          const analyticsData: AnalyticsData = {
            totalTasks: tasks.length,
            completedTasks: tasks.filter((t: any) => t.status === 'COMPLETED').length,
            pendingTasks: tasks.filter((t: any) => t.status === 'PENDING').length,
            overdueTasks: tasks.filter((t: any) => 
              t.dueDate && new Date(t.dueDate) < now && t.status !== 'COMPLETED'
            ).length,
            aiSuggestions: tasks.filter((t: any) => t.aiSuggestedPriority).length,
            completionRate: tasks.length > 0 ? 
              (tasks.filter((t: any) => t.status === 'COMPLETED').length / tasks.length) * 100 : 0,
            averageCompletionTime: 2.5 // Mock data - could be calculated from real data
          }
          
          setAnalytics(analyticsData)
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [session?.user?.id])

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando analytics...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null // Will redirect
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Insights sobre sua produtividade e desempenho
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              Todas as tarefas criadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Tarefas concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Atrasadas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              Precisam de atenção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sugestões IA</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.aiSuggestions}</div>
            <p className="text-xs text-muted-foreground">
              Priorizadas pela IA
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Status</CardTitle>
            <CardDescription>
              Como suas tarefas estão distribuídas por status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Concluídas</span>
              <span className="text-sm text-muted-foreground">{analytics.completedTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pendentes</span>
              <span className="text-sm text-muted-foreground">{analytics.pendingTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Atrasadas</span>
              <span className="text-sm text-muted-foreground">{analytics.overdueTasks}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtividade</CardTitle>
            <CardDescription>
              Métricas de desempenho e eficiência
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Taxa de Conclusão</span>
              <span className="text-sm text-muted-foreground">{analytics.completionRate.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tempo Médio</span>
              <span className="text-sm text-muted-foreground">{analytics.averageCompletionTime} dias</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Uso da IA</span>
              <span className="text-sm text-muted-foreground">
                {analytics.totalTasks > 0 ? ((analytics.aiSuggestions / analytics.totalTasks) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
