'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TaskList } from '@/components/modules/TaskList'
import { TaskForm } from '@/components/modules/TaskForm'
import { 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Brain,
  Plus,
  Loader2
} from 'lucide-react'

interface TaskStats {
  total: number
  pending: number
  inProgress: number
  completed: number
  overdue: number
  aiSuggestions: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    aiSuggestions: 0
  })
  const [loading, setLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.user?.id) return

      try {
        setLoading(true)
        
        // Fetch tasks for statistics
        const tasksResponse = await fetch(`/api/tasks?userId=${session.user.id}`)
        const tasksData = await tasksResponse.json()
        
        if (tasksResponse.ok) {
          const tasks = tasksData.tasks || []
          
          // Calculate statistics
          const now = new Date()
          const statsData: TaskStats = {
            total: tasks.length,
            pending: tasks.filter((t: any) => t.status === 'PENDING').length,
            inProgress: tasks.filter((t: any) => t.status === 'IN_PROGRESS').length,
            completed: tasks.filter((t: any) => t.status === 'COMPLETED').length,
            overdue: tasks.filter((t: any) => 
              t.dueDate && new Date(t.dueDate) < now && t.status !== 'COMPLETED'
            ).length,
            aiSuggestions: tasks.filter((t: any) => t.aiSuggestedPriority).length
          }
          
          setStats(statsData)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [session?.user?.id, refreshTrigger])

  const handleTaskSave = () => {
    setShowTaskForm(false)
    setRefreshTrigger(prev => prev + 1)
  }

  const handleTaskCancel = () => {
    setShowTaskForm(false)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null // Will redirect
  }

  if (showTaskForm) {
    return (
      <div className="container mx-auto py-8">
        <TaskForm
          userId={session?.user?.id || ''}
          onSave={handleTaskSave}
          onCancel={handleTaskCancel}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta, {session?.user?.name}!
          </p>
        </div>
        <Button onClick={() => setShowTaskForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Todas as suas tarefas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Tarefas ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Tarefas finalizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sugestões IA</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.aiSuggestions}</div>
            <p className="text-xs text-muted-foreground">
              Priorizadas pela IA
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>Suas Tarefas</CardTitle>
          <CardDescription>
            Gerencie suas tarefas e obtenha sugestões de prioridade da IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskList 
            userId={session?.user?.id || ''} 
            key={refreshTrigger}
          />
        </CardContent>
      </Card>
    </div>
  )
}
