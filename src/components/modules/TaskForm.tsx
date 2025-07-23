'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Brain, 
  Loader2, 
  Sparkles,
  Save,
  X
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface Task {
  id?: number
  title: string
  description?: string
  dueDate?: string
  category?: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
}

interface TaskFormProps {
  userId: string
  task?: Task
  onSave: (task: Task) => void
  onCancel: () => void
}

export function TaskForm({ userId, task, onSave, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState<Task>({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
    category: task?.category || '',
    priority: task?.priority || 'MEDIUM',
    status: task?.status || 'PENDING',
    ...task
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [error, setError] = useState('')
  const [aiSuggestion, setAiSuggestion] = useState<{
    priority: string
    reasoning: string
  } | null>(null)

  const isEditing = !!task?.id

  const handleInputChange = (field: keyof Task, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
  }

  const handleAiSuggestion = async () => {
    if (!formData.title.trim()) {
      toast.error('Adicione um título para obter sugestão da IA')
      return
    }

    setIsAiLoading(true)
    try {
      const response = await fetch('/api/tasks/prioritize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          dueDate: formData.dueDate,
          category: formData.category,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao obter sugestão da IA')
      }

      setAiSuggestion({
        priority: data.suggestedPriority,
        reasoning: data.reasoning
      })

      toast.success('Sugestão da IA obtida!', {
        description: `Prioridade sugerida: ${data.suggestedPriority}`
      })
    } catch (error) {
      console.error('Error getting AI suggestion:', error)
      toast.error('Erro ao obter sugestão da IA', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    } finally {
      setIsAiLoading(false)
    }
  }

  const applyAiSuggestion = () => {
    if (aiSuggestion) {
      setFormData(prev => ({
        ...prev,
        priority: aiSuggestion.priority as 'HIGH' | 'MEDIUM' | 'LOW'
      }))
      toast.success('Sugestão da IA aplicada!')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validation
    if (!formData.title.trim()) {
      setError('O título é obrigatório')
      setIsLoading(false)
      return
    }

    try {
      const taskData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        category: formData.category?.trim() || undefined,
        dueDate: formData.dueDate || undefined,
        userId: parseInt(userId),
      }

      let response
      if (isEditing) {
        response = await fetch(`/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        })
      } else {
        response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        })
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar tarefa')
      }

      toast.success(
        isEditing ? 'Tarefa atualizada com sucesso!' : 'Tarefa criada com sucesso!'
      )
      
      onSave(data.task)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setError(errorMessage)
      toast.error('Erro ao salvar tarefa', {
        description: errorMessage
      })
    } finally {
      setIsLoading(false)
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
      case 'LOW': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
        </CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Atualize as informações da sua tarefa'
            : 'Crie uma nova tarefa e obtenha sugestões de prioridade da IA'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* AI Suggestion Display */}
          {aiSuggestion && (
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Sugestão da IA:</strong> Prioridade{' '}
                    <Badge className={getPriorityColor(aiSuggestion.priority)}>
                      {formatPriority(aiSuggestion.priority)}
                    </Badge>
                    <p className="text-sm mt-1 text-muted-foreground">
                      {aiSuggestion.reasoning}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={applyAiSuggestion}
                    disabled={formData.priority === aiSuggestion.priority}
                  >
                    Aplicar
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Digite o título da tarefa"
                disabled={isLoading}
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descreva os detalhes da tarefa (opcional)"
                disabled={isLoading}
                rows={3}
              />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">Data de Vencimento</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="Ex: Trabalho, Pessoal, Estudos"
                disabled={isLoading}
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="priority">Prioridade</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAiSuggestion}
                  disabled={isAiLoading || isLoading}
                  className="text-xs"
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      IA...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-1 h-3 w-3" />
                      Sugestão IA
                    </>
                  )}
                </Button>
              </div>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange('priority', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status (only for editing) */}
            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                    <SelectItem value="COMPLETED">Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.title.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? 'Atualizar' : 'Criar'} Tarefa
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
