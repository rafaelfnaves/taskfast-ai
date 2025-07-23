'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  MoreHorizontal, 
  Calendar, 
  Brain, 
  Edit, 
  Trash2, 
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Task {
  id: number
  title: string
  description?: string
  dueDate?: string
  category?: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  aiSuggestedPriority?: 'HIGH' | 'MEDIUM' | 'LOW'
  createdAt: string
  updatedAt: string
}

interface TaskListProps {
  userId: string
  filter?: 'all' | 'pending' | 'in_progress' | 'completed'
  sortBy?: 'createdAt' | 'dueDate' | 'priority'
  sortOrder?: 'asc' | 'desc'
}

export function TaskList({ 
  userId, 
  filter = 'all', 
  sortBy = 'createdAt', 
  sortOrder = 'desc' 
}: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        userId,
        sortBy,
        sortOrder,
      })

      if (filter !== 'all') {
        params.append('status', filter.toUpperCase())
      }

      const response = await fetch(`/api/tasks?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar tarefas')
      }

      setTasks(data.tasks)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [userId, filter, sortBy, sortOrder])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
      case 'LOW': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
      case 'PENDING': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="h-4 w-4" />
      case 'IN_PROGRESS': return <Clock className="h-4 w-4" />
      case 'PENDING': return <AlertTriangle className="h-4 w-4" />
      default: return null
    }
  }

  const formatPriority = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'Alta'
      case 'MEDIUM': return 'Média'
      case 'LOW': return 'Baixa'
      default: return priority
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendente'
      case 'IN_PROGRESS': return 'Em Andamento'
      case 'COMPLETED': return 'Concluída'
      default: return status
    }
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar tarefa')
      }

      // Refresh tasks
      fetchTasks()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
      return
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir tarefa')
      }

      // Refresh tasks
      fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando tarefas...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button 
              variant="outline" 
              onClick={fetchTasks}
              className="mt-4"
            >
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <CheckCircle2 className="h-8 w-8 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
            <p className="text-sm text-muted-foreground mt-1">
              Crie sua primeira tarefa para começar!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className={`transition-all hover:shadow-md ${
          isOverdue(task.dueDate) ? 'border-red-200 dark:border-red-800' : ''
        }`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg truncate">{task.title}</h3>
                  {task.aiSuggestedPriority && (
                    <Badge variant="outline" className="text-xs">
                      <Brain className="h-3 w-3 mr-1" />
                      IA
                    </Badge>
                  )}
                  {isOverdue(task.dueDate) && (
                    <Badge variant="destructive" className="text-xs">
                      Atrasada
                    </Badge>
                  )}
                </div>

                {task.description && (
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {task.dueDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {format(new Date(task.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                  )}
                  {task.category && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                      {task.category}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Badge className={getPriorityColor(task.priority)}>
                  {formatPriority(task.priority)}
                </Badge>
                <Badge className={getStatusColor(task.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(task.status)}
                    {formatStatus(task.status)}
                  </span>
                </Badge>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}>
                      <Clock className="mr-2 h-4 w-4" />
                      Marcar em andamento
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'COMPLETED')}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Marcar como concluída
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
