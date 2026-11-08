import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'

export default function Login() {
  const { login, requestPasswordReset } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)
    try {
      await login(email, password)
      toast({
        title: 'Bem-vindo de volta!',
        description: 'Login realizado com sucesso.',
      })
      navigate('/conteudos')
    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Falha no login',
        description: 'Verifique se seu e-mail e senha estão corretos.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast({
        title: 'Informe seu e-mail',
        description: 'Digite o e-mail no campo acima para enviarmos o link de recuperação.',
        variant: 'destructive',
      })
      return
    }

    try {
      await requestPasswordReset(email)
      setResetSent(true)
      toast({
        title: 'E-mail de recuperação enviado',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      })
    } catch (err) {
      toast({
        title: 'Erro ao solicitar recuperação',
        description: 'Verifique o e-mail informado e tente novamente.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mx-auto shadow-md">
          MS
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Entrar na Área de Membros
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Acesse conteúdos exclusivos e acompanhe materiais de Manoel Santos.
        </p>
      </div>

      <Card className="border-border shadow-md bg-white">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-xs font-semibold">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="pl-9 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password" className="text-xs font-semibold">
                  Senha
                </Label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha secreta"
                  className="pl-9 text-sm"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 text-sm shadow-sm"
            >
              {loading ? 'Entrando...' : 'Entrar na Conta'}
            </Button>
          </form>

          {resetSent && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs text-center">
              Instruções de redefinição enviadas para {email}.
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            Ainda não tem uma conta?{' '}
            <Link to="/cadastro" className="text-blue-600 font-bold hover:underline">
              Criar conta gratuita
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Ambiente seguro protegido por Skip Cloud</span>
      </div>
    </div>
  )
}
