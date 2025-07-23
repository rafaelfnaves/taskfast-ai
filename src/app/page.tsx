'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading
    
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (session) {
      router.push('/dashboard')
    }
  }, [status, session, router])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  )
}
