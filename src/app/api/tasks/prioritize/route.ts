import { NextRequest, NextResponse } from 'next/server'
import { suggestTaskPriority } from '@/lib/clients/openai'
import { prisma } from '@/lib/prisma'

type Priority = 'HIGH' | 'MEDIUM' | 'LOW'

// POST /api/tasks/prioritize - Suggest priority using AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, dueDate, taskId } = body

    // Validation
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Get AI suggestion
    const suggestion = await suggestTaskPriority({
      title,
      description,
      dueDate,
    })

    // Map Portuguese priorities to enum values
    const priorityMap: Record<string, Priority> = {
      'Alta': 'HIGH',
      'Média': 'MEDIUM',
      'Baixa': 'LOW',
    }

    const mappedPriority = priorityMap[suggestion.priority] || 'MEDIUM'

    // If taskId is provided, update the task with AI suggestion
    if (taskId) {
      try {
        const taskIdNum = parseInt(taskId)
        if (!isNaN(taskIdNum)) {
          await prisma.task.update({
            where: { id: taskIdNum },
            data: {
              aiSuggestedPriority: mappedPriority,
            },
          })
        }
      } catch (error) {
        console.error('Error updating task with AI suggestion:', error)
        // Continue even if update fails - we still return the suggestion
      }
    }

    return NextResponse.json({
      suggestion: {
        priority: suggestion.priority,
        mappedPriority,
        reason: suggestion.reason,
        confidence: 'high', // Could be enhanced with actual confidence scoring
      },
    })
  } catch (error) {
    console.error('Error getting AI priority suggestion:', error)
    return NextResponse.json(
      { error: 'Failed to get priority suggestion' },
      { status: 500 }
    )
  }
}

// GET /api/tasks/prioritize - Get prioritization rules (for documentation)
export async function GET() {
  return NextResponse.json({
    message: 'AI Task Prioritization Service',
    rules: {
      high: 'Tasks with urgent deadlines (≤1 day) or urgent keywords',
      medium: 'Tasks with near deadlines (2-3 days) or standard importance',
      low: 'Tasks with distant deadlines (>7 days) or low importance',
    },
    fallback: 'Rule-based system when AI is unavailable',
    supportedLanguage: 'Portuguese',
  })
}
