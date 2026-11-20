import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import { useLanguage } from '@/lib/i18n'

export default function Profile() {
  const { user, isOwner, logout, refreshUser, requestVerification } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { t } = useLanguage()

  const [name, setName] = useState(user?.name || '')
  const [saving, setSaving] = useState(false)
  const [resendingVerification, setResendingVerification] = useState(false)

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">{t('profile.acessoRestrito')}</h2>
        <p className="text-slate-600 text-sm">{t('profile.loginNecessario')}</p>
        <Link to="/login">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            {t('common.fazerLogin')}
          </Button>
        </Link>
      </div>
    )
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setSaving(true)
    try {
      await pb.collection('users').update(user.id, {
        name: name.trim(),
      })
      refreshUser()
      toast({
        title: t('profile.perfilAtualizadoTitulo'),
        description: t('profile.perfilAtualizadoDesc'),
      })
    } catch (err) {
      console.error(err)
      toast({
        title: t('profile.erroAtualizarTitulo'),
        description: t('profile.erroAtualizarDesc'),
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleResendVerification = async () => {
    setResendingVerification(true)
    try {
      await requestVerification(user.email)
      toast({
        title: t('profile.verificacaoEnviadaTitulo'),
        description: t('profile.verificacaoEnviadaDesc', { email: user.email }),
      })
    } catch (err) {
      toast({
        title: t('profile.erroEnvioTitulo'),
        description: t('profile.erroEnvioDesc'),
        variant: 'destructive',
      })
    } finally {
      setResendingVerification(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{user.name}</h1>
              {isOwner && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                  {t('profile.donoAdmin')}
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleLogout}
          className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {t('profile.sairConta')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status card */}
        <Card className="md:col-span-1 border-border">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">{t('profile.statusConta')}</h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">{t('profile.verificacaoEmail')}:</span>
                {user.verified ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t('profile.confirmado')}
                  </span>
                ) : (
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {t('profile.pendente')}
                    </span>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleResendVerification}
                      disabled={resendingVerification}
                      className="p-0 h-auto text-xs text-blue-600"
                    >
                      {resendingVerification
                        ? t('common.enviando')
                        : t('profile.reenviarConfirmacao')}
                    </Button>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500 block mb-1">{t('profile.tipoAcesso')}:</span>
                <span className="font-semibold text-slate-800">
                  {isOwner ? t('profile.acessoProprietario') : t('profile.membroComunitario')}
                </span>
              </div>

              {isOwner && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-slate-500 block mb-1">{t('profile.atalhosGestao')}:</span>
                  <Link to="/painel" className="block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs text-blue-600"
                    >
                      <Layers className="w-3.5 h-3.5 mr-2" />
                      {t('profile.gerenciarConteudos')}
                    </Button>
                  </Link>
                  <Link to="/estatisticas" className="block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs text-slate-700"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-2" />
                      {t('profile.painelEstatisticas')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit profile form */}
        <Card className="md:col-span-2 border-border">
          <CardContent className="p-6 space-y-6">
            <h3 className="font-bold text-slate-900 text-sm">{t('profile.dadosPessoais')}</h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="prof-name" className="text-xs font-semibold">
                  {t('register.nomeCompleto')}
                </Label>
                <Input
                  id="prof-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-email" className="text-xs font-semibold">
                  {t('profile.enderecoEmail')}
                </Label>
                <Input
                  id="prof-email"
                  value={user.email}
                  disabled
                  className="bg-slate-50 text-slate-500 cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-400">{t('profile.emailRecuperacao')}</p>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-5"
                >
                  {saving ? t('common.salvando') : t('profile.salvarAlteracoes')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
