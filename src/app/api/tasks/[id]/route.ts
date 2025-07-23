import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

// PUT /api/tasks/[id] - Update task
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const taskId = parseInt(params.id)
    const body = await request.json()
    const { title, description, dueDate, category, priority, status } = body

    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      )
    }

    // Check if task exists and is not deleted
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
      },
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Validation
    if (title && title.length > 200) {
      return NextResponse.json(
        { error: 'Title must be 200 characters or less' },
        { status: 400 }
      )
    }

    if (description && description.length > 1000) {
      return NextResponse.json(
        { error: 'Description must be 1000 characters or less' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: Record<string, any> = {}
    
    if (title !== undefined) updateData.title = title.trim()
    if (description !== undefined) updateData.description = description?.trim() || null
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null
    if (category !== undefined) updateData.category = category || null
    if (priority !== undefined) updateData.priority = priority as Priority
    if (status !== undefined) updateData.status = status as Status

    // Update task
    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ task })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id] - Soft delete task
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const taskId = parseInt(params.id)

    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      )
    }

    // Check if task exists and is not already deleted
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
      },
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Soft delete - set deletedAt timestamp
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        deletedAt: new Date(),
      },
    })

    return NextResponse.json({ 
      message: 'Task deleted successfully',
      task: {
        id: task.id,
        deletedAt: task.deletedAt,
      }
    })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/tasks/[id] - Get single task
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const taskId = parseInt(params.id)

    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      )
    }

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
