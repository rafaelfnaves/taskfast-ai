'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TaskList } from '@/components/modules/TaskList'
import { TaskForm } from '@/components/modules/TaskForm'
import { Plus, Loader2 } from 'lucide-react'

export default function TasksPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  const handleTaskSave = () => {
    setShowTaskForm(false)
    setRefreshTrigger(prev => prev + 1)
  }

  const handleTaskCancel = () => {
    setShowTaskForm(false)
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando tarefas...</p>
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
          <h1 className="text-3xl font-bold">Minhas Tarefas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as suas tarefas em um só lugar
          </p>
        </div>
        <Button onClick={() => setShowTaskForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Tarefas</CardTitle>
          <CardDescription>
            Visualize, edite e gerencie suas tarefas com sugestões de IA
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
