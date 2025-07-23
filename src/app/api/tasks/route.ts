import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

// GET /api/tasks - List tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status') as Status | null
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const where: any = {
      userId: parseInt(userId),
      deletedAt: null, // Only show non-deleted tasks
    }

    if (status) {
      where.status = status
    }

    if (category) {
      where.category = category
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
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

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, description, dueDate, category, priority } = body

    // Validation
    if (!userId || !title) {
      return NextResponse.json(
        { error: 'User ID and title are required' },
        { status: 400 }
      )
    }

    if (title.length > 200) {
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

    // Create task
    const task = await prisma.task.create({
      data: {
        userId: parseInt(userId),
        title: title.trim(),
        description: description?.trim() || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        category: category || null,
        priority: (priority as Priority) || 'MEDIUM',
        status: 'PENDING',
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

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
