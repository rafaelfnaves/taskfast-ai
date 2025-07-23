'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckSquare, Eye, EyeOff, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const passwordRequirements = [
    { text: 'Pelo menos 8 caracteres', met: formData.password.length >= 8 },
    { text: 'Pelo menos uma letra maiúscula', met: /[A-Z]/.test(formData.password) },
    { text: 'Pelo menos uma letra minúscula', met: /[a-z]/.test(formData.password) },
    { text: 'Pelo menos um número', met: /\d/.test(formData.password) },
  ]

  const isPasswordValid = passwordRequirements.every(req => req.met)
  const doPasswordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== ''

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Todos os campos são obrigatórios')
      setIsLoading(false)
      return
    }

    if (!isPasswordValid) {
      setError('A senha não atende aos requisitos mínimos')
      setIsLoading(false)
      return
    }

    if (!doPasswordsMatch) {
      setError('As senhas não coincidem')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao criar conta')
        toast.error('Erro no cadastro', {
          description: data.error || 'Não foi possível criar sua conta'
        })
        return
      }

      toast.success('Conta criada com sucesso!', {
        description: 'Você pode fazer login agora'
      })
      
      router.push('/auth/login')
    } catch (error) {
      setError('Erro inesperado. Tente novamente.')
      toast.error('Erro no sistema', {
        description: 'Ocorreu um erro inesperado. Tente novamente.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <CheckSquare className="h-12 w-12 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
              TaskFast AI
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Ou{' '}
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              faça login em sua conta existente
            </Link>
          </p>
        </div>

        {/* Register Form */}
        <Card>
          <CardHeader>
            <CardTitle>Criar Conta</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Seu nome completo"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center text-xs">
                        <Check 
                          className={`h-3 w-3 mr-2 ${
                            req.met ? 'text-green-500' : 'text-gray-400'
                          }`} 
                        />
                        <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {formData.confirmPassword && (
                  <div className="flex items-center text-xs mt-1">
                    <Check 
                      className={`h-3 w-3 mr-2 ${
                        doPasswordsMatch ? 'text-green-500' : 'text-red-500'
                      }`} 
                    />
                    <span className={doPasswordsMatch ? 'text-green-600' : 'text-red-500'}>
                      {doPasswordsMatch ? 'Senhas coincidem' : 'Senhas não coincidem'}
                    </span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !isPasswordValid || !doPasswordsMatch}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar conta'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Ao criar uma conta, você concorda com nossos{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-500">
              Termos de Serviço
            </Link>{' '}
            e{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
