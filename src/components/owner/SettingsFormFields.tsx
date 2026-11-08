/** Componentes reutilizáveis de formulário do editor de configurações do site. */
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

/** Uma lista de linhas de texto editáveis (adicionar, editar, remover, reordenar). */
export function LinesEditor({
  label,
  hint,
  rows,
  onChange,
}: {
  label: string
  hint?: string
  rows: string[]
  onChange: (rows: string[]) => void
}) {
  const update = (i: number, value: string) => {
    const next = [...rows]
    next[i] = value
    onChange(next)
  }
  const remove = (i: number) => onChange(rows.filter((_, j) => j !== i))
  const move = (i: number, delta: number) => {
    const j = i + delta
    if (j < 0 || j >= rows.length) return
    const next = [...rows]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold">{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-[11px]"
          onClick={() => onChange([...rows, ''])}
        >
          + Adicionar linha
        </Button>
      </div>
      {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <Input
              value={row}
              onChange={(e) => update(i, e.target.value)}
              className="text-xs"
              placeholder={`Linha ${i + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0 text-slate-400 hover:text-slate-700"
              title="Mover para cima"
              onClick={() => move(i, -1)}
              disabled={i === 0}
            >
              ↑
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0 text-slate-400 hover:text-slate-700"
              title="Mover para baixo"
              onClick={() => move(i, 1)}
              disabled={i === rows.length - 1}
            >
              ↓
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0 text-rose-500 hover:text-rose-700"
              title="Remover linha"
              onClick={() => remove(i)}
            >
              ✕
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Editor de um cartão de skill (título, descrição e bullets). */
export function SkillEditor({
  index,
  skill,
  onChange,
  onRemove,
}: {
  index: number
  skill: { title: string; description: string; bullets: string[] }
  onChange: (next: { title: string; description: string; bullets: string[] }) => void
  onRemove: () => void
}) {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-[11px]">
            Cartão {index + 1}
          </Badge>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-[11px] text-rose-500 hover:text-rose-700"
            onClick={onRemove}
          >
            Remover cartão
          </Button>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Título</Label>
          <Input
            value={skill.title}
            onChange={(e) => onChange({ ...skill, title: e.target.value })}
            className="text-xs"
            placeholder="Ex: Embraer & Boeing"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Descrição</Label>
          <Textarea
            value={skill.description}
            onChange={(e) => onChange({ ...skill, description: e.target.value })}
            className="text-xs"
            rows={3}
            placeholder="Resumo da experiência..."
          />
        </div>
        <LinesEditor
          label="Bullets"
          rows={skill.bullets}
          onChange={(bullets) => onChange({ ...skill, bullets })}
        />
      </CardContent>
    </Card>
  )
}
