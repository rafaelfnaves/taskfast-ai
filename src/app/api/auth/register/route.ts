import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 8 caracteres' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Usuário já existe com este email' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        timezone: 'America/Sao_Paulo', // Default timezone for Brazil
        preferences: JSON.stringify({
          theme: 'light',
          notifications: {
            email: true,
            push: true,
            dueDateReminder: true,
            overdueAlert: true
          }
        })
      },
      select: {
        id: true,
        name: true,
        email: true,
        timezone: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      message: 'Usuário criado com sucesso',
      user
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
