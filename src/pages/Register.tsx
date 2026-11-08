import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password) return

    if (password.length < 8) {
      toast({
        title: 'Senha muito curta',
        description: 'A senha deve conter no mínimo 8 caracteres.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      await register(name, email, password)
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Enviamos também um e-mail de confirmação para sua caixa de entrada.',
      })
      navigate('/conteudos')
    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Erro no cadastro',
        description: err?.message || 'Não foi possível criar sua conta. Tente outro e-mail.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mx-auto shadow-md">
          MS
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Criar Conta Gratuita
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Junte-se à comunidade de engenharia e acesse conteúdos abertos e prévias.
        </p>
      </div>

      <Card className="border-border shadow-md bg-white">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="reg-name" className="text-xs font-semibold">
                Nome Completo
              </Label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu Nome"
                  className="pl-9 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-email" className="text-xs font-semibold">
                Seu Melhor E-mail
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="reg-email"
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
              <Label htmlFor="reg-password" className="text-xs font-semibold">
                Criar Senha (mínimo 8 dígitos)
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={8}
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
              {loading ? 'Criando Conta...' : 'Cadastrar Gratuitamente'}
            </Button>
          </form>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Acesso instantâneo a artigos e episódios</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verificação de e-mail enviada automaticamente</span>
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-slate-600">
            Já tem uma conta cadastrada?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Fazer login
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Seus dados estão protegidos. Nenhum spam.</span>
      </div>
    </div>
  )
}
