import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined in environment variables')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface TaskPriorityRequest {
  title: string
  description?: string
  dueDate?: string
}

export interface TaskPriorityResponse {
  priority: 'Alta' | 'Média' | 'Baixa'
  reason: string
}

export async function suggestTaskPriority(task: TaskPriorityRequest): Promise<TaskPriorityResponse> {
  try {
    const prompt = `Analise esta tarefa e sugira uma prioridade (Alta/Média/Baixa):
Título: ${task.title}
Descrição: ${task.description || 'Não informada'}
Prazo: ${task.dueDate || 'Não informado'}

Responda apenas: {'priority': 'Alta|Média|Baixa', 'reason': 'explicação breve'}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente especializado em análise de prioridades de tarefas. Responda sempre no formato JSON solicitado.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.3,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    const parsedResponse = JSON.parse(response) as TaskPriorityResponse
    return parsedResponse
  } catch (error) {
    console.error('Error suggesting task priority:', error)
    // Fallback to rule-based system
    return getFallbackPriority(task)
  }
}

function getFallbackPriority(task: TaskPriorityRequest): TaskPriorityResponse {
  // Rule-based fallback system
  if (task.dueDate) {
    const dueDate = new Date(task.dueDate)
    const now = new Date()
    const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24))
    
    if (daysDiff <= 1) {
      return { priority: 'Alta', reason: 'Prazo muito próximo (1 dia ou menos)' }
    } else if (daysDiff <= 3) {
      return { priority: 'Média', reason: 'Prazo próximo (2-3 dias)' }
    }
  }
  
  // Check for urgent keywords in title
  const urgentKeywords = ['urgente', 'emergência', 'crítico', 'imediato', 'asap']
  const hasUrgentKeyword = urgentKeywords.some(keyword => 
    task.title.toLowerCase().includes(keyword) || 
    task.description?.toLowerCase().includes(keyword)
  )
  
  if (hasUrgentKeyword) {
    return { priority: 'Alta', reason: 'Contém palavras-chave de urgência' }
  }
  
  return { priority: 'Média', reason: 'Prioridade padrão baseada em análise automática' }
}
